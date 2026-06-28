import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import Replicate from "replicate";
import { CAPSULES_TO_GENERATE } from "./capsule-prompts.mjs";

const UPLOADS_DIR = join(process.cwd(), "public/uploads/clothes");
const MODEL = "black-forest-labs/flux-schnell";
const THROTTLE_MS = 5000;

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] ??= value;
    }
  } catch {
    // .env.local optional when token already exported
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractImageUrl(output) {
  if (typeof output === "string") {
    return output;
  }
  if (Array.isArray(output) && output.length > 0) {
    return extractImageUrl(output[0]);
  }
  if (output && typeof output === "object" && "url" in output) {
    const url = output.url;
    if (typeof url === "function") {
      return url().href;
    }
    if (typeof url === "string") {
      return url;
    }
  }
  throw new Error("Unexpected Replicate output format");
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadToFile(remoteUrl, diskPath) {
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(diskPath, buffer);
}

async function generateImage(replicate, prompt, seed) {
  const output = await replicate.run(MODEL, {
    input: {
      prompt,
      seed,
      aspect_ratio: "3:4",
      num_outputs: 1,
      output_format: "webp",
      output_quality: 90,
    },
  });
  return extractImageUrl(output);
}

async function main() {
  loadEnvLocal();

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.error("REPLICATE_API_TOKEN is not set in .env.local");
    process.exit(1);
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  const replicate = new Replicate({ auth: token });

  const results = [];

  for (const capsule of CAPSULES_TO_GENERATE) {
    for (const variant of ["front", "back"]) {
      const filename =
        variant === "front" ? `${capsule.id}.webp` : `${capsule.id}-back.webp`;
      const diskPath = join(UPLOADS_DIR, filename);

      if (await fileExists(diskPath)) {
        console.log(`skip ${filename} (already exists)`);
        results.push({ file: filename, status: "skipped" });
        continue;
      }

      const prompt = variant === "front" ? capsule.front : capsule.back;
      console.log(`generating ${filename}…`);

      let lastError;
      for (let attempt = 0; attempt <= 3; attempt++) {
        try {
          const remoteUrl = await generateImage(replicate, prompt, capsule.seed);
          await downloadToFile(remoteUrl, diskPath);
          console.log(`saved ${filename}`);
          results.push({ file: filename, status: "ok" });
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          const message =
            error instanceof Error ? error.message : String(error);
          if (message.includes("429") && attempt < 3) {
            const wait = (attempt + 1) * 9000;
            console.warn(`rate limited — waiting ${wait / 1000}s…`);
            await sleep(wait);
            continue;
          }
        }
      }

      if (lastError) {
        console.error(`failed ${filename}:`, lastError);
        results.push({ file: filename, status: "failed" });
        process.exitCode = 1;
      }

      await sleep(THROTTLE_MS);
    }
  }

  console.log("\nSummary:");
  for (const row of results) {
    console.log(`  ${row.status.padEnd(7)} ${row.file}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { access, mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Replicate from "replicate";

const UPLOADS_DIR = join(process.cwd(), "public/uploads/clothes");
const MODEL = "black-forest-labs/flux-schnell";
const THROTTLE_MS = 5000;

const STYLE =
  "Style fusion: The Row, Reformation, Zara. Leica SL2, 85mm, soft studio light, off-white wall, Vogue editorial, 8k, single model, anatomically correct.";
const NEGATIVE =
  "Avoid: deformed limbs, extra legs, three feet, mutated hands, duplicate limbs, blurry, watermark, text.";

function buildPrompt(garment, variant) {
  const facing =
    variant === "front"
      ? "ONE model facing the camera"
      : "the SAME model from behind";
  return `High-end fashion editorial photograph of ${facing}, wearing ${garment}. ${STYLE} ${NEGATIVE}`;
}

const CAPSULES = [
  ["capsule-007", 7007, "a structured cotton poplin shirt dress in crisp optic white with button-front placket and knee-length hem", "the EXACT SAME white poplin shirt dress — identical fabric and tailoring — with back yoke and center back pleat"],
  ["capsule-008", 7008, "a champagne satin bias-cut midi skirt with high waist and gentle flare, paired with a fitted black tank", "the EXACT SAME champagne satin midi skirt — identical satin and drape — with clean back waistband, same black tank"],
  ["capsule-009", 7009, "a sand beige double-breasted long linen-blend coat with peak lapels and oversized silhouette below the knee", "the EXACT SAME sand beige long coat — identical linen texture and color — with center back seam and ventless back"],
  ["capsule-010", 7010, "a charcoal ribbed merino set: scoop-neck tank and high-waisted wide-leg trousers", "the EXACT SAME charcoal ribbed merino set — identical knit and color — scoop back tank and wide-leg trouser back"],
  ["capsule-011", 7011, "a black crepe one-shoulder floor-length gown with draped bodice and column silhouette", "the EXACT SAME black crepe one-shoulder gown — identical fabric and drape — open back with single strap"],
  ["capsule-012", 8012, "an oversized oatmeal heather cashmere crewneck with dropped shoulders, long ribbed sleeves, and black trousers", "the EXACT SAME oatmeal cashmere crewneck — identical knit, color, crew neck, sleeve length, and ribbed hem — same black trousers"],
].map(([id, seed, frontGarment, backGarment]) => ({
  id,
  seed,
  front: buildPrompt(frontGarment, "front"),
  back: buildPrompt(backGarment, "back"),
}));

function loadEnvLocal() {
  try {
    for (const line of readFileSync(join(process.cwd(), ".env.local"), "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] ??= value;
    }
  } catch {
    /* token may already be exported */
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractImageUrl(output) {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length) return extractImageUrl(output[0]);
  if (output?.url) return typeof output.url === "function" ? output.url().href : output.url;
  throw new Error("Unexpected Replicate output");
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

  for (const capsule of CAPSULES) {
    for (const variant of ["front", "back"]) {
      const filename = variant === "front" ? `${capsule.id}.webp` : `${capsule.id}-back.webp`;
      const diskPath = join(UPLOADS_DIR, filename);

      try {
        await access(diskPath);
        console.log(`skip ${filename}`);
        continue;
      } catch {
        /* generate */
      }

      console.log(`generating ${filename}…`);
      let saved = false;

      for (let attempt = 0; attempt <= 3 && !saved; attempt++) {
        try {
          const output = await replicate.run(MODEL, {
            input: {
              prompt: variant === "front" ? capsule.front : capsule.back,
              seed: capsule.seed,
              aspect_ratio: "3:4",
              num_outputs: 1,
              output_format: "webp",
              output_quality: 90,
            },
          });
          const response = await fetch(extractImageUrl(output));
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await writeFile(diskPath, Buffer.from(await response.arrayBuffer()));
          console.log(`saved ${filename}`);
          saved = true;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes("429") && attempt < 3) {
            await sleep((attempt + 1) * 9000);
            continue;
          }
          console.error(`failed ${filename}:`, error);
          process.exitCode = 1;
          break;
        }
      }

      await sleep(THROTTLE_MS);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

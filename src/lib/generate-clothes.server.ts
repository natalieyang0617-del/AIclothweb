import Replicate from "replicate";
import { getProductById } from "@/data/mockProducts";
import {
  buildFashionPrompt,
  CAPSULE_005_FRONT_CACHE_KEY,
  CAPSULE_005_IP_ADAPTER_NEGATIVE_PROMPT,
  CAPSULE_005_KNITWEAR_BACK_PROMPT,
  CAPSULE_005_STRUCTURE_REFERENCE,
  CAPSULE_005_STYLE_REFERENCE,
  isCapsule005PrecisionBack,
  resolveBaseProductId,
} from "@/lib/fashion-prompt";
import { ImagePersistenceError } from "@/lib/image-persistence";
import {
  deleteCachedImage,
  getCachedImagePath,
  getImageReferenceForReplicate,
  setCachedImageFromRemote,
} from "@/lib/image-manifest";

export interface GenerateClothesRequest {
  productId: string;
  garmentStyle?: string;
  garmentDescription?: string;
  variant?: "product" | "hero" | "back";
  forceRegenerate?: boolean;
}

export interface GenerateClothesResponse {
  productId: string;
  imageUrl: string;
  cached: boolean;
  prompt: string;
  seed: number;
  method?: "flux-schnell" | "ip-adapter-style-transfer";
}

const FLUX_SCHNELL_MODEL = "black-forest-labs/flux-schnell" as const;
const CAPSULE_005_IP_ADAPTER_MODEL =
  "black-forest-labs/flux-2-flex" as const;

function getReplicateClient(): Replicate {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }
  return new Replicate({ auth: token });
}

function extractImageUrl(output: unknown): string {
  if (typeof output === "string") {
    return output;
  }

  if (Array.isArray(output) && output.length > 0) {
    return extractImageUrl(output[0]);
  }

  if (
    output &&
    typeof output === "object" &&
    "url" in output &&
    typeof (output as { url: unknown }).url === "function"
  ) {
    return (output as { url: () => URL }).url().href;
  }

  throw new Error("Unexpected Replicate output format");
}

function deriveProductSeed(baseProductId: string): number {
  let hash = 0;
  for (let index = 0; index < baseProductId.length; index++) {
    hash = (hash << 5) - hash + baseProductId.charCodeAt(index);
    hash |= 0;
  }
  const seed = Math.abs(hash) % 2_147_483_647;
  return seed === 0 ? 42 : seed;
}

function resolveGenerationInput(input: GenerateClothesRequest) {
  const cacheKey = input.productId.trim();
  const isBackRequest =
    input.variant === "back" || cacheKey.endsWith("-back");
  const baseProductId = resolveBaseProductId(cacheKey);
  const product = getProductById(baseProductId);

  const garmentStyle =
    input.garmentStyle?.trim() || product?.title || baseProductId;

  const variant: "product" | "hero" | "back" = isBackRequest
    ? "back"
    : input.variant === "hero"
      ? "hero"
      : "product";

  let garmentDescription = "";
  if (input.garmentDescription?.trim()) {
    garmentDescription = input.garmentDescription.trim();
  } else if (product) {
    if (variant === "back" && product.backDescription) {
      garmentDescription = product.backDescription;
    } else if (variant === "product" && product.frontDescription) {
      garmentDescription = product.frontDescription;
    } else {
      garmentDescription = product.description;
    }
  }

  return {
    cacheKey,
    baseProductId,
    garmentStyle,
    garmentDescription,
    variant,
    seed: deriveProductSeed(baseProductId),
  };
}

async function persistGeneratedImage(
  cacheKey: string,
  replicateUrl: string,
): Promise<string> {
  try {
    return await setCachedImageFromRemote(cacheKey, replicateUrl);
  } catch (error) {
    if (error instanceof ImagePersistenceError) {
      throw new Error(
        `Image generated but failed to save locally for ${cacheKey}: ${error.message}`,
      );
    }
    throw error;
  }
}

async function generateCapsule005BackWithIpAdapter(
  replicate: Replicate,
  input: { frontReference: string; seed: number; prompt?: string },
): Promise<string> {
  const prompt = [
    input.prompt ?? CAPSULE_005_KNITWEAR_BACK_PROMPT,
    `Avoid: ${CAPSULE_005_IP_ADAPTER_NEGATIVE_PROMPT}`,
  ].join(" ");

  const output = await replicate.run(CAPSULE_005_IP_ADAPTER_MODEL, {
    input: {
      prompt,
      input_images: [input.frontReference],
      style_reference: CAPSULE_005_STYLE_REFERENCE,
      structure_reference: CAPSULE_005_STRUCTURE_REFERENCE,
      seed: input.seed,
      aspect_ratio: "3:4",
      output_format: "webp",
      output_quality: 90,
      steps: 28,
      guidance: 4.5,
      prompt_upsampling: false,
    },
  });

  return extractImageUrl(output);
}

export async function generateClothesImage(
  input: GenerateClothesRequest,
): Promise<GenerateClothesResponse> {
  const { forceRegenerate = false } = input;
  const { cacheKey, baseProductId, garmentStyle, garmentDescription, variant, seed } =
    resolveGenerationInput(input);

  const usePrecisionBack = isCapsule005PrecisionBack(baseProductId, variant);
  const prompt = usePrecisionBack
    ? CAPSULE_005_KNITWEAR_BACK_PROMPT
    : buildFashionPrompt({ garmentTitle: garmentStyle, garmentDescription, variant });
  const method = usePrecisionBack ? "ip-adapter-style-transfer" : "flux-schnell";

  if (forceRegenerate) {
    await deleteCachedImage(cacheKey);
  }

  const cachedPath = await getCachedImagePath(cacheKey);
  if (cachedPath) {
    return {
      productId: cacheKey,
      imageUrl: cachedPath,
      cached: true,
      prompt,
      seed,
      method,
    };
  }

  const replicate = getReplicateClient();

  if (usePrecisionBack) {
    const frontReference = await getImageReferenceForReplicate(
      CAPSULE_005_FRONT_CACHE_KEY,
    );

    if (frontReference) {
      const replicateUrl = await generateCapsule005BackWithIpAdapter(replicate, {
        frontReference,
        seed,
        prompt,
      });

      return {
        productId: cacheKey,
        imageUrl: await persistGeneratedImage(cacheKey, replicateUrl),
        cached: false,
        prompt,
        seed,
        method: "ip-adapter-style-transfer",
      };
    }
  }

  const output = await replicate.run(FLUX_SCHNELL_MODEL, {
    input: {
      prompt,
      seed,
      aspect_ratio: variant === "hero" ? "16:9" : "3:4",
      num_outputs: 1,
      output_format: "webp",
      output_quality: 90,
    },
  });

  return {
    productId: cacheKey,
    imageUrl: await persistGeneratedImage(cacheKey, extractImageUrl(output)),
    cached: false,
    prompt,
    seed,
    method: "flux-schnell",
  };
}

export interface FashionPromptInput {
  garmentTitle: string;
  garmentDescription: string;
  variant?: "product" | "hero" | "back";
}

const BACK_VIEW_SUFFIX =
  ", exact same garment but viewed strictly from the back, model turned completely away from the camera, full back profile, maintaining identical fabric and design.";

const ANATOMY_SAFETY =
  "Natural human limbs, clear leg separation, high-quality feet and hands, correct number of fingers and toes.";

const STYLE_FUSION =
  "Style Fusion: The Row's architectural minimalism, Reformation's romantic feminine drape, and Zara's sharp urban edge.";

const TECHNICAL_DETAILS =
  "Technical details: Shot on Leica SL2, 85mm lens, f/2.8. Soft natural window lighting with subtle shadows. High-detail fabric textures (linen weave, silk sheen, cashmere fuzz).";

const COMPOSITION_BASE =
  "Anatomy & Composition: Anatomically correct, natural standing pose. Background: minimalist, textured off-white plaster wall. 8k resolution, photorealistic, Vogue aesthetic.";

/** Knitwear structural inpainting prompt for capsule-005 back views. */
export const CAPSULE_005_KNITWEAR_BACK_PROMPT =
  "A high-end editorial lookbook photograph of ONE FEMALE professional model turned completely away from the camera, viewed strictly from the back. Maintaining her exact dark hair style, skin tone, and build. Wearing the exact black wool-gabardine pleated wider-leg puddle trousers from capsule-005-front. The upper garment is her minimalist technical WOOL-CASHMERE BLEND SWEATER. Viewed from the back, it features a seamless, perfectly smooth back panel. Crucial: NO COLLAR. NO BACK ZIPPER. A clean, uniform neckline curve that continues from the front high neck. The fabric must be a premium, soft, textured wool-cashmere blend, NOT windbreaker fabric. Background: minimalist plaster wall. Shot with Leica SL2 85mm. 8k, Vogue aesthetic. The overall silhouette must be that of a minimalist, high-end knitwear piece, turned around.";

export const CAPSULE_005_IP_ADAPTER_NEGATIVE_PROMPT =
  "trench coat, coat, jacket, high collar, collar, back zipper, zipper, utility shirt, utility top, gabardine shirt, windbreaker, technical shell, structured yoke, outerwear, male model, man, masculine, beard, male body, wrong gender, deformed, ugly, low quality, worst quality, different person, different model, frontal pose, facing camera";

export const CAPSULE_005_STYLE_REFERENCE = 1.0;
export const CAPSULE_005_STRUCTURE_REFERENCE = 0.1;
export const CAPSULE_005_FRONT_CACHE_KEY = "capsule-005";

export function isCapsule005PrecisionBack(
  baseProductId: string,
  variant: "product" | "hero" | "back",
): boolean {
  return baseProductId === "capsule-005" && variant === "back";
}

export function buildFashionPrompt({
  garmentTitle,
  garmentDescription,
  variant = "product",
}: FashionPromptInput): string {
  const subjectLine =
    variant === "hero"
      ? `A high-end fashion editorial lookbook photograph for ${garmentTitle}. ${garmentDescription}.`
      : variant === "back"
        ? `A high-end fashion editorial lookbook photograph of ONE professional model wearing ${garmentTitle}. ${garmentDescription}.`
        : `A high-end fashion editorial lookbook photograph of ONE professional model wearing ${garmentTitle}. ${garmentDescription}. Model facing the camera directly, front-facing pose, showcasing the garment from the front.`;

  const shotLine =
    variant === "hero"
      ? "Composition: A small group of 2–3 professional models maximum, each with correct human anatomy, cohesive styling, medium-wide editorial shot."
      : variant === "back"
        ? "Composition: Full body or medium shot of a single model turned completely away from the camera, centered framing, no duplicated limbs, strict rear profile only, emphasis on garment back details."
        : "Composition: Full body or medium shot of a single model facing the camera, centered framing, no duplicated limbs, front-facing editorial pose.";

  const prompt = [
    subjectLine,
    STYLE_FUSION,
    TECHNICAL_DETAILS,
    COMPOSITION_BASE,
    shotLine,
    ANATOMY_SAFETY,
  ].join(" ");

  if (variant === "back") {
    return `${prompt}${BACK_VIEW_SUFFIX}`;
  }

  return prompt;
}

export function resolveBaseProductId(productId: string): string {
  return productId.endsWith("-back")
    ? productId.slice(0, -"-back".length)
    : productId;
}

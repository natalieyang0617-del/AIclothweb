const STYLE_SUFFIX =
  "Style fusion: The Row architectural minimalism, Reformation romantic drape, Zara sharp urban edge. " +
  "Shot on Leica SL2, 85mm, f/2.8. Soft natural studio window light, clean off-white plaster wall background. " +
  "High-detail fabric texture, photorealistic, Vogue editorial, 8k. " +
  "Single model, anatomically correct, natural standing pose, centered framing, " +
  "one pair of legs, correct fingers and toes, clear limb separation.";

const NEGATIVE =
  "Avoid: deformed limbs, extra legs, three feet, mutated hands, disfigured, " +
  "duplicate limbs, missing limbs, fused fingers, extra fingers, cropped head, " +
  "blurry, low quality, watermark, text, logo, busy background, harsh flash.";

function buildPrompt(garmentDescription, variant) {
  const facing =
    variant === "front"
      ? "ONE model facing the camera, front-facing pose"
      : "the SAME model from behind, back-facing pose, model facing away from camera";

  return [
    `High-end fashion editorial photograph of ${facing}, wearing ${garmentDescription}.`,
    STYLE_SUFFIX,
    NEGATIVE,
  ].join(" ");
}

/** @type {Array<{ id: string; seed: number; front: string; back: string }>} */
export const CAPSULES_TO_GENERATE = [
  {
    id: "capsule-007",
    seed: 7007,
    front: buildPrompt(
      "a structured cotton poplin shirt dress in crisp optic white with button-front placket, sharp pointed collar, slightly oversized boxy bodice, dropped shoulders, and knee-length straight hem",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME structured cotton poplin shirt dress in crisp optic white — identical fabric, color, and tailoring — with back yoke seam, center back pleat, and knee-length hem",
      "back",
    ),
  },
  {
    id: "capsule-008",
    seed: 7008,
    front: buildPrompt(
      "a champagne satin bias-cut midi skirt with liquid drape and subtle sheen, high waist, clean waistband, mid-calf length with gentle flare, paired with a simple fitted black tank top",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME champagne satin bias-cut midi skirt — identical satin texture, color, and bias-cut drape — with clean back waistband and fluid mid-calf hem, paired with the same fitted black tank",
      "back",
    ),
  },
  {
    id: "capsule-009",
    seed: 7009,
    front: buildPrompt(
      "a sand beige double-breasted long coat in linen blend with peak lapels, six-button front, relaxed oversized silhouette, and length below the knee",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME sand beige double-breasted long coat — identical linen texture, sand color, and oversized tailoring — with center back seam and clean ventless back, length below knee",
      "back",
    ),
  },
  {
    id: "capsule-010",
    seed: 7010,
    front: buildPrompt(
      "a matching two-piece set in charcoal ribbed merino wool: scoop-neck tank top and high-waisted wide-leg trousers in the same charcoal ribbed knit",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME charcoal ribbed merino wool set — identical ribbed knit texture and charcoal color — scoop back on tank and clean wide-leg trouser back",
      "back",
    ),
  },
  {
    id: "capsule-011",
    seed: 7011,
    front: buildPrompt(
      "a black crepe one-shoulder floor-length gown with asymmetric single strap, elegant draped bodice, and column silhouette with subtle train",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME black crepe one-shoulder gown — identical crepe fabric, black color, and draped tailoring — with single strap over one shoulder, open back with elegant drape, floor-length column hem",
      "back",
    ),
  },
  {
    id: "capsule-012",
    seed: 8012,
    front: buildPrompt(
      "an oversized oatmeal heather cashmere crewneck sweater: fine-gauge brushed cashmere knit, classic crew neckline, dropped shoulders, long sleeves with wide ribbed cuffs, ribbed hem hitting high hip, relaxed boxy fit, paired with simple black straight-leg trousers",
      "front",
    ),
    back: buildPrompt(
      "the EXACT SAME oversized oatmeal heather cashmere crewneck sweater — identical fine-gauge brushed cashmere knit, identical oatmeal heather color, identical crew neckline, identical dropped shoulders, identical long sleeves with wide ribbed cuffs, identical ribbed hem length, identical relaxed boxy fit, same black straight-leg trousers",
      "back",
    ),
  },
];

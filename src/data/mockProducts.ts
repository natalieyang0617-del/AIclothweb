const UPLOADS = "/uploads/clothes";

export const DEFAULT_TARGET_VOTES = 50;

export const SITE_FOOTER = {
  brand: "Vibe · Collection 01",
  tagline: "Designed by demand. Manufactured on order.",
} as const;

export const HERO_LOOKBOOK = {
  imageUrl: `${UPLOADS}/hero-lookbook-2026.webp`,
  fallbackImageUrl:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0fe78?w=1200&q=85&auto=format&fit=crop",
} as const;

export interface Product {
  id: string;
  title: string;
  collectionSubtitle: string;
  description: string;
  imageUrl: string;
  backImageUrl: string;
  fallbackImageUrl: string;
  trendTags: string[];
  currentVotes: number;
  targetVotes: number;
  price: number;
  daysLeft: number;
}

type ProductSeed = Omit<Product, "imageUrl" | "backImageUrl" | "targetVotes">;

function product(seed: ProductSeed): Product {
  return {
    ...seed,
    imageUrl: `${UPLOADS}/${seed.id}.webp`,
    backImageUrl: `${UPLOADS}/${seed.id}-back.webp`,
    targetVotes: DEFAULT_TARGET_VOTES,
  };
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getAllProductIds(): string[] {
  return mockProducts.map((p) => p.id);
}

export const mockProducts: Product[] = [
  product({
    id: "capsule-001",
    title: "Asymmetric Silk Floral Slip Dress",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "An oversized, floor-length silk slip dress inspired by minimal luxury tailoring, layered with a vintage-inspired faded yellow watercolor floral pattern and a delicate cowl neckline.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600",
    trendTags: ["Quiet Luxury", "Romantic Minimalism", "Vintage Floral", "Slip Silhouette"],
    currentVotes: 38,
    price: 260,
    daysLeft: 4,
  }),
  product({
    id: "capsule-002",
    title: "Linen Strapless Tube Maxi Dress",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A strapless tube dress featuring a structured, body-hugging linen bodice with a signature smocked back, dropping into a fluid, relaxed everyday maxi hem.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0fe78?q=80&w=600",
    trendTags: ["Urban Tailored", "Romantic Minimalism", "Linen Texture", "Tube Silhouette"],
    currentVotes: 24,
    price: 145,
    daysLeft: 3,
  }),
  product({
    id: "capsule-003",
    title: "Oversized Wool Tailored Blazer",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A sharp, fluid oversized blazer crafted from premium wool-blend. Features ultra-clean, concealed button plackets inspired by high-end minimalism, fused with casual dropped shoulders.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
    trendTags: ["Quiet Luxury", "Urban Tailored", "Oversized Fit", "Wool Blend"],
    currentVotes: 42,
    price: 298,
    daysLeft: 5,
  }),
  product({
    id: "capsule-004",
    title: "Ribbed Cashmere Puff-Sleeve Top",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A premium fine-gauge ribbed cashmere mock-neck top featuring dramatic, romantic puffed shoulders and elongated cuffs. The perfect balance of high-cold luxury and feminine romance.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600",
    trendTags: ["Quiet Luxury", "Romantic Minimalism", "Cashmere Knit", "Puff Sleeve"],
    currentVotes: 31,
    price: 198,
    daysLeft: 2,
  }),
  product({
    id: "capsule-005",
    title: "Pleated Wide-Leg Tailored Trousers",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "High-waisted trousers with deep front pleats creating a dramatic, sweeping wide-leg puddle silhouette. Fused with subtle urban utility side pockets for a modern twist.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=600",
    trendTags: ["Quiet Luxury", "Urban Tailored", "Wide Leg", "Utility Detail"],
    currentVotes: 17,
    price: 185,
    daysLeft: 4,
  }),
  product({
    id: "capsule-006",
    title: "Open-Back Crochet Knit Midi Dress",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A column-silhouette midi dress made from a delicate, organic open-knit crochet texture with a high halter neckline and dramatic low-scoop open back.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600",
    trendTags: ["Romantic Minimalism", "Open Back", "Crochet Knit", "Column Silhouette"],
    currentVotes: 29,
    price: 168,
    daysLeft: 3,
  }),
  product({
    id: "capsule-007",
    title: "Structured Cotton Poplin Shirt Dress",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A crisp optic-white cotton poplin shirt dress with a sharp pointed collar, oversized boxy bodice, and clean knee-length hem — minimal tailoring meets everyday ease.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
    trendTags: ["Quiet Luxury", "Urban Tailored", "Shirt Dress", "Poplin"],
    currentVotes: 12,
    price: 175,
    daysLeft: 5,
  }),
  product({
    id: "capsule-008",
    title: "Satin Bias-Cut Midi Skirt",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A champagne satin bias-cut midi skirt with liquid drape and subtle sheen. High waist, clean waistband, and a gentle flare to mid-calf.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1583490280506-7638a3a3756b?q=80&w=600",
    trendTags: ["Romantic Minimalism", "Bias Cut", "Satin", "Midi Silhouette"],
    currentVotes: 19,
    price: 158,
    daysLeft: 4,
  }),
  product({
    id: "capsule-009",
    title: "Double-Breasted Linen-Blend Long Coat",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A sand beige double-breasted long coat in linen blend with peak lapels, six-button front, and a relaxed oversized silhouette falling below the knee.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
    trendTags: ["Quiet Luxury", "Urban Tailored", "Outerwear", "Linen Blend"],
    currentVotes: 27,
    price: 320,
    daysLeft: 6,
  }),
  product({
    id: "capsule-010",
    title: "Ribbed Merino Tank & Wide Leg Set",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A coordinated charcoal ribbed merino set: scoop-neck tank and high-waisted wide-leg trousers in matching knit. Clean lines, elevated comfort.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600",
    trendTags: ["Urban Tailored", "Knit Set", "Wide Leg", "Merino Wool"],
    currentVotes: 15,
    price: 210,
    daysLeft: 3,
  }),
  product({
    id: "capsule-011",
    title: "Draped One-Shoulder Crepe Gown",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A black crepe one-shoulder floor-length gown with an asymmetric strap, draped bodice, and column silhouette — minimal romance for evening.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600",
    trendTags: ["Romantic Minimalism", "One Shoulder", "Crepe", "Evening Column"],
    currentVotes: 33,
    price: 285,
    daysLeft: 5,
  }),
  product({
    id: "capsule-012",
    title: "Oversized Oatmeal Cashmere Crewneck",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A relaxed oversized crewneck in fine oatmeal heather cashmere with dropped shoulders, wide ribbed cuffs, and a soft brushed finish — quiet luxury layering for everyday.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600",
    trendTags: ["Quiet Luxury", "Cashmere Knit", "Oversized Fit", "Layering"],
    currentVotes: 21,
    price: 195,
    daysLeft: 4,
  }),
];

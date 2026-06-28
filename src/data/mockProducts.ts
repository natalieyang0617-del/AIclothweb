export const DEFAULT_TARGET_VOTES = 50;

export const SITE_FOOTER = {
  brand: "Vibe · Collection 01",
  tagline: "Designed by demand. Manufactured on order.",
} as const;

export interface Product {
  id: string;
  title: string;
  collectionSubtitle: string;
  description: string;
  frontDescription?: string;
  backDescription?: string;
  fallbackImageUrl: string;
  trendTags: string[];
  currentVotes: number;
  targetVotes: number;
  price: number;
  daysLeft: number;
}

export type ProductDisplay = Product & {
  imageUrl: string;
};

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

export function getAllProductIds(): string[] {
  return mockProducts.map((product) => product.id);
}

export const mockProducts: Product[] = [
  {
    id: "capsule-001",
    title: "Asymmetric Silk Floral Slip Dress",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "An oversized, floor-length silk slip dress inspired by minimal luxury tailoring, layered with a vintage-inspired faded yellow watercolor floral pattern and a delicate cowl neckline.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Romantic Minimalism",
      "Vintage Floral",
      "Slip Silhouette",
    ],
    currentVotes: 38,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 260,
    daysLeft: 4,
  },
  {
    id: "capsule-002",
    title: "Linen Strapless Tube Maxi Dress",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A strapless tube dress featuring a structured, body-hugging linen bodice with a signature smocked back, dropping into a fluid, relaxed everyday maxi hem.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0fe78?q=80&w=600",
    trendTags: [
      "Urban Tailored",
      "Romantic Minimalism",
      "Linen Texture",
      "Tube Silhouette",
    ],
    currentVotes: 24,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 145,
    daysLeft: 3,
  },
  {
    id: "capsule-003",
    title: "Oversized Wool Tailored Blazer",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A sharp, fluid oversized blazer crafted from premium wool-blend. Features ultra-clean, concealed button plackets inspired by high-end minimalism, fused with casual dropped shoulders.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Urban Tailored",
      "Oversized Fit",
      "Wool Blend",
    ],
    currentVotes: 42,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 298,
    daysLeft: 5,
  },
  {
    id: "capsule-004",
    title: "Ribbed Cashmere Puff-Sleeve Top",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A premium fine-gauge ribbed cashmere mock-neck top featuring dramatic, romantic puffed shoulders and elongated cuffs. The perfect balance of high-cold luxury and feminine romance.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Romantic Minimalism",
      "Cashmere Knit",
      "Puff Sleeve",
    ],
    currentVotes: 31,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 198,
    daysLeft: 2,
  },
  {
    id: "capsule-005",
    title: "Pleated Wide-Leg Tailored Trousers",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "High-waisted trousers with deep front pleats creating a dramatic, sweeping wide-leg puddle silhouette. Fused with subtle urban utility side pockets for a modern twist.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Urban Tailored",
      "Wide Leg",
      "Utility Detail",
    ],
    currentVotes: 17,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 185,
    daysLeft: 4,
  },
  {
    id: "capsule-006",
    title: "Open-Back Crochet Knit Midi Dress",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A column-silhouette midi dress made from a delicate, organic open-knit crochet texture with a high halter neckline and dramatic low-scoop open back.",
    frontDescription:
      "A model posing from the front, showcasing the elegant high halter neckline texture of the open-knit crochet midi dress.",
    backDescription:
      "The same open-knit crochet midi dress seen from behind, revealing the dramatic low-scoop open back and halter strap structure.",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600",
    trendTags: [
      "Romantic Minimalism",
      "Open Back",
      "Crochet Knit",
      "Column Silhouette",
    ],
    currentVotes: 29,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 168,
    daysLeft: 3,
  },
];

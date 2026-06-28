const UPLOADS = "/uploads/clothes";

const productImage = (id: string) => `${UPLOADS}/${id}.webp`;
const backImage = (id: string) => `${UPLOADS}/${id}-back.webp`;

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
  frontDescription?: string;
  backDescription?: string;
  imageUrl: string;
  backImageUrl: string;
  fallbackImageUrl: string;
  trendTags: string[];
  currentVotes: number;
  targetVotes: number;
  price: number;
  daysLeft: number;
}

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
    imageUrl: productImage("capsule-001"),
    backImageUrl: backImage("capsule-001"),
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
    imageUrl: productImage("capsule-002"),
    backImageUrl: backImage("capsule-002"),
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
    imageUrl: productImage("capsule-003"),
    backImageUrl: backImage("capsule-003"),
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
    imageUrl: productImage("capsule-004"),
    backImageUrl: backImage("capsule-004"),
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
    imageUrl: productImage("capsule-005"),
    backImageUrl: backImage("capsule-005"),
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
    imageUrl: productImage("capsule-006"),
    backImageUrl: backImage("capsule-006"),
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
  {
    id: "capsule-007",
    title: "Structured Cotton Poplin Shirt Dress",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A crisp optic-white cotton poplin shirt dress with a sharp pointed collar, oversized boxy bodice, and clean knee-length hem — minimal tailoring meets everyday ease.",
    frontDescription:
      "Button-front placket, dropped shoulders, and a straight knee-length cut on crisp white poplin.",
    backDescription:
      "Back yoke seam and center back pleat on the same white poplin shirt dress.",
    imageUrl: productImage("capsule-007"),
    backImageUrl: backImage("capsule-007"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Urban Tailored",
      "Shirt Dress",
      "Poplin",
    ],
    currentVotes: 12,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 175,
    daysLeft: 5,
  },
  {
    id: "capsule-008",
    title: "Satin Bias-Cut Midi Skirt",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A champagne satin bias-cut midi skirt with liquid drape and subtle sheen. High waist, clean waistband, and a gentle flare to mid-calf.",
    frontDescription:
      "Champagne satin midi skirt with high waist and fluid bias-cut drape, styled with a fitted black tank.",
    backDescription:
      "Same champagne satin skirt from behind, showing clean back waistband and fluid hem movement.",
    imageUrl: productImage("capsule-008"),
    backImageUrl: backImage("capsule-008"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1583490280506-7638a3a3756b?q=80&w=600",
    trendTags: [
      "Romantic Minimalism",
      "Bias Cut",
      "Satin",
      "Midi Silhouette",
    ],
    currentVotes: 19,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 158,
    daysLeft: 4,
  },
  {
    id: "capsule-009",
    title: "Double-Breasted Linen-Blend Long Coat",
    collectionSubtitle: "Urban Tailored Capsule",
    description:
      "A sand beige double-breasted long coat in linen blend with peak lapels, six-button front, and a relaxed oversized silhouette falling below the knee.",
    frontDescription:
      "Peak lapels and six-button double-breasted front on sand beige linen-blend coat.",
    backDescription:
      "Center back seam and clean ventless back on the same sand beige long coat.",
    imageUrl: productImage("capsule-009"),
    backImageUrl: backImage("capsule-009"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Urban Tailored",
      "Outerwear",
      "Linen Blend",
    ],
    currentVotes: 27,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 320,
    daysLeft: 6,
  },
  {
    id: "capsule-010",
    title: "Ribbed Merino Tank & Wide Leg Set",
    collectionSubtitle: "Urban Romantic Capsule",
    description:
      "A coordinated charcoal ribbed merino set: scoop-neck tank and high-waisted wide-leg trousers in matching knit. Clean lines, elevated comfort.",
    frontDescription:
      "Charcoal ribbed merino tank with scoop neck paired with matching high-waisted wide-leg trousers.",
    backDescription:
      "Same charcoal ribbed set from behind — scoop back tank and clean wide-leg trouser silhouette.",
    imageUrl: productImage("capsule-010"),
    backImageUrl: backImage("capsule-010"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600",
    trendTags: [
      "Urban Tailored",
      "Knit Set",
      "Wide Leg",
      "Merino Wool",
    ],
    currentVotes: 15,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 210,
    daysLeft: 3,
  },
  {
    id: "capsule-011",
    title: "Draped One-Shoulder Crepe Gown",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A black crepe one-shoulder floor-length gown with an asymmetric strap, draped bodice, and column silhouette — minimal romance for evening.",
    frontDescription:
      "Asymmetric one-shoulder strap and draped bodice on a black crepe floor-length column gown.",
    backDescription:
      "Open back with elegant drape and single strap on the same black crepe gown.",
    imageUrl: productImage("capsule-011"),
    backImageUrl: backImage("capsule-011"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600",
    trendTags: [
      "Romantic Minimalism",
      "One Shoulder",
      "Crepe",
      "Evening Column",
    ],
    currentVotes: 33,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 285,
    daysLeft: 5,
  },
  {
    id: "capsule-012",
    title: "Oversized Oatmeal Cashmere Crewneck",
    collectionSubtitle: "Minimalist Romance Collection",
    description:
      "A relaxed oversized crewneck in fine oatmeal heather cashmere with dropped shoulders, wide ribbed cuffs, and a soft brushed finish — quiet luxury layering for everyday.",
    frontDescription:
      "Oatmeal heather cashmere crewneck with dropped shoulders, long sleeves, and ribbed cuffs over black trousers.",
    backDescription:
      "Same oatmeal cashmere sweater from behind — matching crew neck, sleeve length, ribbed hem, and relaxed boxy fit.",
    imageUrl: productImage("capsule-012"),
    backImageUrl: backImage("capsule-012"),
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600",
    trendTags: [
      "Quiet Luxury",
      "Cashmere Knit",
      "Oversized Fit",
      "Layering",
    ],
    currentVotes: 21,
    targetVotes: DEFAULT_TARGET_VOTES,
    price: 195,
    daysLeft: 4,
  },
];

import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getAllProductIds, getProductById } from "@/data/mockProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} — Vibe`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}

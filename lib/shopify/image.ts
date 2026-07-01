import type { ShopifyProductDetail } from "./queries";

export const SHOPIFY_IMAGE_WIDTH = {
  thumb: 120,
  card: 800,
  detail: 1400,
} as const;

const SHOPIFY_CDN_HOST = "cdn.shopify.com";

export function isShopifyCdnUrl(url: string) {
  try {
    return new URL(url).hostname === SHOPIFY_CDN_HOST;
  } catch {
    return false;
  }
}

export function shopifyImageUrl(url: string, width: number) {
  if (!isShopifyCdnUrl(url)) return url;

  const parsed = new URL(url);
  parsed.searchParams.set("width", String(width));
  return parsed.toString();
}

export function getUniqueProductImageUrls(product: ShopifyProductDetail) {
  const urls = new Set<string>([product.imageUrl]);

  for (const variant of product.variants) {
    if (variant.imageUrl) {
      urls.add(variant.imageUrl);
    }
  }

  return [...urls];
}

export function prefetchShopifyImages(urls: string[], width: number) {
  for (const url of urls) {
    const img = new window.Image();
    img.src = shopifyImageUrl(url, width);
  }
}

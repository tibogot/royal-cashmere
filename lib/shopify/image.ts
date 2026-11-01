import { getImageProps, type ImageLoader } from "next/image";
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

// Shopify's CDN resizes on its own, so each srcset width is asked of it
// directly instead of being proxied through /_next/image.
export const shopifyImageLoader: ImageLoader = ({ src, width }) =>
  shopifyImageUrl(src, width);

// Warms the cache for images shown later (other colours of a product). Waits
// for the page to finish loading so it never competes with the visible image,
// and uses the same srcset and sizes so the browser picks the same file.
export function prefetchShopifyImages(urls: string[], sizes: string) {
  const prefetch = () => {
    for (const url of urls) {
      const {
        props: { srcSet },
      } = getImageProps({
        src: url,
        alt: "",
        fill: true,
        sizes,
        loader: shopifyImageLoader,
      });
      const img = new window.Image();
      img.sizes = sizes;
      if (srcSet) img.srcset = srcSet;
      img.src = shopifyImageUrl(url, SHOPIFY_IMAGE_WIDTH.detail);
    }
  };

  const whenIdle = () => {
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 200);
    }
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

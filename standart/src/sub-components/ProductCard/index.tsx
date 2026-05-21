import { observer } from "@ikas/component-utils";
import { useRef } from "preact/hooks";
import {
  IkasProduct,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  getProductVariantFormattedDiscountAmount,
  getProductVariantDiscountPercentage,
  hasProductVariantDiscount,
  hasProductVariantStock,
  getProductHref,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import type { SliderAspectRatio } from "../../global-types";
import ProductRating from "../ProductRating";

interface Props {
  product: IkasProduct;
  aspectRatio: SliderAspectRatio;
  showProductName: boolean;
  showPrice: boolean;
  showRating: boolean;
  reviewCountLabel: string;
  enableHoverImage?: boolean;
  imageAltPrefix: string;
  saleLabel: string;
  soldOutLabel: string;
  offLabel: string;
  savingsBadgeStyle: "amount" | "percent";
}

const ProductCard = observer(function ProductCard({
  product,
  aspectRatio,
  showProductName,
  showPrice,
  showRating,
  reviewCountLabel,
  enableHoverImage,
  imageAltPrefix,
  saleLabel,
  soldOutLabel,
  offLabel,
  savingsBadgeStyle,
}: Props) {
  if (!product) return null;

  const variant = getSelectedProductVariant(product);
  const productImage = getProductVariantMainImage(variant);
  const image = productImage?.image;
  const imgSrc = image ? getDefaultSrc(image) : null;

  let hoverSrc: string | null = null;
  let hoverIsVideo = false;
  if (enableHoverImage && variant?.images && variant.images.length > 1) {
    const sorted = [...variant.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const videoEntry = sorted.find((i) => i.isVideo);
    if (videoEntry?.image) {
      hoverSrc = getDefaultSrc(videoEntry.image);
      hoverIsVideo = true;
    } else {
      const stills = sorted.filter((i) => !i.isVideo);
      const mainId = productImage?.imageId ?? null;
      const next = stills.find((i) => i.imageId !== mainId) ?? stills[1];
      const hoverImage = next?.image;
      if (hoverImage) hoverSrc = getDefaultSrc(hoverImage);
    }
  }

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };
  const finalPrice = getProductVariantFormattedFinalPrice(variant);
  const sellPrice = getProductVariantFormattedSellPrice(variant);
  const hasDiscount = hasProductVariantDiscount(variant);
  const inStock = hasProductVariantStock(variant);
  const isSoldOut = !inStock;
  let savingsLabel: string | null = null;
  if (hasDiscount) {
    let head: string | null = null;
    if (savingsBadgeStyle === "percent") {
      const pct = getProductVariantDiscountPercentage(variant);
      if (pct) head = `%${pct}`;
    } else {
      const amount = getProductVariantFormattedDiscountAmount(variant);
      if (amount) head = amount;
    }
    if (head) {
      savingsLabel = offLabel ? `${head} ${offLabel}` : head;
    }
  }
  const href = getProductHref(product);

  const ratioClass = aspectRatio === "1/1" ? "is-square" : "is-portrait";
  const hoverClass = hoverSrc ? "has-hover-image" : "";

  return (
    <a
      class={`product-card ${ratioClass} ${hoverClass}`}
      href={href}
      onMouseEnter={hoverIsVideo ? handleMouseEnter : undefined}
      onMouseLeave={hoverIsVideo ? handleMouseLeave : undefined}
    >
      <div class="product-card-media">
        {imgSrc ? (
          <img
            class="product-card-image product-card-image--primary"
            src={imgSrc}
            alt={`${imageAltPrefix} ${product.name}`}
            loading="lazy"
          />
        ) : (
          <div class="product-card-image product-card-image--empty" aria-hidden="true" />
        )}

        {hoverSrc && (
          hoverIsVideo ? (
            <video
              ref={videoRef}
              class="product-card-image product-card-image--hover product-card-video"
              src={hoverSrc}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            <img
              class="product-card-image product-card-image--hover"
              src={hoverSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          )
        )}

        {(isSoldOut || hasDiscount) && (
          <span
            class={`product-card-badge ${
              isSoldOut ? "product-card-badge--sold-out" : "product-card-badge--sale"
            }`}
          >
            {isSoldOut ? soldOutLabel : saleLabel}
          </span>
        )}

        {!isSoldOut && savingsLabel && (
          <span class="product-card-savings">{savingsLabel}</span>
        )}
      </div>

      {(showProductName || showPrice || showRating) && (
        <div class="product-card-body">
          {showProductName && (
            <span class="product-card-name">{product.name}</span>
          )}
          {showRating && (
            <ProductRating
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
              reviewCountLabel={reviewCountLabel}
              size="sm"
            />
          )}
          {showPrice && finalPrice && (
            <span class="product-card-price-row">
              <span class="product-card-price">{finalPrice}</span>
              {hasDiscount && sellPrice && sellPrice !== finalPrice && (
                <span class="product-card-price--original">{sellPrice}</span>
              )}
            </span>
          )}
        </div>
      )}
    </a>
  );
});

export default ProductCard;

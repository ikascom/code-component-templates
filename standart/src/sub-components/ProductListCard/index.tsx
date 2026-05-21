import { observer } from "@ikas/component-utils";
import { useRef, useState } from "preact/hooks";
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
  isAddToCartEnabled,
  addSelectedtedVariantToCart,
  getProductHref,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import type { SliderAspectRatio, SavingsBadgeStyle } from "../../global-types";
import ProductRating from "../ProductRating";

interface Props {
  product: IkasProduct;
  cardAspectRatio: SliderAspectRatio;
  showProductName: boolean;
  showPrice: boolean;
  showVariantCount: boolean;
  showRating: boolean;
  reviewCountLabel: string;
  enableHoverImage?: boolean;
  variantCountSuffix: string;
  imageAltPrefix: string;
  saleLabel: string;
  soldOutLabel: string;
  offLabel: string;
  savingsBadgeStyle: SavingsBadgeStyle;
  showAddToCart: boolean;
  addToCartLabel: string;
  addingToCartLabel: string;
  viewOptionsLabel: string;
}

const ProductListCard = observer(function ProductListCard({
  product,
  cardAspectRatio,
  showProductName,
  showPrice,
  showVariantCount,
  showRating,
  reviewCountLabel,
  enableHoverImage,
  variantCountSuffix,
  imageAltPrefix,
  saleLabel,
  soldOutLabel,
  offLabel,
  savingsBadgeStyle,
  showAddToCart,
  addToCartLabel,
  addingToCartLabel,
  viewOptionsLabel,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
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

  const variantCount = product.variants?.length ?? 0;
  const showCount = showVariantCount && variantCount > 1;

  const href = getProductHref(product);
  const ratioClass = cardAspectRatio === "1/1" ? "is-square" : "is-portrait";
  const hoverClass = hoverSrc ? "has-hover-image" : "";

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1;
  const canAdd = isAddToCartEnabled(product);
  const showCartButton = showAddToCart && !isSoldOut;
  const cartButtonLabel = isAdding
    ? addingToCartLabel
    : hasMultipleVariants
      ? viewOptionsLabel
      : addToCartLabel;

  const handleCartClick = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasMultipleVariants) {
      window.location.href = href;
      return;
    }
    if (!canAdd || isAdding) return;
    setIsAdding(true);
    try {
      await addSelectedtedVariantToCart(product, 1);
      window.dispatchEvent(new Event("ikas:cart:open"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <a
      class={`pl-card ${ratioClass} ${hoverClass}`}
      href={href}
      onMouseEnter={hoverIsVideo ? handleMouseEnter : undefined}
      onMouseLeave={hoverIsVideo ? handleMouseLeave : undefined}
    >
      <div class="pl-card-media">
        {imgSrc ? (
          <img
            class="pl-card-image pl-card-image--primary"
            src={imgSrc}
            alt={`${imageAltPrefix} ${product.name}`}
            loading="lazy"
          />
        ) : (
          <div class="pl-card-image pl-card-image--empty" aria-hidden="true" />
        )}
        {hoverSrc && (
          hoverIsVideo ? (
            <video
              ref={videoRef}
              class="pl-card-image pl-card-image--hover pl-card-video"
              src={hoverSrc}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            <img
              class="pl-card-image pl-card-image--hover"
              src={hoverSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          )
        )}
        {(isSoldOut || hasDiscount) && (
          <span
            class={`pl-card-badge ${
              isSoldOut ? "pl-card-badge--sold-out" : "pl-card-badge--sale"
            }`}
          >
            {isSoldOut ? soldOutLabel : saleLabel}
          </span>
        )}

        {!isSoldOut && savingsLabel && (
          <span class="pl-card-savings">{savingsLabel}</span>
        )}

        {showCartButton && (
          <button
            type="button"
            class="pl-card-cart-btn"
            disabled={!hasMultipleVariants && (!canAdd || isAdding)}
            aria-label={cartButtonLabel}
            onClick={handleCartClick}
          >
            {cartButtonLabel}
          </button>
        )}
      </div>

      {(showProductName || showPrice || showCount || showRating) && (
        <div class="pl-card-body">
          {showCount && (
            <span class="pl-card-variant-count">
              {variantCount} {variantCountSuffix}
            </span>
          )}
          {showProductName && (
            <span class="pl-card-name">{product.name}</span>
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
            <span class="pl-card-price-row">
              <span class="pl-card-price">{finalPrice}</span>
              {hasDiscount && sellPrice && sellPrice !== finalPrice && (
                <span class="pl-card-price--original">{sellPrice}</span>
              )}
            </span>
          )}
        </div>
      )}
    </a>
  );
});

export default ProductListCard;

import { observer } from "@ikas/component-utils";
import { useState } from "preact/hooks";
import {
  IkasProduct,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
  hasProductVariantStock,
  hasProductVariant,
  isAddToCartEnabled,
  addSelectedtedVariantToCart,
  getProductHref,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";

interface Props {
  product: IkasProduct;
  revealDelayMs: number;
  isRemoving: boolean;
  imageAltPrefix: string;
  addToCartLabel: string;
  addingToCartLabel: string;
  addedToCartLabel: string;
  viewOptionsLabel: string;
  removeAriaLabel: string;
  onRemove: (productId: string) => void;
  onAddedToCart: () => void;
}

const FavoriteProductCard = observer(function FavoriteProductCard({
  product,
  revealDelayMs,
  isRemoving,
  imageAltPrefix,
  addToCartLabel,
  addingToCartLabel,
  addedToCartLabel,
  viewOptionsLabel,
  removeAriaLabel,
  onRemove,
  onAddedToCart,
}: Props) {
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  if (!product) return null;

  const variant = getSelectedProductVariant(product);
  const productImage = getProductVariantMainImage(variant);
  const image = productImage?.image;
  const imgSrc = image ? getDefaultSrc(image) : null;
  const imgSrcset = image ? createMediaSrcset(image) : "";

  const finalPrice = getProductVariantFormattedFinalPrice(variant);
  const sellPrice = getProductVariantFormattedSellPrice(variant);
  const hasDiscount = hasProductVariantDiscount(variant);
  const inStock = hasProductVariantStock(variant);
  const isSoldOut = !inStock;

  const hasMultipleVariants = hasProductVariant(product);
  const canAdd = isAddToCartEnabled(product);

  const href = getProductHref(product);

  const handleRemove = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;
    onRemove(product.id);
  };

  const handleCart = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasMultipleVariants) {
      window.location.href = href;
      return;
    }
    if (!canAdd || cartState !== "idle" || isSoldOut) return;
    setCartState("adding");
    try {
      await addSelectedtedVariantToCart(product, 1);
      setCartState("added");
      onAddedToCart();
      setTimeout(() => setCartState("idle"), 1600);
    } catch {
      setCartState("idle");
    }
  };

  const cartLabel = hasMultipleVariants
    ? viewOptionsLabel
    : cartState === "adding"
      ? addingToCartLabel
      : cartState === "added"
        ? addedToCartLabel
        : addToCartLabel;

  return (
    <article
      class={`fav-card${isRemoving ? " fav-card--removing" : ""}`}
      style={{ "--reveal-delay": `${revealDelayMs}ms` } as any}
    >
      <a class="fav-card__media-link" href={href}>
        <div class="fav-card__media">
          {imgSrc ? (
            <img
              class="fav-card__image"
              src={imgSrc}
              srcSet={imgSrcset || undefined}
              sizes="(min-width: 1024px) 320px, 50vw"
              alt={`${imageAltPrefix} ${product.name}`.trim()}
              loading="lazy"
            />
          ) : (
            <div class="fav-card__image-empty" aria-hidden="true" />
          )}
          <button
            type="button"
            class="fav-card__remove"
            aria-label={removeAriaLabel}
            disabled={isRemoving}
            onClick={handleRemove}
          >
            <svg
              class="fav-card__remove-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7.5-4.5-9.5-9.5a5 5 0 0 1 9.5-3 5 5 0 0 1 9.5 3C19.5 16.5 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </a>

      <div class="fav-card__body">
        <a class="fav-card__name-link" href={href}>
          <h3 class="fav-card__name">{product.name}</h3>
        </a>
        {finalPrice && (
          <div class="fav-card__price-row">
            {hasDiscount && sellPrice && sellPrice !== finalPrice ? (
              <>
                <span class="fav-card__price--original">{sellPrice}</span>
                <span class="fav-card__price--sale">{finalPrice}</span>
              </>
            ) : (
              <span class="fav-card__price">{finalPrice}</span>
            )}
          </div>
        )}

        <button
          type="button"
          class="fav-card__cart-btn"
          disabled={
            !hasMultipleVariants && (!canAdd || isSoldOut || cartState !== "idle")
          }
          aria-busy={cartState === "adding" ? "true" : undefined}
          onClick={handleCart}
        >
          {cartLabel}
        </button>
      </div>
    </article>
  );
});

export default FavoriteProductCard;

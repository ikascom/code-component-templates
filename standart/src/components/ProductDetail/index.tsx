import { useEffect, useState } from "preact/hooks";
import {
  addItemToCart,
  addProductToFavorites,
  removeProductFromFavorites,
  customerStore,
  getIkasCategoryPathItemHref,
  getProductCategoryPath,
  getProductVariantDiscountPercentage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  getProductVariantMainImage,
  getSelectedProductVariant,
  hasProductVariantDiscount,
  hasProductVariantStock,
  isAddToCartEnabled,
  isFavoriteIkasProduct,
  Router,
} from "@ikas/bp-storefront";
import type { IkasImage } from "@ikas/bp-storefront";
import ProductGallery from "../../sub-components/ProductGallery";
import ProductVariants from "../../sub-components/ProductVariants";
import ProductRating from "../../sub-components/ProductRating";
import { Props } from "./types";

export function ProductDetail({
  product,
  backgroundColor,
  galleryStyle = "thumbnails",
  galleryPosition = "left",
  imageAspectRatio = "3/4",
  showBreadcrumb = true,
  showHomepageInBreadcrumb = true,
  breadcrumbHomeText = "Anasayfa",
  showThumbnails = true,
  thumbnailPosition = "bottom",
  showBrandName = true,
  showBadges = true,
  showShortDescription = true,
  showSku = false,
  showBarcode = false,
  showTags = false,
  showFavoriteButton = true,
  showRating = true,
  reviewCountLabel = "değerlendirme",
  showQuantitySelector = true,
  addToCartText = "Sepete Ekle",
  addingToCartText = "Ekleniyor...",
  buyNowText = "Hemen Al",
  buyingNowText = "Yönlendiriliyor...",
  showBuyNowButton = true,
  outOfStockText = "Stokta Yok",
  quantityLabel = "Adet",
  colorLabel = "Renk",
  sizeLabel = "Beden",
  skuLabel = "SKU:",
  barcodeLabel = "Barkod:",
  discountBadgePrefix = "%",
  discountBadgeSuffix = "İndirim",
  favoriteAriaLabel = "Favorilere ekle",
  favoriteRemoveAriaLabel = "Favorilerden çıkar",
  selectedLabel = "Seçili:",
  descriptionTitle = "Ürün Açıklaması",
  showAccordion1 = true,
  accordion1Title = "Kargo ve Teslimat",
  accordion1Body = "",
  showAccordion2 = true,
  accordion2Title = "İade",
  accordion2Body = "",
  showVariantImage = false,
  breadcrumbAriaLabel = "Gezinme yolu",
  decreaseQuantityAriaLabel = "Miktarı azalt",
  increaseQuantityAriaLabel = "Miktarı artır",
  productNameSize = "large",
}: Props) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [favoritePending, setFavoritePending] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    (window as any).__ikasIsConversionPage = true;
    return () => { delete (window as any).__ikasIsConversionPage; };
  }, []);

  const variant = getSelectedProductVariant(product);
  const mainImage = getProductVariantMainImage(variant);
  const variantImages = variant?.images ?? null;
  const galleryImages: IkasImage[] = (variantImages?.length
    ? variantImages.map((pi) => pi.image).filter((img): img is IkasImage => img != null)
    : mainImage?.image
      ? [mainImage.image]
      : []);

  const inStock = variant ? hasProductVariantStock(variant) : false;
  const canAdd = isAddToCartEnabled(product);
  const isOutOfStock = !inStock;

  const finalPrice = variant ? getProductVariantFormattedFinalPrice(variant) : "";
  const sellPrice = variant ? getProductVariantFormattedSellPrice(variant) : "";
  const hasDiscount = variant ? hasProductVariantDiscount(variant) : false;
  const discountPercent = hasDiscount ? getProductVariantDiscountPercentage(variant) : "";

  const isFavorite = isFavoriteIkasProduct(product);

  const categoryPath = getProductCategoryPath(product);
  const brandName = product.brand?.name ?? "";
  const description = product.description ?? "";
  const tags = product.tags ?? [];
  const variantSku = variant?.sku ?? "";
  const variantBarcode = (variant?.barcodeList && variant.barcodeList.length > 0) ? variant.barcodeList[0] : "";

  const handleAddToCart = async () => {
    if (!variant || isAdding || !canAdd) return;
    setIsAdding(true);
    try {
      await addItemToCart(variant, product, quantity);
      window.dispatchEvent(new Event("ikas:cart:open"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!variant || isBuyingNow || !canAdd) return;
    setIsBuyingNow(true);
    try {
      await addItemToCart(variant, product, quantity);
      Router.navigateToPage("CHECKOUT");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (favoritePending) return;
    if (!customerStore.customer) {
      Router.navigateToPage("LOGIN");
      return;
    }
    setFavoritePending(true);
    try {
      if (isFavorite) {
        await removeProductFromFavorites(customerStore, product.id);
      } else {
        await addProductToFavorites(customerStore, product.id);
      }
    } finally {
      setFavoritePending(false);
    }
  };

  const sectionStyle = backgroundColor ? { backgroundColor } : undefined;
  const galleryRight = galleryPosition === "right";

  const cartCtaLabel = isOutOfStock
    ? outOfStockText
    : isAdding
      ? addingToCartText
      : addToCartText;

  const buyNowLabel = isOutOfStock
    ? outOfStockText
    : isBuyingNow
      ? buyingNowText
      : buyNowText;

  return (
    <section
      class={`pdp pdp--gallery-${galleryStyle}${galleryRight ? " pdp--gallery-right" : ""}`}
      style={sectionStyle}
    >
      <div class="pdp-container">
        {showBreadcrumb && (
          <nav class="pdp-breadcrumb" aria-label={breadcrumbAriaLabel}>
            {showHomepageInBreadcrumb && (
              <span class="pdp-breadcrumb-item">
                <a class="pdp-breadcrumb-link" href="/">{breadcrumbHomeText}</a>
                <span class="pdp-breadcrumb-sep" aria-hidden="true">/</span>
              </span>
            )}
            {categoryPath.map((cat) => (
              <span key={cat.id} class="pdp-breadcrumb-item">
                <a
                  class="pdp-breadcrumb-link"
                  href={getIkasCategoryPathItemHref(cat)}
                >
                  {cat.name}
                </a>
                <span class="pdp-breadcrumb-sep" aria-hidden="true">/</span>
              </span>
            ))}
            <span class="pdp-breadcrumb-current" aria-current="page">{product.name}</span>
          </nav>
        )}

        <div class="pdp-grid">
          <div class="pdp-gallery-col">
            <ProductGallery
              images={galleryImages}
              productName={product.name}
              galleryStyle={galleryStyle}
              aspectRatio={imageAspectRatio}
              showThumbnails={showThumbnails}
              thumbnailPosition={thumbnailPosition}
              activeIndex={activeImageIndex}
              onSelect={setActiveImageIndex}
            />
          </div>

          <div class="pdp-info">
            {showBrandName && brandName && (
              <span class="pdp-brand">{brandName}</span>
            )}

            <h1 class={`pdp-title pdp-title--${productNameSize}`}>{product.name}</h1>

            {showRating && (
              <ProductRating
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
                reviewCountLabel={reviewCountLabel}
                size="md"
              />
            )}

            {showBadges && (hasDiscount || isOutOfStock) && (
              <div class="pdp-badges">
                {hasDiscount && discountPercent && (
                  <span class="pdp-badge pdp-badge--discount">
                    {discountBadgePrefix}{discountPercent} {discountBadgeSuffix}
                  </span>
                )}
                {isOutOfStock && (
                  <span class="pdp-badge pdp-badge--oos">{outOfStockText}</span>
                )}
              </div>
            )}

            {finalPrice && (
              <div class="pdp-prices">
                <span class="pdp-price">{finalPrice}</span>
                {hasDiscount && sellPrice && sellPrice !== finalPrice && (
                  <span class="pdp-price--compare">{sellPrice}</span>
                )}
              </div>
            )}

            {(showSku && variantSku) || (showBarcode && variantBarcode) ? (
              <div class="pdp-meta">
                {showSku && variantSku && (
                  <p class="pdp-meta-line">
                    <span class="pdp-meta-label">{skuLabel}</span>
                    <span class="pdp-meta-value">{variantSku}</span>
                  </p>
                )}
                {showBarcode && variantBarcode && (
                  <p class="pdp-meta-line">
                    <span class="pdp-meta-label">{barcodeLabel}</span>
                    <span class="pdp-meta-value">{variantBarcode}</span>
                  </p>
                )}
              </div>
            ) : null}

            <hr class="pdp-divider" />

            <ProductVariants
              product={product}
              colorLabel={colorLabel}
              sizeLabel={sizeLabel}
              selectedLabel={selectedLabel}
              showVariantImage={showVariantImage}
            />

            {showQuantitySelector && (
              <div class="pdp-quantity">
                <span class="pdp-quantity-label">{quantityLabel}</span>
                <button
                  type="button"
                  class="pdp-quantity-btn"
                  aria-label={decreaseQuantityAriaLabel}
                  aria-disabled={quantity <= 1}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span class="pdp-quantity-count" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  class="pdp-quantity-btn"
                  aria-label={increaseQuantityAriaLabel}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            )}

            <div class={`pdp-cta-row${showBuyNowButton ? " pdp-cta-row--two" : ""}`}>
              <button
                type="button"
                class={`pdp-cta pdp-cta--primary${isOutOfStock ? " pdp-cta--oos" : ""}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding || !canAdd}
                aria-busy={isAdding ? "true" : "false"}
                aria-disabled={isOutOfStock ? "true" : "false"}
              >
                {cartCtaLabel}
              </button>

              {showBuyNowButton && (
              <button
                type="button"
                class="pdp-cta pdp-cta--secondary"
                onClick={handleBuyNow}
                disabled={isOutOfStock || isBuyingNow || !canAdd}
                aria-busy={isBuyingNow ? "true" : "false"}
                aria-disabled={isOutOfStock ? "true" : "false"}
              >
                {buyNowLabel}
              </button>
              )}
            </div>

            {showFavoriteButton && (
              <button
                type="button"
                class={`pdp-fav${isFavorite ? " pdp-fav--on" : ""}`}
                onClick={handleFavoriteToggle}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? favoriteRemoveAriaLabel : favoriteAriaLabel}
              >
                <svg
                  class="pdp-fav-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12.1 8.64l-.1.1-.11-.11a4 4 0 1 0-5.66 5.66l5.77 5.77 5.77-5.77a4 4 0 0 0-5.67-5.65z"
                  />
                </svg>
                <span>{isFavorite ? favoriteRemoveAriaLabel : favoriteAriaLabel}</span>
              </button>
            )}

            {showTags && tags.length > 0 && (
              <div class="pdp-tags">
                {tags.map((tag) => (
                  <span key={tag.id} class="pdp-tag">{tag.name}</span>
                ))}
              </div>
            )}

            {(
              (showShortDescription && description) ||
              (showAccordion1 && accordion1Body) ||
              (showAccordion2 && accordion2Body)
            ) && (
              <div class="pdp-accordion">
                {showShortDescription && description && (
                  <details class="pdp-accordion-item" open>
                    <summary class="pdp-accordion-summary">
                      <span class="pdp-accordion-title">{descriptionTitle}</span>
                      <span class="pdp-accordion-icon" aria-hidden="true" />
                    </summary>
                    <div
                      class="pdp-accordion-body pdp-description"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </details>
                )}
                {showAccordion1 && accordion1Body && (
                  <details class="pdp-accordion-item">
                    <summary class="pdp-accordion-summary">
                      <span class="pdp-accordion-title">{accordion1Title}</span>
                      <span class="pdp-accordion-icon" aria-hidden="true" />
                    </summary>
                    <div
                      class="pdp-accordion-body pdp-description"
                      dangerouslySetInnerHTML={{ __html: accordion1Body }}
                    />
                  </details>
                )}
                {showAccordion2 && accordion2Body && (
                  <details class="pdp-accordion-item">
                    <summary class="pdp-accordion-summary">
                      <span class="pdp-accordion-title">{accordion2Title}</span>
                      <span class="pdp-accordion-icon" aria-hidden="true" />
                    </summary>
                    <div
                      class="pdp-accordion-body pdp-description"
                      dangerouslySetInnerHTML={{ __html: accordion2Body }}
                    />
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;

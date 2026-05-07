import { useState, useRef, useEffect } from "preact/hooks";
import {
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantDiscountPercentage,
  hasProductVariantDiscount,
  hasProductVariantStock,
  addSelectedtedVariantToCart,
  getProductHref,
  getDefaultSrc,
  IkasProduct,
  isAddToCartEnabled,
  isFavoriteIkasProduct,
  addIkasProductToFavorites,
  removeIkasProductFromFavorites,
  customerStore,
  hasCustomer,
  Router,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { NoProductSVG, Heart2SVG, HeartFilledSVG } from "../icons";
import Button from "../Button";
import SpinnerIcon from "../SpinnerIcon";
import Tag from "../Tag";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import { showToast } from "../../utils/toast";
import type { AspectRatio, ObjectFit } from "../../global-types";

interface Props {
  product: IkasProduct;
  addToCartText: string;
  addedToCartText?: string;
  outOfStockText?: string;
  goToProductText?: string;
  showFavorite?: boolean;
  hideAddToCartButton?: boolean;
  badgeText?: string;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  dataPage?: number;
  sizes?: string;
  openCartOnAdd?: boolean;
  errorMessage?: string;
  onFavoriteRemove?: () => void;
  priority?: boolean;
}

const ProductCard = observer(function ProductCard({
  product,
  addToCartText,
  addedToCartText = "Added to Cart",
  outOfStockText = "Sold Out",
  goToProductText = "View Product",
  showFavorite = true,
  hideAddToCartButton = false,
  badgeText,
  aspectRatio,
  objectFit,
  dataPage,
  sizes = "(max-width: 767px) calc(50vw - 24px), (max-width: 1023px) calc(50vw - 44px), 300px",
  openCartOnAdd = true,
  errorMessage = "Failed to add product to cart",
  onFavoriteRemove,
  priority = false,
}: Props) {
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">(
    "idle",
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const selectedVariant = getSelectedProductVariant(product);
  const productImage = selectedVariant
    ? getProductVariantMainImage(selectedVariant)
    : null;
  const image = productImage?.image;

  const sortedImages = selectedVariant?.images
    ? [...selectedVariant.images].sort((a, b) => a.order - b.order)
    : [];
  const secondImage = sortedImages.length > 1 ? sortedImages[1]?.image : null;
  const hasDiscount = selectedVariant
    ? hasProductVariantDiscount(selectedVariant)
    : false;
  const inStock = selectedVariant
    ? hasProductVariantStock(selectedVariant)
    : false;
  const discountPercentage =
    hasDiscount && selectedVariant
      ? getProductVariantDiscountPercentage(selectedVariant)
      : null;

  const productHref = getProductHref(product);
  const isBundleProduct = !!selectedVariant?.bundleSettings;
  const hasOptionSet = !!product.productOptionSet;
  const isFavorite = isFavoriteIkasProduct(product);

  const mediaStyle: Record<string, string> = {};
  const resolvedAR = resolveAspectRatio(aspectRatio);
  const resolvedOF = resolveObjectFit(objectFit);
  if (resolvedAR) mediaStyle.aspectRatio = resolvedAR;
  if (resolvedOF) mediaStyle.objectFit = resolvedOF;

  const handleAddToCart = async () => {
    if (cartState === "loading") return;

    if (!isAddToCartEnabled(product) || isBundleProduct || hasOptionSet) {
      Router.navigate(productHref);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    setCartState("loading");
    try {
      const result = await addSelectedtedVariantToCart(product, 1);

      if (result.success) {
        if (openCartOnAdd) {
          window.dispatchEvent(new CustomEvent("ikas:open-cart-sidebar"));
        }
        setCartState("added");
      } else {
        showToast(errorMessage, "error");
      }

      timerRef.current = setTimeout(() => setCartState("idle"), 2000);
    } catch {
      setCartState("idle");
      showToast(errorMessage, "error");
    }
  };

  const handleFavoriteToggle = async () => {
    const isLoggedIn = hasCustomer(customerStore);
    if (!isLoggedIn) {
      Router.navigateToPage("LOGIN");
      return;
    }

    if (isFavorite) {
      await removeIkasProductFromFavorites(product);
      onFavoriteRemove?.();
    } else {
      await addIkasProductToFavorites(product);
    }
  };

  return (
    <div className="kombos-product-card" data-page={dataPage}>
      {/* Image container */}
      <div className="kombos-product-card__image-wrapper">
        <a href={productHref} className="kombos-product-card__media-link" aria-label={product.name || "Product"}>
          {image?.isVideo ? (
            <video
              src={getDefaultSrc(image)}
              className="kombos-product-card__media"
              style={mediaStyle}
              muted
              loop
              autoPlay
              playsInline
              aria-label={product.name}
            >
              <track kind="captions" />
            </video>
          ) : image ? (
            <>
              <img
                src={getDefaultSrc(image)}
                srcSet={createMediaSrcset(image)}
                sizes={sizes}
                alt={product.name}
                className="kombos-product-card__media kombos-product-card__media--primary"
                style={mediaStyle}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                fetchpriority={priority ? "high" : undefined}
              />
              {secondImage && !secondImage.isVideo && (
                <img
                  src={getDefaultSrc(secondImage)}
                  srcSet={createMediaSrcset(secondImage)}
                  sizes={sizes}
                  alt=""
                  className="kombos-product-card__media kombos-product-card__media--hover"
                  style={mediaStyle}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </>
          ) : (
            <div
              className="kombos-product-card__media kombos-product-card__media--placeholder"
              style={mediaStyle}
            >
              <NoProductSVG />
            </div>
          )}
        </a>

        {/* Out of stock overlay — must render before badges/heart so they appear on top */}
        {!inStock && <div className="kombos-product-card__overlay" />}

        {/* Badges */}
        {(hasDiscount || badgeText) && (
          <div className="kombos-product-card__badges">
            {hasDiscount && discountPercentage && (
              <Tag type="discounted" size="s">
                %{discountPercentage}
              </Tag>
            )}
            {badgeText && (
              <Tag type="new" size="s">
                {badgeText}
              </Tag>
            )}
          </div>
        )}

        {/* Favorite button */}
        {showFavorite && (
          <button
            type="button"
            className="kombos-product-card__favorite"
            onClick={handleFavoriteToggle}
            aria-label="Favorite"
          >
            {isFavorite ? <HeartFilledSVG /> : <Heart2SVG />}
          </button>
        )}
      </div>

      {/* Add to Cart / Go to Product */}
      {!hideAddToCartButton && (
        <>
          {isBundleProduct || (hasOptionSet && inStock) ? (
            <Button
              variant="primary"
              size="xs"
              className="kombos-product-card__add-btn"
              onClick={() => Router.navigate(productHref)}
            >
              {goToProductText}
            </Button>
          ) : (
            <Button
              variant={cartState === "added" ? "secondary" : "primary"}
              size="xs"
              className="kombos-product-card__add-btn"
              onClick={inStock ? handleAddToCart : undefined}
              disabled={!inStock || cartState === "loading"}
              icon={
                inStock && cartState === "loading" ? <SpinnerIcon /> : undefined
              }
            >
              {!inStock && outOfStockText}
              {inStock && cartState === "added" && addedToCartText}
              {inStock &&
                (cartState === "idle" || cartState === "loading") &&
                addToCartText}
            </Button>
          )}
        </>
      )}
    </div>
  );
});

export default ProductCard;

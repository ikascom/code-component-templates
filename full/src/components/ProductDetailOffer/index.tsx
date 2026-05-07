import {
  getDefaultSrc,
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  getProductVariantFormattedFinalPrice,
  getProductVariantMainImage,
  getSelectedProductVariant,
  acceptProductOffer,
  rejectProductOffer,
} from "@ikas/bp-storefront";
import { useEffect } from "preact/hooks";
import { cx } from "../../utils/cx";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import { Props } from "./types";
import OfferCard from "./components/OfferCard";
import OfferSummary from "./components/OfferSummary";
import { NoProductSVG } from "../../sub-components/icons";

export function ProductDetailOffer({
  product,
  compactView = false,
  preselectOffers = false,
  addToCartTogetherText = "Add Together to Cart",
  addingToCartText = "Adding...",
  offerInfoText = "Add selected products together to your cart and enjoy the discount.",
  totalText = "Total",
  advantageousTotalText = "Discounted Total",
  outOfStockText = "Sold Out",
  imageAspectRatio,
  imageObjectFit,
  addedToCartBannerText = "Added to cart",
  errorMessage = "Failed to add product to cart",
  optionSetErrorMessage = "Please fill in the required options",
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
}: Props) {
  useEffect(() => {
    product?.offers?.forEach((offer) => {
      if (preselectOffers) {
        acceptProductOffer(offer);
      } else {
        rejectProductOffer(offer);
      }
    });
  }, [preselectOffers]);

  if (!product?.offers?.length) return null;

  const selectedVariant = getSelectedProductVariant(product);

  const appliedCampaign = product.appliedCampaignOffer;

  const mainImage = getProductVariantMainImage(selectedVariant);
  const mainMedia = mainImage?.image;
  const mainImageSrc = mainMedia ? getDefaultSrc(mainMedia) : undefined;
  const mainPrice = getProductVariantFormattedFinalPrice(selectedVariant);

  // Resolve image styles
  const resolvedAspectRatio = resolveAspectRatio(imageAspectRatio);
  const resolvedObjectFit = resolveObjectFit(imageObjectFit);

  const isInline = compactView;

  const mainImageStyle = {
    aspectRatio: resolvedAspectRatio,
    objectFit: resolvedObjectFit,
  };

  const summaryPanel = (
    <OfferSummary
      product={product}
      offerInfoText={offerInfoText}
      totalText={totalText}
      advantageousTotalText={advantageousTotalText}
      isInline={isInline}
      addingToCartText={addingToCartText}
      addToCartTogetherText={addToCartTogetherText}
      errorMessage={errorMessage}
      optionSetErrorMessage={optionSetErrorMessage}
    />
  );

  return (
    <div
      className={cx("kombos-pd-offer", isInline && "kombos-pd-offer--inline")}
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      {/* Campaign header */}
      {appliedCampaign &&
        (appliedCampaign.title || appliedCampaign.description) && (
          <div className="kombos-pd-offer__header">
            {appliedCampaign.title && (
              <span className="kombos-pd-offer__title text-md-semibold md:text-lg-semibold">
                {appliedCampaign.title}
              </span>
            )}
            {appliedCampaign.description && (
              <span className="kombos-pd-offer__desc text-sm-regular">
                {appliedCampaign.description}
              </span>
            )}
          </div>
        )}

      {/* Grid wrapper for standalone mode */}
      {!isInline ? (
        <div className="kombos-pd-offer__grid">
          {/* Cards area: main product + offers in 2-col grid */}
          <div className="kombos-pd-offer__cards">
            {/* Main product card */}
            <div className="kombos-pd-offer__main-product">
              <div className="kombos-pd-offer__main-content">
                {mainMedia?.isVideo ? (
                  <video
                    src={mainImageSrc}
                    className="kombos-pd-offer__main-image"
                    style={mainImageStyle}
                    muted
                    loop
                    autoPlay
                    playsInline
                  >
                    <track kind="captions" />
                  </video>
                ) : mainImageSrc ? (
                  <img
                    className="kombos-pd-offer__main-image"
                    src={mainImageSrc}
                    alt={product.name}
                    loading="lazy"
                    style={mainImageStyle}
                  />
                ) : (
                  <div
                    className="kombos-pd-offer__main-image kombos-pd-offer__main-image--placeholder"
                    style={mainImageStyle}
                  >
                    <NoProductSVG />
                  </div>
                )}
                <div className="kombos-pd-offer__main-body">
                  <span className="kombos-pd-offer__main-name text-sm-medium">
                    {product.name}
                  </span>
                  <span className="kombos-pd-offer__main-price text-sm-semibold">
                    {mainPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Offer cards */}
            {product.offers.map((offer) => (
              <OfferCard
                key={offer.campaignOfferProductId}
                offer={offer}
                outOfStockText={outOfStockText}
                addedToCartBannerText={addedToCartBannerText}
                imageAspectRatio={resolvedAspectRatio}
                imageObjectFit={resolvedObjectFit}
              />
            ))}
          </div>

          {/* Summary panel */}
          {summaryPanel}
        </div>
      ) : (
        <>
          {/* Inline mode: vertical stack, no main product, no button */}
          <div className="kombos-pd-offer__list">
            {product.offers.map((offer) => (
              <OfferCard
                key={offer.campaignOfferProductId}
                offer={offer}
                outOfStockText={outOfStockText}
                addedToCartBannerText={addedToCartBannerText}
                imageAspectRatio={resolvedAspectRatio}
                imageObjectFit={resolvedObjectFit}
              />
            ))}
          </div>

          {/* Summary (no button in inline mode) */}
          {summaryPanel}
        </>
      )}
    </div>
  );
}

export default ProductDetailOffer;

import {
  IkasProductOffer,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getDefaultSrc,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
  hasProductVariantStock,
  isAcceptedProductOffer,
  acceptProductOffer,
  rejectProductOffer,
  getDisplayedProductVariantTypes,
  selectVariantValue,
  getProductHref,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";
import Toggle from "../../../../sub-components/Toggle";
import Select from "../../../../sub-components/Select";
import { CheckCircleSVG, NoProductSVG } from "../../../../sub-components/icons";

interface Props {
  offer: IkasProductOffer;
  outOfStockText?: string;
  addedToCartBannerText?: string;
  imageAspectRatio?: string;
  imageObjectFit?: string;
}

const OfferCard = observer(function OfferCard({
  offer,
  outOfStockText = "Sold Out",
  addedToCartBannerText = "Added to cart",
  imageAspectRatio,
  imageObjectFit,
}: Props) {
  const product = offer.product;
  if (!product) return null;

  const variant = getSelectedProductVariant(product);
  const isSelected = offer.isSelected;
  const isAccepted = isAcceptedProductOffer(offer);
  const inStock = variant ? hasProductVariantStock(variant) : false;

  const productImage = variant
    ? getProductVariantMainImage(variant)
    : undefined;
  const image = productImage?.image;
  const imageSrc = image ? getDefaultSrc(image) : undefined;

  const price = getProductVariantFormattedFinalPrice(variant);
  const hasDiscount = hasProductVariantDiscount(variant);
  const originalPrice = getProductVariantFormattedSellPrice(variant);
  const variantTypes = getDisplayedProductVariantTypes(product);
  const productHref = getProductHref(product);

  function handleToggle(checked: boolean) {
    if (isAccepted) return;

    if (checked) {
      acceptProductOffer(offer);
    } else {
      rejectProductOffer(offer);
    }
  }

  const imageStyle =
    imageAspectRatio || imageObjectFit
      ? {
          ...(imageAspectRatio && { aspectRatio: imageAspectRatio }),
          ...(imageObjectFit && { objectFit: imageObjectFit }),
        }
      : undefined;

  return (
    <div
      className={cx(
        "kombos-offer-card",
        isSelected && "kombos-offer-card--selected",
        isAccepted && "kombos-offer-card--accepted",
        !inStock && "kombos-offer-card--out-of-stock",
      )}
    >
      <div className="kombos-offer-card__content">
        <a href={productHref} className="kombos-offer-card__link">
          {image?.isVideo ? (
            <video
              src={imageSrc}
              className="kombos-offer-card__image"
              style={imageStyle}
              muted
              loop
              autoPlay
              playsInline
            >
              <track kind="captions" />
            </video>
          ) : imageSrc ? (
            <img
              className="kombos-offer-card__image"
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              style={imageStyle}
            />
          ) : (
            <div
              className="kombos-offer-card__image kombos-offer-card__image--placeholder"
              style={imageStyle}
            >
              <NoProductSVG />
            </div>
          )}
        </a>

        <div className="kombos-offer-card__body">
          <a
            href={productHref}
            className="kombos-offer-card__link kombos-offer-card__name text-sm-medium"
          >
            {product.name}
          </a>

          {variantTypes.length > 0 && (
            <div className="kombos-offer-card__variants">
              {variantTypes.map((dvt) => {
                const selected = dvt.displayedVariantValues.find(
                  (dvv) => dvv.isSelected,
                );
                const options = dvt.displayedVariantValues.map((dvv) => ({
                  label: dvv.variantValue.name,
                  value: dvv.variantValue.id,
                }));

                return (
                  <div
                    key={dvt.variantType.id}
                    className="kombos-offer-card__variant-group"
                  >
                    <span className="kombos-offer-card__variant-label text-xs-medium">
                      {dvt.variantType.name}
                    </span>
                    <Select
                      disabled={isAccepted}
                      size="xs"
                      options={options}
                      value={selected?.variantValue.id}
                      aria-label={dvt.variantType.name}
                      onChange={(e) => {
                        const val = (e.target as HTMLSelectElement).value;
                        const dvv = dvt.displayedVariantValues.find(
                          (d) => d.variantValue.id === val,
                        );
                        if (dvv) {
                          selectVariantValue(product, dvv.variantValue, true);
                        }
                      }}
                      style={{
                        maxWidth: 180,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {inStock ? (
            <div className="kombos-offer-card__prices">
              <span className="kombos-offer-card__price text-sm-semibold">
                {price}
              </span>

              {hasDiscount && (
                <span className="kombos-offer-card__original-price text-sm-regular-strike">
                  {originalPrice}
                </span>
              )}
            </div>
          ) : (
            <span className="kombos-offer-card__out-of-stock text-xs-medium">
              {outOfStockText}
            </span>
          )}
        </div>

        <div className="kombos-offer-card__toggle">
          <Toggle
            checked={isSelected || isAccepted}
            onChange={inStock ? handleToggle : undefined}
            disabled={!inStock || isAccepted}
          />
        </div>
      </div>

      {isAccepted && (
        <div className="kombos-offer-card__banner">
          <span className="kombos-offer-card__banner-icon">
            <CheckCircleSVG />
          </span>
          <span className="text-xs-medium">{addedToCartBannerText}</span>
        </div>
      )}
    </div>
  );
});

export default OfferCard;

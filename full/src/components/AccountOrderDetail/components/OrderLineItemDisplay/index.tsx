import {
  IkasOrderLineItem,
  getIkasOrderLineVariantMainImage,
  getIkasOrderLineVariantHref,
  getThumbnailSrc,
  getDefaultSrc,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  getOrderLineItemFormattedPriceWithQuantity,
  hasOrderLineItemDiscount,
} from "@ikas/bp-storefront";
import { NoProductSVG } from "../../../../sub-components/icons";

interface Props {
  item: IkasOrderLineItem;
}

export default function OrderLineItemDisplay({ item }: Props) {
  const image = item.variant
    ? getIkasOrderLineVariantMainImage(item.variant)
    : null;
  const imgSrc = image && !image.isVideo ? getThumbnailSrc(image) : null;
  const videoSrc = image?.isVideo ? getDefaultSrc(image) : null;
  const hasDiscount = hasOrderLineItemDiscount(item);
  const finalPrice = getOrderLineItemFormattedFinalPriceWithQuantity(item);
  const originalPrice = hasDiscount
    ? getOrderLineItemFormattedPriceWithQuantity(item)
    : null;

  const variantValues = item.variant?.variantValues ?? [];
  const href = item.variant
    ? getIkasOrderLineVariantHref(item.variant)
    : undefined;

  const ImageWrap = (
    <div className="kombos-order-detail-line__img-wrap">
      {videoSrc ? (
        <video
          src={videoSrc}
          className="kombos-order-detail-line__video"
          muted
          loop
          autoPlay
          playsInline
        >
          <track kind="captions" />
        </video>
      ) : imgSrc ? (
        <img
          src={imgSrc}
          alt={item.variant?.name ?? ""}
          loading="lazy"
          className="kombos-order-detail-line__img"
        />
      ) : (
        <div className="kombos-order-detail-line__placeholder">
          <NoProductSVG />
        </div>
      )}
    </div>
  );

  const Name = (
    <p className="kombos-order-detail-line__name text-sm-medium">
      {item.variant?.name}
    </p>
  );

  return (
    <>
      {href ? (
        <a href={href} className="kombos-order-detail-line__img-link">
          {ImageWrap}
        </a>
      ) : (
        ImageWrap
      )}
      <div className="kombos-order-detail-line__details">
        {href ? (
          <a href={href} className="kombos-order-detail-line__name-link">
            {Name}
          </a>
        ) : (
          Name
        )}
        {variantValues.length > 0 &&
          variantValues.map((v) => (
            <div
              key={v.variantTypeId}
              className="kombos-order-detail-line__variant"
            >
              <span className="kombos-order-detail-line__variant-label text-sm-regular">
                {v.variantTypeName}:
              </span>
              <span className="kombos-order-detail-line__variant-value text-sm-regular">
                {v.variantValueName}
              </span>
            </div>
          ))}
        <div className="kombos-order-detail-line__prices">
          <span className="kombos-order-detail-line__price text-sm-medium">
            {finalPrice}
          </span>
          {originalPrice && (
            <span className="kombos-order-detail-line__price-old text-sm-regular-strike">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

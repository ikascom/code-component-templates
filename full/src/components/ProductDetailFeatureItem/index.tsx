import { getDefaultSrc } from "@ikas/bp-storefront";
import { Props } from "./types";

export function ProductDetailFeatureItem({ image, text }: Props) {
  const imageSrc = image ? getDefaultSrc(image) : null;
  if (!imageSrc && !text) return null;

  return (
    <div className="product-detail-feature-item">
      {imageSrc && (
        <img
          className="product-detail-feature-item__icon"
          src={imageSrc}
          alt={image?.altText || ""}
          width={32}
          height={32}
        />
      )}
      {text && (
        <p className="product-detail-feature-item__text text-sm-medium">
          {text}
        </p>
      )}
    </div>
  );
}

export default ProductDetailFeatureItem;

import { getDefaultSrc } from "@ikas/bp-storefront";

import { Props } from "./types";

export function FeatureItem({ image, text }: Props) {
  const src = image ? getDefaultSrc(image) : undefined;

  return (
    <div className="kombos-feature-item">
      {src && (
        <img
          className="kombos-feature-item__icon"
          src={src}
          alt={image?.altText || ""}
        />
      )}
      {text && (
        <div
          className="kombos-feature-item__text text-sm-medium"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  );
}

export default FeatureItem;

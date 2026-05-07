import {
  IkasOrderLineVariantBundleProduct,
  getIkasOrderLineBundleVariantMainImage,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { resolveAspectRatio, resolveObjectFit } from "../../../../utils/media";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

interface Props {
  bundleProduct: IkasOrderLineVariantBundleProduct;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

const BundleProductItem = observer(function BundleProductItem({
  bundleProduct,
  aspectRatio,
  objectFit,
}: Props) {
  const { variant, quantity } = bundleProduct;
  const image = getIkasOrderLineBundleVariantMainImage(variant);
  const variantValues = variant.variantValues ?? [];

  const mediaStyle: Record<string, string> = {
    aspectRatio: resolveAspectRatio(aspectRatio),
    objectFit: resolveObjectFit(objectFit),
  };

  return (
    <div className="kombos-cart-item__bundle">
      {image && (
        <img
          src={getDefaultSrc(image)}
          srcSet={createMediaSrcset(image)}
          sizes="32px"
          alt={variant.name}
          className="kombos-cart-item__bundle-img"
          style={mediaStyle}
        />
      )}
      <div className="kombos-cart-item__bundle-info">
        <span className="text-xs-regular">
          {quantity} × {variant.name}
        </span>
        {variantValues.length > 0 && (
          <span className="kombos-cart-item__bundle-variants text-xs-regular">
            {variantValues
              .map((vv) => `${vv.variantTypeName}: ${vv.variantValueName}`)
              .join(", ")}
          </span>
        )}
      </div>
    </div>
  );
});

export default BundleProductItem;

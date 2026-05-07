import {
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import VariantBadge from "../../sub-components/VariantBadge";

export function ProductDetailVariant({
  product,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
  useVariantImages,
}: Props) {
  if (!product) return null;

  return (
    <div
      className="kombos-pd-variant"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <VariantBadge
        product={product}
        size="l"
        showLabels
        useVariantImages={useVariantImages}
      />
    </div>
  );
}

export default ProductDetailVariant;

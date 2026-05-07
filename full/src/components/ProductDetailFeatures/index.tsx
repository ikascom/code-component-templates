import {
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function ProductDetailFeatures(props: Props) {
  const {
    mobileMarginTop,
    mobileMarginBottom,
    desktopMarginTop,
    desktopMarginBottom,
    components,
  } = props;

  const count = components?.length ?? 0;
  if (count === 0) return null;

  return (
    <div
      className="kombos-pd-features"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
        "--columns": count,
      }}
    >
      <IkasComponentRenderer
        id="product-detail-features"
        components={components}
        parentProps={props}
      />
    </div>
  );
}

export default ProductDetailFeatures;

import {
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import { useBundleProducts } from "../../hooks/useBundleProducts";
import BundleProductItem from "./components/BundleProductItem";
import BundleSkeletonLoading from "./components/BundleSkeletonLoading";
import FurnitureView from "./components/FurnitureView";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildMarginStyles(
  props: Pick<
    Props,
    | "mobileMarginTop"
    | "mobileMarginBottom"
    | "desktopMarginTop"
    | "desktopMarginBottom"
  >,
) {
  return {
    "--mobile-mt": getFormattedMarginTopSize(props.mobileMarginTop),
    "--mobile-mb": getFormattedMarginBottomSize(props.mobileMarginBottom),
    "--desktop-mt": getFormattedMarginTopSize(props.desktopMarginTop),
    "--desktop-mb": getFormattedMarginBottomSize(props.desktopMarginBottom),
  } as Record<string, string>;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProductDetailBundleProduct({
  product,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
  isBundleFurniture,
  bundleProductWithoutLink,
  quantityLabel = "Quantity",
  outOfStockText = "Out of Stock",
  productContentTitle = "Set Contents",
  aspectRatio,
  objectFit,
}: Props) {
  const { isLoading, selectedVariant, bundleSettings, sortedProducts } =
    useBundleProducts(product);

  if (!product || !selectedVariant || !bundleSettings) return null;

  const marginStyles = buildMarginStyles({
    mobileMarginTop,
    mobileMarginBottom,
    desktopMarginTop,
    desktopMarginBottom,
  });

  const skeletonCount = sortedProducts.length || 3;

  if (isBundleFurniture) {
    return (
      <FurnitureView
        marginStyles={marginStyles}
        isLoading={isLoading}
        skeletonCount={skeletonCount}
        sortedProducts={sortedProducts}
        productContentTitle={productContentTitle}
        bundleProductWithoutLink={bundleProductWithoutLink}
        quantityLabel={quantityLabel}
      />
    );
  }

  return (
    <div className="kombos-bundle" style={marginStyles}>
      <div className="kombos-bundle__list">
        {isLoading ? (
          <BundleSkeletonLoading count={skeletonCount} />
        ) : (
          sortedProducts.map((bp) => (
            <BundleProductItem
              key={bp.id}
              bundleProduct={bp}
              quantityLabel={quantityLabel}
              outOfStockText={outOfStockText}
              bundleProductWithoutLink={bundleProductWithoutLink}
              aspectRatio={aspectRatio}
              objectFit={objectFit}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetailBundleProduct;

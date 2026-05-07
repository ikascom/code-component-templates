import {
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import { useBundleProducts } from "../../hooks/useBundleProducts";
import BundleFurnitureSection from "./components/BundleFurnitureSection";

export function ProductDetailBundleFurniture({
  product,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
  productContentTitle = "Product Contents",
  partsLabel = "Parts",
  unitPriceLabel = "Unit Price",
  quantityLabel = "Quantity",
  featuresLabel = "Specifications",
  totalPriceLabel = "Total Price",
  outOfStockText = "Out of Stock",
  addProductItemText = "Add Product",
  aspectRatio,
  objectFit,
}: Props) {
  const { isLoading, selectedVariant, bundleSettings } =
    useBundleProducts(product);

  if (!product || !selectedVariant || !bundleSettings) return null;

  return (
    <div
      className="kombos-bundle-furniture-wrapper"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <BundleFurnitureSection
        bundleSettings={bundleSettings}
        isLoading={isLoading}
        aspectRatio={aspectRatio}
        objectFit={objectFit}
        texts={{
          productContentTitle,
          partsLabel,
          unitPriceLabel,
          quantityLabel,
          featuresLabel,
          totalPriceLabel,
          outOfStockText,
          addProductItemText,
        }}
      />
    </div>
  );
}

export default ProductDetailBundleFurniture;

import {
  IkasBundleProduct,
  getSelectedProductVariant,
  shouldDisplayBundleProductPrice,
  getBundleProductFormattedFinalPrice,
  getBundleProductFormattedFinalPriceWithQuantity,
  getBundleProductFormattedSellPrice,
  getBundleProductFormattedSellPriceWithQuantity,
  getBundleProductFinalPrice,
  getBundleProductSellPrice,
  getBundleProductFinalPriceWithQuantity,
  getBundleProductSellPriceWithQuantity,
  hasProductVariantStock,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import type { AspectRatio, ObjectFit } from "../../../../global-types";
import VariantBadge from "../../../../sub-components/VariantBadge";
import BundleQuantityBox from "../../../../sub-components/BundleQuantityBox";
import BundleMedia from "../../../../sub-components/BundleMedia";
import { adjustBundleProductQuantity } from "../../../../utils/bundle";

export interface BundleFurnitureRowTexts {
  outOfStockText: string;
}

interface PriceCellProps {
  formattedFinalPrice: string;
  formattedSellPrice: string;
  hasDiscount: boolean;
  finalTypography: string;
}

function PriceCell({
  formattedFinalPrice,
  formattedSellPrice,
  hasDiscount,
  finalTypography,
}: PriceCellProps) {
  return (
    <div className="kombos-bundle-furniture__price-col">
      <span className={finalTypography}>{formattedFinalPrice}</span>
      {hasDiscount && (
        <span className="kombos-bundle-furniture__old-price text-sm-regular-strike">
          {formattedSellPrice}
        </span>
      )}
    </div>
  );
}

interface Props {
  bundleProduct: IkasBundleProduct;
  texts: BundleFurnitureRowTexts;
  showFeatures: boolean;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

const BundleFurnitureRow = observer(function BundleFurnitureRow({
  bundleProduct,
  texts,
  showFeatures,
  aspectRatio = "Square",
  objectFit = "Cover",
}: Props) {
  const product = bundleProduct.product;
  if (!product) return null;

  const selectedVariant = getSelectedProductVariant(product);
  const hasStock = selectedVariant
    ? hasProductVariantStock(selectedVariant)
    : false;
  const showPrice = shouldDisplayBundleProductPrice(bundleProduct);

  const unitFinalPrice = getBundleProductFinalPrice(bundleProduct);
  const unitSellPrice = getBundleProductSellPrice(bundleProduct);
  const hasUnitDiscount = showPrice && unitFinalPrice !== unitSellPrice;

  const totalFinalPrice = getBundleProductFinalPriceWithQuantity(bundleProduct);
  const totalSellPrice = getBundleProductSellPriceWithQuantity(bundleProduct);
  const hasTotalDiscount =
    showPrice &&
    totalFinalPrice !== totalSellPrice &&
    bundleProduct.quantity > 0;

  const showTotalPrice = showPrice && bundleProduct.quantity > 0;

  return (
    <tr className="kombos-bundle-furniture__row">
      {/* Parts: image + name */}
      <td className="kombos-bundle-furniture__cell kombos-bundle-furniture__cell--parts">
        <div className="kombos-bundle-furniture__part-info">
          <BundleMedia
            variant={selectedVariant}
            alt=""
            aspectRatio={aspectRatio}
            objectFit={objectFit}
            wrapperClassName="kombos-bundle-furniture__thumb"
            mediaClassName="kombos-bundle-furniture__thumb-img"
            placeholderClassName="kombos-bundle-furniture__thumb-placeholder"
          />
          <span className="kombos-bundle-furniture__part-name text-sm-medium">
            {product.name}
          </span>
        </div>
      </td>

      {/* Unit Price */}
      <td className="kombos-bundle-furniture__cell kombos-bundle-furniture__cell--price">
        {showPrice ? (
          <PriceCell
            formattedFinalPrice={getBundleProductFormattedFinalPrice(
              bundleProduct,
            )}
            formattedSellPrice={getBundleProductFormattedSellPrice(
              bundleProduct,
            )}
            hasDiscount={hasUnitDiscount}
            finalTypography="text-sm-medium"
          />
        ) : (
          <span className="text-sm-regular">-</span>
        )}
      </td>

      {/* Quantity */}
      <td className="kombos-bundle-furniture__cell kombos-bundle-furniture__cell--qty">
        <BundleQuantityBox bundleProduct={bundleProduct} />
        {!hasStock && (
          <span className="kombos-bundle-furniture__no-stock text-xs-medium">
            {texts.outOfStockText}
          </span>
        )}
      </td>

      {/* Features (variants) */}
      {showFeatures && (
        <td className="kombos-bundle-furniture__cell kombos-bundle-furniture__cell--features">
          <VariantBadge product={product} disableRoute size="xs" onSelect={() => adjustBundleProductQuantity(bundleProduct)} />
        </td>
      )}

      {/* Total Price */}
      <td className="kombos-bundle-furniture__cell kombos-bundle-furniture__cell--total">
        {showTotalPrice ? (
          <PriceCell
            formattedFinalPrice={getBundleProductFormattedFinalPriceWithQuantity(
              bundleProduct,
            )}
            formattedSellPrice={getBundleProductFormattedSellPriceWithQuantity(
              bundleProduct,
            )}
            hasDiscount={hasTotalDiscount}
            finalTypography="text-sm-semibold"
          />
        ) : (
          <span className="text-sm-regular">-</span>
        )}
      </td>
    </tr>
  );
});

export default BundleFurnitureRow;

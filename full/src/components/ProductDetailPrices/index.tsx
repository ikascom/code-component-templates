import {
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  getProductVariantDiscountPercentage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  getSelectedProductVariant,
  hasProductVariantDiscount,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import Tag from "../../sub-components/Tag";

export function ProductDetailPrices({
  product,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
}: Props) {
  if (!product) return null;

  const selectedVariant = getSelectedProductVariant(product);

  const hasDiscount = hasProductVariantDiscount(selectedVariant);
  const finalPrice = getProductVariantFormattedFinalPrice(selectedVariant);
  const originalPrice = hasDiscount
    ? getProductVariantFormattedSellPrice(selectedVariant)
    : null;
  const discountPercentage = hasDiscount
    ? getProductVariantDiscountPercentage(selectedVariant)
    : null;

  return (
    <div
      className="kombos-pd-prices"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <div className="kombos-pd-prices__prices">
        <span className="kombos-pd-prices__final text-xl-medium md:display-xs-medium">
          {finalPrice}
        </span>
        {originalPrice && (
          <span className="kombos-pd-prices__original text-lg-medium-strike md:text-xl-medium-strike">
            {originalPrice}
          </span>
        )}
      </div>
      {discountPercentage != null && Number(discountPercentage) > 0 && (
        <Tag type="discounted" size="m">
          %{Math.round(Number(discountPercentage))}
        </Tag>
      )}
    </div>
  );
}

export default ProductDetailPrices;

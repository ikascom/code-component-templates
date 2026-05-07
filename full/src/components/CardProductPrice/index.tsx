import {
  getSelectedProductVariant,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function CardProductPrice({ product }: Props) {
  if (!product) return null;

  const selectedVariant = getSelectedProductVariant(product);

  const hasDiscount = hasProductVariantDiscount(selectedVariant);

  return (
    <div className="kombos-card-product-price">
      <span className="kombos-card-product-price__current text-sm-medium sm:text-md-medium md:text-xl-medium">
        {getProductVariantFormattedFinalPrice(selectedVariant)}
      </span>
      {hasDiscount && (
        <span className="kombos-card-product-price__old text-xs-regular-strike sm:text-sm-regular-strike md:text-md-regular-strike">
          {getProductVariantFormattedSellPrice(selectedVariant)}
        </span>
      )}
    </div>
  );
}

export default CardProductPrice;

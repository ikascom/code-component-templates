import {
  IkasBundleProduct,
  getSelectedProductVariant,
  getProductHref,
  shouldDisplayBundleProductPrice,
  getBundleProductFinalPrice,
  getBundleProductSellPrice,
  getBundleProductFormattedFinalPrice,
  getBundleProductFormattedSellPrice,
  getBundleProductFormattedFinalPriceWithQuantity,
  getBundleProductFormattedSellPriceWithQuantity,
  getBundleProductFinalPriceWithQuantity,
  getBundleProductSellPriceWithQuantity,
  hasProductVariantStock,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import VariantBadge from "../../../../sub-components/VariantBadge";
import BundleQuantityBox from "../../../../sub-components/BundleQuantityBox";
import BundleMedia from "../../../../sub-components/BundleMedia";
import { adjustBundleProductQuantity } from "../../../../utils/bundle";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

interface Props {
  bundleProduct: IkasBundleProduct;
  quantityLabel: string;
  outOfStockText: string;
  bundleProductWithoutLink?: boolean;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

const BundleProductItem = observer(function BundleProductItem({
  bundleProduct,
  quantityLabel,
  outOfStockText,
  bundleProductWithoutLink,
  aspectRatio = "Square",
  objectFit = "Cover",
}: Props) {
  const product = bundleProduct.product;
  if (!product) return null;

  const selectedVariant = getSelectedProductVariant(product);
  const hasStock = selectedVariant
    ? hasProductVariantStock(selectedVariant)
    : false;

  const productHref = getProductHref(product);

  const showPrice = shouldDisplayBundleProductPrice(bundleProduct);
  const unitFinalPrice = getBundleProductFinalPrice(bundleProduct);
  const unitSellPrice = getBundleProductSellPrice(bundleProduct);
  const hasDiscount = showPrice && unitFinalPrice !== unitSellPrice;

  const hasQuantity = bundleProduct.quantity > 1;

  const totalFinalPrice = getBundleProductFinalPriceWithQuantity(bundleProduct);
  const totalSellPrice = getBundleProductSellPriceWithQuantity(bundleProduct);
  const hasTotalDiscount =
    showPrice &&
    totalFinalPrice !== totalSellPrice &&
    bundleProduct.quantity > 0;

  const ImageWrapper = bundleProductWithoutLink ? "div" : "a";
  const imageWrapperProps = bundleProductWithoutLink
    ? {}
    : { href: productHref, "aria-label": product.name };

  const NameWrapper = bundleProductWithoutLink ? "span" : "a";
  const nameWrapperProps = bundleProductWithoutLink
    ? {}
    : { href: productHref };

  return (
    <div className="kombos-bundle-item">
      {/* Image */}
      <ImageWrapper
        className="kombos-bundle-item__image-wrap"
        {...imageWrapperProps}
      >
        <BundleMedia
          variant={selectedVariant}
          alt={product.name}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
          wrapperClassName="kombos-bundle-item__media-inner"
          mediaClassName="kombos-bundle-item__image"
          placeholderClassName="kombos-bundle-item__image-placeholder"
        />
      </ImageWrapper>
      {/* Info */}
      <div className="kombos-bundle-item__info">
        {/* Header: name + total price (quantity × unit) */}
        <div className="kombos-bundle-item__header">
          <NameWrapper
            className="kombos-bundle-item__name text-sm-semibold"
            {...nameWrapperProps}
          >
            {product.name}
          </NameWrapper>
          {showPrice && hasQuantity && (
            <div className="kombos-bundle-item__total-price">
              {hasTotalDiscount && (
                <span className="kombos-bundle-item__total-sell text-sm-regular-strike">
                  {getBundleProductFormattedSellPriceWithQuantity(
                    bundleProduct,
                  )}
                </span>
              )}
              <span className="kombos-bundle-item__total-final text-sm-semibold">
                {getBundleProductFormattedFinalPriceWithQuantity(bundleProduct)}
              </span>
            </div>
          )}
          {showPrice && !hasQuantity && (
            <div className="kombos-bundle-item__unit-price">
              {hasDiscount && (
                <span className="kombos-bundle-item__sell-price text-sm-regular-strike">
                  {getBundleProductFormattedSellPrice(bundleProduct)}
                </span>
              )}
              <span className="kombos-bundle-item__final-price text-sm-semibold">
                {getBundleProductFormattedFinalPrice(bundleProduct)}
              </span>
            </div>
          )}
        </div>

        {/* Variants */}
        <VariantBadge
          product={product}
          disableRoute
          size="xs"
          onSelect={() => adjustBundleProductQuantity(bundleProduct)}
        />

        {/* Bottom: quantity + unit price + out of stock */}
        <div className="kombos-bundle-item__bottom">
          <div className="kombos-bundle-item__qty-row">
            <span className="kombos-bundle-item__qty-label text-xs-regular">
              {quantityLabel}
            </span>
            <BundleQuantityBox bundleProduct={bundleProduct} />
            {showPrice && bundleProduct.quantity > 1 && (
              <div className="kombos-bundle-item__unit-price">
                {hasDiscount && (
                  <span className="kombos-bundle-item__sell-price text-sm-regular-strike">
                    {getBundleProductFormattedSellPrice(bundleProduct)}
                  </span>
                )}
                <span className="kombos-bundle-item__final-price text-sm-semibold">
                  {getBundleProductFormattedFinalPrice(bundleProduct)}
                </span>
              </div>
            )}
          </div>

          {!hasStock && (
            <span className="kombos-bundle-item__out-of-stock text-xs-medium">
              {outOfStockText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default BundleProductItem;

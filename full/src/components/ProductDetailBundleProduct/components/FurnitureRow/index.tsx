import {
  shouldDisplayBundleProductPrice,
  getBundleProductFormattedFinalPrice,
  getProductHref,
  IkasBundleProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

interface Props {
  bundleProduct: IkasBundleProduct;
  withoutLink?: boolean;
  quantityLabel: string;
}

const FurnitureRow = observer(function FurnitureRow({
  bundleProduct,
  withoutLink,
  quantityLabel,
}: Props) {
  const product = bundleProduct.product;
  if (!product || bundleProduct.quantity === 0) return null;

  const showPrice = shouldDisplayBundleProductPrice(bundleProduct);
  const formattedPrice = showPrice
    ? getBundleProductFormattedFinalPrice(bundleProduct)
    : "";
  const productHref = getProductHref(product);

  const NameTag = withoutLink ? "span" : "a";
  const nameProps = withoutLink ? {} : { href: productHref };

  return (
    <tr className="kombos-bundle-table__row">
      <td className="kombos-bundle-table__cell kombos-bundle-table__cell--name">
        <NameTag
          className="kombos-bundle-table__link text-sm-regular"
          {...nameProps}
        >
          {product.name}
        </NameTag>
      </td>
      <td className="kombos-bundle-table__cell kombos-bundle-table__cell--price text-sm-medium">
        {showPrice && formattedPrice
          ? `${bundleProduct.quantity} x ${formattedPrice}`
          : `${quantityLabel} ${bundleProduct.quantity}`}
      </td>
    </tr>
  );
});

export default FurnitureRow;

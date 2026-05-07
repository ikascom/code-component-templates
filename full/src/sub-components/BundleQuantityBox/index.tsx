import {
  IkasBundleProduct,
  isBundleProductQuantityEditable,
  setBundleProductQuantity,
  getSelectedProductVariant,
  hasProductVariantStock,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { MinusSVG, PlusSVG } from "../icons";

interface Props {
  bundleProduct: IkasBundleProduct;
}

const BundleQuantityBox = observer(function BundleQuantityBox({
  bundleProduct,
}: Props) {
  if (!isBundleProductQuantityEditable(bundleProduct)) {
    return (
      <span className="kombos-bundle-qty__static text-sm-medium">
        {bundleProduct.quantity}
      </span>
    );
  }

  const selectedVariant = bundleProduct.product
    ? getSelectedProductVariant(bundleProduct.product)
    : null;

  const stock = selectedVariant?.stock ?? 0;
  const sellIfOutOfStock = selectedVariant?.sellIfOutOfStock ?? false;
  const hasNoStock = selectedVariant
    ? !hasProductVariantStock(selectedVariant)
    : false;

  const canDecrement =
    bundleProduct.quantity > (bundleProduct.minQuantity ?? 0);
  const canIncrement =
    sellIfOutOfStock ||
    (!hasNoStock && (stock >= 10 || bundleProduct.quantity < stock));

  return (
    <div className="kombos-bundle-qty">
      <button
        type="button"
        className="kombos-bundle-qty__btn"
        onClick={() =>
          setBundleProductQuantity(bundleProduct, bundleProduct.quantity - 1)
        }
        disabled={!canDecrement}
        aria-label="Decrease quantity"
      >
        <MinusSVG />
      </button>
      <span className="kombos-bundle-qty__value text-sm-medium">
        {bundleProduct.quantity}
      </span>
      <button
        type="button"
        className="kombos-bundle-qty__btn"
        onClick={() =>
          setBundleProductQuantity(bundleProduct, bundleProduct.quantity + 1)
        }
        disabled={!canIncrement}
        aria-label="Increase quantity"
      >
        <PlusSVG />
      </button>
    </div>
  );
});

export default BundleQuantityBox;

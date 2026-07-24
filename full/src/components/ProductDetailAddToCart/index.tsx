import {
  addItemToCart,
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  getSelectedProductVariant,
  hasProductStock,
  hasProductVariantStock,
  isAddToCartEnabled,
  initProductOptionSetValues,
  IkasBundleSettings,
  IkasStorefrontConfig,
} from "@ikas/bp-storefront";
import { useEffect, useState } from "preact/hooks";
import { Props } from "./types";
import Button from "../../sub-components/Button";
import QuantitySelector from "../../sub-components/QuantitySelector";
import PayWithIkas from "./components/PayWithIkas";
import { isBundleOutOfStock } from "../../utils/bundle";
import { validateOptionSet } from "../../utils/optionSet";
import { getProductCartLimits } from "../../utils/cartLimits";
import { showToast } from "../../utils/toast";

export function ProductDetailAddToCart({
  product,
  addToCartButtonText = "Add to Cart",
  addingToCartText = "Adding...",
  outOfStockText = "Sold Out",
  errorMessage = "Failed to add product to cart",
  optionSetErrorMessage = "Please fill in the required options",
  updateCartButtonText = "Update",
  updatingCartText = "Updating...",
  hideQuantityInput = false,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Seed the quantity to the product's minimum-per-cart when the product changes.
  useEffect(() => {
    if (!product) return;
    setQuantity(getProductCartLimits(product).min);
  }, [product?.id]);

  if (!product) return null;

  const editLineID =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("editLineID")
      : null;
  const isEditMode = !!editLineID;

  const selectedVariant = getSelectedProductVariant(product);
  const bundleSettings = selectedVariant?.bundleSettings as
    | IkasBundleSettings
    | undefined;
  const isBundle = !!bundleSettings;

  const isEnabled = isAddToCartEnabled(product);

  const isOutOfStock = isBundle
    ? isBundleOutOfStock(bundleSettings) || !isEnabled
    : !hasProductStock(product) || !hasProductVariantStock(selectedVariant);

  const isDisabled = isOutOfStock || isAddingToCart;

  const { min: minQuantity, max: maxQuantity } = getProductCartLimits(product);

  const payWithIkasUrl = IkasStorefrontConfig.getPayWithIkasUrl();
  const routing = IkasStorefrontConfig.getCurrentRouting();
  const showPayWithIkas =
    !isOutOfStock &&
    !!payWithIkasUrl &&
    routing?.locale === "tr" &&
    routing?.currencyCode === "TRY";

  const handleAddToCart = async () => {
    if (isDisabled) return;

    if (!validateOptionSet(product.productOptionSet, optionSetErrorMessage))
      return;

    if (!isAddToCartEnabled(product)) {
      showToast(errorMessage, "error");
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addItemToCart(selectedVariant, product, quantity);

      if (result.success) {
        if (product.productOptionSet) {
          initProductOptionSetValues(product.productOptionSet);
        }
        window.dispatchEvent(new CustomEvent("ikas:reset-option-state"));
        window.dispatchEvent(new CustomEvent("ikas:open-cart-sidebar"));
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getButtonText = () => {
    if (isEditMode) {
      if (isAddingToCart) return updatingCartText;
      if (isOutOfStock) return outOfStockText;
      return updateCartButtonText;
    }
    if (isAddingToCart) return addingToCartText;
    if (isOutOfStock) return outOfStockText;
    return addToCartButtonText;
  };

  return (
    <div
      className="kombos-pd-atc"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <div className="kombos-pd-atc__actions">
        {!hideQuantityInput && !isOutOfStock && (
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={minQuantity}
            max={maxQuantity}
          />
        )}
        <Button
          variant="primary"
          size="s"
          className="kombos-pd-atc__btn"
          disabled={isDisabled}
          onClick={handleAddToCart}
        >
          {getButtonText()}
        </Button>
      </div>
      {showPayWithIkas && (
        <PayWithIkas
          product={product}
          quantity={quantity}
          isEnabled={isEnabled}
          payWithIkasUrl={payWithIkasUrl!}
        />
      )}
    </div>
  );
}

export default ProductDetailAddToCart;

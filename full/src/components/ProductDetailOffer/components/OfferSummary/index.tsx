import {
  IkasProduct,
  isAcceptedProductOffer,
  getSelectedProductVariant,
  getProductVariantCampaignOffersDiscountPercentage,
  getProductVariantFormattedFinalPriceWithCampaignOffers,
  getProductVariantFormattedSellPriceWithCampaignOffers,
  hasProductVariantStock,
  isAddToCartEnabled,
  cartStore,
  findExistingCartItem,
  changeItemQuantity,
  addItemToCart,
  initProductOptionSetValues,
} from "@ikas/bp-storefront";
import { validateOptionSet } from "../../../../utils/optionSet";
import { showToast } from "../../../../utils/toast";
import { observer } from "@ikas/component-utils";
import Button from "../../../../sub-components/Button";
import Tag from "../../../../sub-components/Tag";
import { InfoCircleSVG } from "../../../../sub-components/icons";
import { useState } from "preact/hooks";

interface Props {
  product: IkasProduct;
  offerInfoText: string;
  totalText: string;
  advantageousTotalText: string;
  isInline: boolean;
  addingToCartText: string;
  addToCartTogetherText: string;
  errorMessage: string;
  optionSetErrorMessage: string;
}

const OfferSummary = observer(function OfferSummary({
  product,
  offerInfoText,
  totalText,
  advantageousTotalText,
  isInline,
  addingToCartText,
  addToCartTogetherText,
  errorMessage,
  optionSetErrorMessage,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = getSelectedProductVariant(product);

  const discountPercentage =
    getProductVariantCampaignOffersDiscountPercentage(selectedVariant);
  const finalPrice =
    getProductVariantFormattedFinalPriceWithCampaignOffers(selectedVariant);
  const sellPrice =
    getProductVariantFormattedSellPriceWithCampaignOffers(selectedVariant);
  const hasDiscount = discountPercentage > 0;
  const mainInStock = selectedVariant
    ? hasProductVariantStock(selectedVariant)
    : false;

  const acceptedCount =
    product.offers
      ?.filter((o) => !isAcceptedProductOffer(o))
      .reduce((acc, offer) => acc + (offer.isSelected ? 1 : 0), 0) || 0;

  async function handleAddToCartTogether() {
    if (isAdding || !mainInStock) return;

    if (!validateOptionSet(product.productOptionSet, optionSetErrorMessage))
      return;

    if (!isAddToCartEnabled(product!)) {
      showToast(errorMessage, "error");
      return;
    }

    setIsAdding(true);
    try {
      const cart = cartStore.cart;
      if (cart) {
        const existingItem = findExistingCartItem(
          cart,
          selectedVariant!,
          product!,
        );
        if (existingItem) {
          const result = await changeItemQuantity(
            existingItem,
            existingItem.quantity + 1,
            product!.offers,
            product!,
          );
          if (result.success) {
            if (product.productOptionSet) {
              initProductOptionSetValues(product.productOptionSet);
            }
            window.dispatchEvent(new CustomEvent("ikas:reset-option-state"));
            window.dispatchEvent(new CustomEvent("ikas:open-cart-sidebar"));
          } else {
            showToast(errorMessage, "error");
          }
          return;
        }
      }

      const result = await addItemToCart(selectedVariant!, product!, 1);
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
      setIsAdding(false);
    }
  }

  return (
    <div className="kombos-pd-offer__summary">
      <div className="kombos-pd-offer__summary-info">
        <span className="kombos-pd-offer__summary-info-icon">
          <InfoCircleSVG />
        </span>
        <span className="text-xs-regular">{offerInfoText}</span>
      </div>

      {hasDiscount && (
        <div className="kombos-pd-offer__total-row">
          <span className="kombos-pd-offer__total-label text-sm-regular">
            {totalText}
          </span>
          <span className="kombos-pd-offer__total-price--strike text-sm-regular">
            {sellPrice}
          </span>
        </div>
      )}

      <div className="kombos-pd-offer__discount-row">
        <span className="kombos-pd-offer__total-label text-sm-medium">
          {hasDiscount ? advantageousTotalText : totalText}
        </span>
        <div className="kombos-pd-offer__discount-values">
          {hasDiscount && (
            <Tag type="dark" size="s">
              -{Math.round(discountPercentage)}%
            </Tag>
          )}
          <span className="kombos-pd-offer__total-price text-md-semibold">
            {finalPrice}
          </span>
        </div>
      </div>

      {!isInline && (
        <Button
          variant="primary"
          size="s"
          className="kombos-pd-offer__btn"
          disabled={isAdding || !mainInStock}
          onClick={handleAddToCartTogether}
        >
          {isAdding
            ? addingToCartText
            : `${addToCartTogetherText} (${acceptedCount + 1})`}
        </Button>
      )}
    </div>
  );
});

export default OfferSummary;

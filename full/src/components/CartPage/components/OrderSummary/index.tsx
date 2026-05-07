import {
  cartStore,
  IkasCart,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderFormattedTotalPrice,
  getOrderAdjustmentDisplayName,
  getOrderAdjustmentFormattedAmount,
  getOrderAdjustmentIsDecrement,
  getCheckoutUrlFromCartStore,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../../../../sub-components/Button";
import CouponCode from "../CouponCode";
import { cx } from "../../../../utils/cx";

interface Props {
  cart: IkasCart;
  title: string;
  subtotalLabel: string;
  totalLabel: string;
  checkoutButtonText: string;
  couponToggleText: string;
  couponPlaceholder: string;
  couponApplyText: string;
  couponRemoveText: string;
  couponApplyingText: string;
}

const OrderSummary = observer(function OrderSummary({
  cart,
  title,
  subtotalLabel,
  totalLabel,
  checkoutButtonText,
  couponToggleText,
  couponPlaceholder,
  couponApplyText,
  couponRemoveText,
  couponApplyingText,
}: Props) {
  const adjustments = cart.orderAdjustments ?? [];

  return (
    <div className="order-summary">
      <h2 className="order-summary__title text-md-semibold md:text-lg-semibold">{title}</h2>

      <div className="order-summary__rows">
        <div className="order-summary__row">
          <span className="text-md-regular">{subtotalLabel}</span>
          <span className="text-md-semibold">
            {getIkasOrderFormattedTotalPrice(cart)}
          </span>
        </div>

        {adjustments.map((adj, i) => {
          const isDecrement = !!getOrderAdjustmentIsDecrement(adj);

          return (
            <div key={i} className="order-summary__row">
              <span className="text-sm-regular">
                {getOrderAdjustmentDisplayName(adj)}
              </span>
              <span
                className={cx(
                  "order-summary__adjustment-amount text-sm-semibold",
                  isDecrement && "order-summary__adjustment-amount--discount",
                )}
              >
                {getOrderAdjustmentFormattedAmount(adj)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__row order-summary__total">
        <span className="text-md-semibold md:text-lg-semibold">{totalLabel}</span>
        <span className="text-md-semibold md:text-lg-semibold">
          {getIkasOrderFormattedTotalFinalPrice(cart)}
        </span>
      </div>

      <CouponCode
        appliedCoupon={cart.couponCode}
        toggleText={couponToggleText}
        placeholder={couponPlaceholder}
        applyText={couponApplyText}
        removeText={couponRemoveText}
        applyingText={couponApplyingText}
      />

      <a
        className="order-summary__checkout-link"
        href={getCheckoutUrlFromCartStore(cartStore)}
      >
        <Button variant="primary" className="order-summary__checkout-btn">
          {checkoutButtonText}
        </Button>
      </a>
    </div>
  );
});

export default OrderSummary;

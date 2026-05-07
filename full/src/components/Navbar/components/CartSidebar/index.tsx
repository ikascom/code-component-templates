import { useEffect, useState, useCallback } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import { useScrollLock } from "../../../../hooks/useScrollLock";
import { cx } from "../../../../utils/cx";
import {
  XSVG,
  Package1SVG,
  Handbag1SVG,
} from "../../../../sub-components/icons";
import Button from "../../../../sub-components/Button";
import {
  cartStore,
  hasCart,
  getIkasOrderTotalItemCount,
  getIkasOrderFormattedTotalFinalPrice,
  getOrderAdjustmentDisplayName,
  getOrderAdjustmentFormattedAmount,
  removeItem,
  getCheckoutUrlFromCartStore,
  IkasOrderLineItem,
  Router,
} from "@ikas/bp-storefront";
import type { AspectRatio, ObjectFit } from "../../../../global-types";
import CartItem from "../../../../sub-components/CartItem";

interface Props {
  cartTitle: string;
  emptyCartText: string;
  checkoutButtonText: string;
  viewCartButtonText: string;
  totalText: string;
  freeShippingText: string;
  emptyCartButtonText: string;
  imageAspectRatio?: AspectRatio;
  imageObjectFit?: ObjectFit;
  onClose: () => void;
}

const CartSidebar = observer(function CartSidebar({
  cartTitle,
  emptyCartText,
  checkoutButtonText,
  viewCartButtonText,
  totalText,
  freeShippingText,
  emptyCartButtonText,
  imageAspectRatio,
  imageObjectFit,
  onClose,
}: Props) {
  const [open, setOpen] = useState(false);

  useScrollLock();

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const cart = cartStore.cart;
  const isCartLoading = cartStore.isCartLoading;
  const cartHasItems = hasCart(cartStore);
  const itemCount = cart ? getIkasOrderTotalItemCount(cart) : 0;
  const lineItems = cart?.orderLineItems ?? [];
  const adjustments = cart?.orderAdjustments ?? [];

  const handleRemove = async (item: IkasOrderLineItem) => {
    await removeItem(item);
  };

  return (
    <div
      className={cx("kombos-cart-overlay", open && "kombos-cart-overlay--open")}
    >
      <div className="kombos-cart-backdrop" onClick={handleClose} />
      <aside className="kombos-cart-sidebar">
        {/* Header */}
        <div className="kombos-cart-sidebar__head">
          <h3 className="kombos-cart-sidebar__title text-md-medium">
            {cartTitle} ({itemCount})
          </h3>
          <button
            className="kombos-cart-sidebar__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <XSVG />
          </button>
        </div>

        {/* Free Shipping Banner */}
        {freeShippingText && (
          <div className="kombos-cart-sidebar__banner">
            <Package1SVG />
            <span className="text-xs-semibold">{freeShippingText}</span>
          </div>
        )}

        {/* Loading */}
        {isCartLoading && (
          <div className="kombos-cart-sidebar__loading text-sm-regular" />
        )}

        {/* Empty State */}
        {!cartHasItems && !isCartLoading && (
          <div className="kombos-cart-sidebar__empty">
            <Handbag1SVG />
            <p className="kombos-cart-sidebar__empty-text text-md-medium">
              {emptyCartText}
            </p>
            <Button
              variant="primary"
              size="s"
              className="kombos-cart-sidebar__empty-btn"
              onClick={handleClose}
            >
              {emptyCartButtonText}
            </Button>
          </div>
        )}

        {/* Cart Items */}
        {cartHasItems && (
          <div className="kombos-cart-sidebar__items">
            {lineItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                aspectRatio={imageAspectRatio}
                objectFit={imageObjectFit}
              />
            ))}
          </div>
        )}

        {/* Adjustments */}
        {adjustments.length > 0 && (
          <div className="kombos-cart-sidebar__adjustments">
            {adjustments.map((adj: any, i: number) => (
              <div
                key={i}
                className="kombos-cart-sidebar__adj-row text-sm-regular"
              >
                <span>{getOrderAdjustmentDisplayName(adj)}</span>
                <span className="kombos-cart-sidebar__adj-amount text-sm-medium">
                  {getOrderAdjustmentFormattedAmount(adj)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cartHasItems && cart && (
          <div className="kombos-cart-sidebar__footer">
            <div className="kombos-cart-sidebar__total text-md-semibold">
              <span>{totalText}</span>
              <span>{getIkasOrderFormattedTotalFinalPrice(cart)}</span>
            </div>
            <div className="kombos-cart-sidebar__footer-buttons">
              <a
                href="/cart"
                className="kombos-cart-sidebar__view-cart-link"
                onClick={(e: Event) => {
                  e.preventDefault();
                  handleClose();
                  Router.navigateToPage("CART");
                }}
              >
                <Button
                  variant="secondary"
                  size="s"
                  className="kombos-cart-sidebar__view-cart-btn"
                >
                  {viewCartButtonText}
                </Button>
              </a>
              <a
                href={getCheckoutUrlFromCartStore(cartStore)}
                className="kombos-cart-sidebar__checkout"
              >
                <Button
                  variant="primary"
                  size="s"
                  className="kombos-cart-sidebar__checkout-btn"
                >
                  {checkoutButtonText}
                </Button>
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
});

export default CartSidebar;

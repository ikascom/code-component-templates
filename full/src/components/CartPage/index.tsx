import {
  cartStore,
  hasCart,
  removeItem,
  getIkasOrderTotalItemCount,
  IkasOrderLineItem,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import PageLoader from "../../sub-components/PageLoader";
import CartItem from "../../sub-components/CartItem";
import OrderSummary from "./components/OrderSummary";
import EmptyState from "./components/EmptyState";

export function CartPage({
  title = "Cart",
  emptyCartText = "Your cart is empty",
  subtotalLabel = "Subtotal",
  totalLabel = "Total",
  checkoutButtonText = "Complete Order",
  itemsText = "product",
  couponToggleText = "Use Gift Code!",
  couponPlaceholder = "Enter coupon code",
  couponApplyText = "Apply",
  couponRemoveText = "Remove",
  couponApplyingText = "Applying...",
  orderSummaryTitle = "Order Summary",
  continueShoppingText = "Start Shopping",
}: Props) {
  const cart = cartStore.cart;
  const isLoading = cartStore.isCartLoading;
  const cartHasItems = hasCart(cartStore);
  const lineItems = (cart?.orderLineItems ?? []).filter(
    (item) => !item?.deleted,
  );
  const totalItemCount = cart ? getIkasOrderTotalItemCount(cart) : 0;

  const handleRemove = async (item: IkasOrderLineItem) => {
    await removeItem(item);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!cartHasItems) {
    return (
      <section className="cart-page">
        <div className="kombos-container cart-page__container">
          <header className="cart-page__header">
            <h1 className="cart-page__title text-xl-semibold md:display-xs-semibold">{title}</h1>
          </header>
          <EmptyState
            emptyCartText={emptyCartText}
            continueShoppingText={continueShoppingText}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="kombos-container cart-page__container">
        <header className="cart-page__header">
          <h1 className="cart-page__title text-xl-semibold md:display-xs-semibold">
            {title}{" "}
            <span className="cart-page__count text-lg-regular">
              ({totalItemCount} {itemsText})
            </span>
          </h1>
        </header>

        <div className="cart-page__layout">
          <div className="cart-page__items-col">
            <div className="cart-page__items">
              {lineItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  variant="page"
                />
              ))}
            </div>
          </div>

          {cart && (
            <OrderSummary
              cart={cart}
              title={orderSummaryTitle}
              subtotalLabel={subtotalLabel}
              totalLabel={totalLabel}
              checkoutButtonText={checkoutButtonText}
              couponToggleText={couponToggleText}
              couponPlaceholder={couponPlaceholder}
              couponApplyText={couponApplyText}
              couponRemoveText={couponRemoveText}
              couponApplyingText={couponApplyingText}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default CartPage;

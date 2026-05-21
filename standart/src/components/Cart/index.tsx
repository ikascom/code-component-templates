import { useState, useEffect, useRef, useMemo } from "preact/hooks";
import {
  cartStore,
  removeItem,
  changeItemQuantity,
  getCheckoutUrlFromCartStore,
  getIkasOrderLineVariantMainImage,
  getIkasOrderLineVariantHref,
  getOrderLineItemFormattedFinalPrice,
  getOrderLineItemFormattedPrice,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  hasOrderLineItemDiscount,
  getIkasOrderFormattedTotalPrice,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderDisplayedAdjustments,
  getOrderAdjustmentDisplayName,
  getOrderAdjustmentFormattedAmount,
  getOrderAdjustmentIsDecrement,
  getDefaultSrc,
  createMediaSrcset,
  Router,
  IkasOrderLineItem,
} from "@ikas/bp-storefront";
import { Props } from "./types";

const QUANTITY_DEBOUNCE_MS = 400;

export function Cart({
  backgroundColor,
  pageTitle,
  emptyCartTitle,
  emptyCartSubText,
  emptyCartButton,
  orderSummaryTitle,
  subtotalLabel,
  shippingLabel,
  shippingValueText,
  totalLabel,
  checkoutButtonText,
  continueShoppingButton,
  removeItemAriaLabel,
  decreaseQuantityAriaLabel,
  increaseQuantityAriaLabel,
  cartSectionAriaLabel = "Shopping cart",
  showShippingRow,
}: Props) {
  const [pendingItems, setPendingItems] = useState<Record<string, boolean>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const qtyTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      Object.values(qtyTimersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const cart = cartStore.cart;
  const lineItems: IkasOrderLineItem[] = cart?.orderLineItems ?? [];
  const isEmpty = lineItems.length === 0;
  const hasPending = Object.keys(pendingItems).length > 0;

  const formattedSubtotal = useMemo(
    () => (cart ? getIkasOrderFormattedTotalPrice(cart) : ""),
    [cart, cart?.totalPrice, lineItems.length]
  );
  const formattedTotal = useMemo(
    () => (cart ? getIkasOrderFormattedTotalFinalPrice(cart) : ""),
    [cart, cart?.totalFinalPrice, lineItems.length]
  );
  const adjustments = cart ? getIkasOrderDisplayedAdjustments(cart) ?? [] : [];

  const setItemPending = (id: string, pending: boolean) => {
    setPendingItems((prev) => {
      if (pending) return { ...prev, [id]: true };
      const { [id]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const scheduleQuantityChange = (item: IkasOrderLineItem, nextQty: number) => {
    const id = item.id;
    if (qtyTimersRef.current[id]) clearTimeout(qtyTimersRef.current[id]);
    setItemPending(id, true);
    qtyTimersRef.current[id] = setTimeout(async () => {
      try {
        if (nextQty <= 0) {
          await removeItem(item);
        } else {
          await changeItemQuantity(item, nextQty);
        }
      } finally {
        setItemPending(id, false);
        delete qtyTimersRef.current[id];
      }
    }, QUANTITY_DEBOUNCE_MS);
  };

  const handleDecrement = (item: IkasOrderLineItem) => {
    if (pendingItems[item.id]) return;
    if (item.quantity <= 1) {
      scheduleQuantityChange(item, 0);
      return;
    }
    scheduleQuantityChange(item, item.quantity - 1);
  };

  const handleIncrement = (item: IkasOrderLineItem) => {
    if (pendingItems[item.id]) return;
    scheduleQuantityChange(item, item.quantity + 1);
  };

  const handleRemove = async (item: IkasOrderLineItem) => {
    if (pendingItems[item.id]) return;
    setItemPending(item.id, true);
    try {
      await removeItem(item);
    } finally {
      setItemPending(item.id, false);
    }
  };

  const handleLinkClick = (
    e: MouseEvent,
    link: typeof emptyCartButton | typeof continueShoppingButton
  ) => {
    if (!link?.href) return;
    if (link.openInNewTab) return;
    e.preventDefault();
    Router.navigate(link.href);
  };

  const handleCheckout = () => {
    if (checkoutLoading || hasPending || isEmpty) return;
    const url = getCheckoutUrlFromCartStore(cartStore);
    if (!url) return;
    setCheckoutLoading(true);
    window.location.href = url;
  };

  const renderVariantLabel = (item: IkasOrderLineItem) => {
    const opts = item.options ?? [];
    if (!opts.length) return null;
    const parts = opts
      .map((opt) => {
        const valNames = (opt.values ?? [])
          .map((v) => v?.name)
          .filter(Boolean)
          .join(" / ");
        if (!valNames) return null;
        return `${opt.name}: ${valNames}`;
      })
      .filter(Boolean)
      .join(" / ");
    if (!parts) return null;
    return <p class="cart-page-item-variant">{parts}</p>;
  };

  const renderItem = (item: IkasOrderLineItem) => {
    const variant = item.variant;
    const image = getIkasOrderLineVariantMainImage(variant);
    const href = getIkasOrderLineVariantHref(variant);
    const onSale = hasOrderLineItemDiscount(item);
    const finalUnitPrice = getOrderLineItemFormattedFinalPrice(item);
    const originalUnitPrice = getOrderLineItemFormattedPrice(item);
    const lineTotal = getOrderLineItemFormattedFinalPriceWithQuantity(item);
    const pending = !!pendingItems[item.id];

    const imageEl = image ? (
      <img
        src={getDefaultSrc(image)}
        srcSet={createMediaSrcset(image)}
        sizes="(max-width: 767px) 80px, 120px"
        alt={image.altText || variant.name || ""}
        class="cart-page-item-image"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div class="cart-page-item-image cart-page-item-image--placeholder" aria-hidden="true" />
    );

    return (
      <li
        key={item.id}
        class={`cart-page-item${pending ? " cart-page-item--pending" : ""}`}
      >
        {href ? (
          <a class="cart-page-item-image-link" href={href} aria-label={variant.name}>
            {imageEl}
          </a>
        ) : (
          imageEl
        )}

        <div class="cart-page-item-info">
          {href ? (
            <a class="cart-page-item-name" href={href}>
              {variant.name}
            </a>
          ) : (
            <span class="cart-page-item-name">{variant.name}</span>
          )}
          {renderVariantLabel(item)}
          <p class="cart-page-item-price">
            {onSale ? (
              <>
                <span class="cart-page-item-price-strike">{originalUnitPrice}</span>
                <span class="cart-page-item-price-sale">{finalUnitPrice}</span>
              </>
            ) : (
              <span>{finalUnitPrice}</span>
            )}
          </p>

          <div class="cart-page-item-controls">
            <div class="cart-page-stepper" role="group" aria-label={variant.name}>
              <button
                type="button"
                class="cart-page-stepper-btn"
                onClick={() => handleDecrement(item)}
                disabled={pending}
                aria-label={decreaseQuantityAriaLabel}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
              <span class="cart-page-stepper-value">{item.quantity}</span>
              <button
                type="button"
                class="cart-page-stepper-btn"
                onClick={() => handleIncrement(item)}
                disabled={pending}
                aria-label={increaseQuantityAriaLabel}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="7" y1="3" x2="7" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              class="cart-page-item-remove"
              onClick={() => handleRemove(item)}
              disabled={pending}
              aria-label={removeItemAriaLabel}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        </div>

        <div class="cart-page-item-total" aria-hidden="true">{lineTotal}</div>
      </li>
    );
  };

  const sectionStyle = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section
      class="cart-page"
      style={sectionStyle}
      aria-label={cartSectionAriaLabel}
    >
      <div class="cart-page-inner">
        <h1 class="cart-page-title">{pageTitle}</h1>

        {isEmpty ? (
          <div class="cart-page-empty">
            <svg class="cart-page-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 class="cart-page-empty-title">{emptyCartTitle}</h2>
            <p class="cart-page-empty-sub">{emptyCartSubText}</p>
            {emptyCartButton?.label && emptyCartButton?.href ? (
              <a
                class="cart-page-btn cart-page-btn--primary"
                href={emptyCartButton.href}
                target={emptyCartButton.openInNewTab ? "_blank" : undefined}
                rel={emptyCartButton.openInNewTab ? "noopener noreferrer" : undefined}
                onClick={(e) => handleLinkClick(e, emptyCartButton)}
              >
                {emptyCartButton.label}
              </a>
            ) : null}
          </div>
        ) : (
          <div class="cart-page-grid">
            <div class="cart-page-items-col">
              <ul class="cart-page-list" role="list">
                {lineItems.map(renderItem)}
              </ul>
            </div>

            <aside class="cart-page-summary-col">
              <div class="cart-page-summary">
                <h2 class="cart-page-summary-title">{orderSummaryTitle}</h2>

                <div class="cart-page-summary-rows">
                  <div class="cart-page-summary-row">
                    <span class="cart-page-summary-label">{subtotalLabel}</span>
                    <span class="cart-page-summary-value">{formattedSubtotal}</span>
                  </div>
                  {adjustments.map((adj, i) => {
                    const isDecrement = getOrderAdjustmentIsDecrement(adj);
                    return (
                      <div class="cart-page-summary-row" key={`adj-${i}`}>
                        <span class="cart-page-summary-label">
                          {getOrderAdjustmentDisplayName(adj)}
                        </span>
                        <span
                          class={`cart-page-summary-value${isDecrement ? " cart-page-summary-value--decrement" : ""}`}
                        >
                          {getOrderAdjustmentFormattedAmount(adj)}
                        </span>
                      </div>
                    );
                  })}
                  {showShippingRow && (
                    <div class="cart-page-summary-row">
                      <span class="cart-page-summary-label">{shippingLabel}</span>
                      <span class="cart-page-summary-value cart-page-summary-value--muted">
                        {shippingValueText}
                      </span>
                    </div>
                  )}
                </div>

                <div class="cart-page-summary-total" aria-live="polite">
                  <span class="cart-page-summary-total-label">{totalLabel}</span>
                  <span class="cart-page-summary-total-value">{formattedTotal}</span>
                </div>

                <button
                  type="button"
                  class="cart-page-btn cart-page-btn--primary cart-page-checkout"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || hasPending}
                >
                  {checkoutButtonText}
                </button>

                {continueShoppingButton?.label && continueShoppingButton?.href ? (
                  <a
                    class="cart-page-btn cart-page-btn--ghost"
                    href={continueShoppingButton.href}
                    target={continueShoppingButton.openInNewTab ? "_blank" : undefined}
                    rel={continueShoppingButton.openInNewTab ? "noopener noreferrer" : undefined}
                    onClick={(e) => handleLinkClick(e, continueShoppingButton)}
                  >
                    {continueShoppingButton.label}
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;

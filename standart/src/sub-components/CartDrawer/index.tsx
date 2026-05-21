import { observer } from "@ikas/component-utils";
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
  hasOrderLineItemDiscount,
  getIkasOrderFormattedTotalPrice,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderDisplayedAdjustments,
  getOrderAdjustmentDisplayName,
  getOrderAdjustmentFormattedAmount,
  getOrderAdjustmentIsDecrement,
  getDefaultSrc,
  createMediaSrcset,
  IkasOrderLineItem,
  IkasNavigationLink,
  Router,
} from "@ikas/bp-storefront";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  drawerTitle: string;
  closeButtonAriaLabel: string;
  cartDrawerAriaLabel: string;
  removeItemAriaLabel: string;
  decreaseQuantityAriaLabel: string;
  increaseQuantityAriaLabel: string;
  emptyCartTitle: string;
  emptyCartSubText: string;
  emptyCartButton: IkasNavigationLink | null | undefined;
  subtotalLabel: string;
  totalLabel: string;
  shippingNoteText: string;
  showShippingNote: boolean;
  checkoutButtonText: string;
  checkoutButtonAriaLabel: string;
  continueShoppingText: string;
  removeOnZero: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TRANSITION_MS = 350;
const QUANTITY_DEBOUNCE_MS = 250;

const CartDrawer = observer(function CartDrawer({
  isOpen,
  onClose,
  drawerTitle,
  closeButtonAriaLabel,
  cartDrawerAriaLabel,
  removeItemAriaLabel,
  decreaseQuantityAriaLabel,
  increaseQuantityAriaLabel,
  emptyCartTitle,
  emptyCartSubText,
  emptyCartButton,
  subtotalLabel,
  totalLabel,
  shippingNoteText,
  showShippingNote,
  checkoutButtonText,
  checkoutButtonAriaLabel,
  continueShoppingText,
  removeOnZero,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pendingItems, setPendingItems] = useState<Record<string, boolean>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const qtyTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    if (mounted) {
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), TRANSITION_MS);
      return () => window.clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );
        if (!focusables.length) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  useEffect(() => {
    return () => {
      Object.values(qtyTimersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const cart = cartStore.cart;
  const lineItems: IkasOrderLineItem[] = cart?.orderLineItems ?? [];
  const isEmpty = lineItems.length === 0;
  const adjustments = cart ? getIkasOrderDisplayedAdjustments(cart) ?? [] : [];
  const hasAdjustments = adjustments.length > 0;
  const formattedItemsSubtotal = useMemo(
    () => (cart ? getIkasOrderFormattedTotalPrice(cart) : ""),
    [cart, cart?.totalPrice, lineItems.length]
  );
  const formattedTotal = useMemo(
    () => (cart ? getIkasOrderFormattedTotalFinalPrice(cart) : ""),
    [cart, cart?.totalFinalPrice, lineItems.length]
  );

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
      if (removeOnZero) {
        scheduleQuantityChange(item, 0);
      }
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

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleEmptyCta = (e: MouseEvent) => {
    const href = emptyCartButton?.href || "/";
    const newTab = !!emptyCartButton?.openInNewTab;
    if (newTab) {
      onClose();
      return;
    }
    e.preventDefault();
    onClose();
    Router.navigate(href);
  };

  const handleCheckout = () => {
    if (checkoutLoading || isEmpty) return;
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
    return <p class="cart-drawer-item-variant">{parts}</p>;
  };

  const renderItem = (item: IkasOrderLineItem) => {
    const variant = item.variant;
    const image = getIkasOrderLineVariantMainImage(variant);
    const href = getIkasOrderLineVariantHref(variant);
    const onSale = hasOrderLineItemDiscount(item);
    const finalPrice = getOrderLineItemFormattedFinalPrice(item);
    const originalPrice = getOrderLineItemFormattedPrice(item);
    const pending = !!pendingItems[item.id];
    const minusDisabled = pending || (item.quantity <= 1 && !removeOnZero);

    const imageEl = image ? (
      <img
        src={getDefaultSrc(image)}
        srcSet={createMediaSrcset(image)}
        sizes="80px"
        alt={image.altText || variant.name || ""}
        class="cart-drawer-item-image"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div class="cart-drawer-item-image cart-drawer-item-image--placeholder" aria-hidden="true" />
    );

    return (
      <li
        key={item.id}
        class={`cart-drawer-item${pending ? " cart-drawer-item--pending" : ""}`}
        role="listitem"
      >
        {href ? (
          <a class="cart-drawer-item-image-link" href={href} tabIndex={pending ? -1 : 0} aria-label={variant.name}>
            {imageEl}
          </a>
        ) : (
          imageEl
        )}

        <div class="cart-drawer-item-info">
          <div class="cart-drawer-item-info-top">
            {href ? (
              <a class="cart-drawer-item-name" href={href}>
                {variant.name}
              </a>
            ) : (
              <span class="cart-drawer-item-name">{variant.name}</span>
            )}
            {renderVariantLabel(item)}
            <p class="cart-drawer-item-price">
              {onSale ? (
                <>
                  <span class="cart-drawer-item-price-strike">{originalPrice}</span>
                  <span class="cart-drawer-item-price-sale">{finalPrice}</span>
                </>
              ) : (
                <span>{finalPrice}</span>
              )}
            </p>
          </div>

          <div class="cart-drawer-item-controls">
            <div class="cart-drawer-stepper" role="group" aria-label={variant.name}>
              <button
                type="button"
                class="cart-drawer-stepper-btn"
                onClick={() => handleDecrement(item)}
                disabled={minusDisabled}
                aria-label={decreaseQuantityAriaLabel}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
              <span class="cart-drawer-stepper-value" aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                class="cart-drawer-stepper-btn"
                onClick={() => handleIncrement(item)}
                disabled={pending}
                aria-label={increaseQuantityAriaLabel}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              class="cart-drawer-item-remove"
              onClick={() => handleRemove(item)}
              disabled={pending}
              aria-label={removeItemAriaLabel}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    );
  };

  if (!mounted) return null;

  return (
    <div
      class={`cart-drawer-backdrop${visible ? " cart-drawer-backdrop--open" : ""}`}
      onClick={handleBackdropClick}
    >
      <aside
        ref={panelRef}
        class={`cart-drawer-panel${visible ? " cart-drawer-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={cartDrawerAriaLabel}
      >
        <header class="cart-drawer-header">
          <h2 class="cart-drawer-title">{drawerTitle}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            class="cart-drawer-close"
            onClick={onClose}
            aria-label={closeButtonAriaLabel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {isEmpty ? (
          <div class="cart-drawer-empty">
            <svg class="cart-drawer-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h3 class="cart-drawer-empty-title">{emptyCartTitle}</h3>
            <p class="cart-drawer-empty-sub">{emptyCartSubText}</p>
            {emptyCartButton?.label && emptyCartButton?.href ? (
              <a
                class="cart-drawer-btn cart-drawer-btn--primary"
                href={emptyCartButton.href}
                target={emptyCartButton.openInNewTab ? "_blank" : undefined}
                rel={emptyCartButton.openInNewTab ? "noopener noreferrer" : undefined}
                onClick={handleEmptyCta}
              >
                {emptyCartButton.label}
              </a>
            ) : null}
          </div>
        ) : (
          <>
            <ul class="cart-drawer-list" role="list">
              {lineItems.map(renderItem)}
            </ul>

            <footer class="cart-drawer-footer">
              {hasAdjustments ? (
                <>
                  <div class="cart-drawer-summary-row">
                    <span class="cart-drawer-summary-label">{subtotalLabel}</span>
                    <span class="cart-drawer-summary-value">{formattedItemsSubtotal}</span>
                  </div>
                  {adjustments.map((adj, i) => {
                    const isDecrement = getOrderAdjustmentIsDecrement(adj);
                    return (
                      <div class="cart-drawer-summary-row" key={`adj-${i}`}>
                        <span class="cart-drawer-summary-label">
                          {getOrderAdjustmentDisplayName(adj)}
                        </span>
                        <span
                          class={`cart-drawer-summary-value${isDecrement ? " cart-drawer-summary-value--decrement" : ""}`}
                        >
                          {getOrderAdjustmentFormattedAmount(adj)}
                        </span>
                      </div>
                    );
                  })}
                  <div class="cart-drawer-subtotal cart-drawer-subtotal--total">
                    <span class="cart-drawer-subtotal-label">{totalLabel}</span>
                    <span class="cart-drawer-subtotal-value">{formattedTotal}</span>
                  </div>
                </>
              ) : (
                <div class="cart-drawer-subtotal">
                  <span class="cart-drawer-subtotal-label">{subtotalLabel}</span>
                  <span class="cart-drawer-subtotal-value">{formattedTotal}</span>
                </div>
              )}
              {showShippingNote && shippingNoteText ? (
                <p class="cart-drawer-shipping-note">{shippingNoteText}</p>
              ) : null}
              <button
                type="button"
                class="cart-drawer-btn cart-drawer-btn--primary cart-drawer-checkout"
                onClick={handleCheckout}
                disabled={checkoutLoading || Object.keys(pendingItems).length > 0}
                aria-label={checkoutButtonAriaLabel}
              >
                {checkoutButtonText}
              </button>
              <button
                type="button"
                class="cart-drawer-btn cart-drawer-btn--ghost"
                onClick={onClose}
              >
                {continueShoppingText}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
});

export default CartDrawer;

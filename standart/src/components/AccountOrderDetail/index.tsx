import { useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  getOrderDetailsOfPage,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderFormattedTotalPrice,
  getIkasOrderFormattedShippingTotal,
  getIkasOrderFormattedTotalTax,
  getIkasOrderShippingTotal,
  getIkasOrderTotalTax,
  getIkasOrderPackageStatusTranslation,
  getIkasOrderDisplayedAdjustments,
  getOrderAdjustmentFormattedAmount,
  getOrderAdjustmentDisplayName,
  getOrderAdjustmentIsDecrement,
  getOrderLineItemFormattedFinalPrice,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  getOrderTransactionPaymentMethodTranslation,
  getIkasOrderLineVariantMainImage,
  getDefaultSrc,
  getIkasOrderRefundableItems,
  getIkasOrderRefundedItems,
  getOrderLineItemRefundQuantity,
  setOrderLineItemRefundQuantity,
  getOrderRefundSettings,
  refundOrder,
  IkasOrder,
  IkasOrderAddress,
  IkasOrderLineItem,
  IkasOrderTransaction,
} from "@ikas/bp-storefront";
import AccountSidebar from "../../sub-components/AccountSidebar";
import { Props } from "./types";

const formatAddressLines = (addr: IkasOrderAddress): string[] => {
  const lines: string[] = [];
  const recipient = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  if (recipient) lines.push(recipient);
  if (addr.phone) lines.push(addr.phone);
  if (addr.addressLine1) {
    lines.push(
      addr.addressLine2
        ? `${addr.addressLine1}, ${addr.addressLine2}`
        : addr.addressLine1,
    );
  }
  const region = [
    addr.district?.name,
    addr.city?.name,
    addr.state?.name,
    addr.country?.name,
  ]
    .filter(Boolean)
    .join(", ");
  const regionLine = addr.postalCode ? `${region} ${addr.postalCode}` : region;
  if (regionLine.trim()) lines.push(regionLine);
  return lines;
};

const isSameAddress = (
  a: IkasOrderAddress | null,
  b: IkasOrderAddress | null,
): boolean => {
  if (!a || !b) return false;
  return (
    a.firstName === b.firstName &&
    a.lastName === b.lastName &&
    a.addressLine1 === b.addressLine1 &&
    a.addressLine2 === b.addressLine2 &&
    a.postalCode === b.postalCode &&
    a.phone === b.phone &&
    a.city?.name === b.city?.name &&
    a.district?.name === b.district?.name &&
    a.state?.name === b.state?.name &&
    a.country?.name === b.country?.name
  );
};

const getVariantOptionText = (item: IkasOrderLineItem): string => {
  const options = item.options ?? [];
  return options
    .map((opt) => {
      const valueNames = (opt.values ?? [])
        .map((v) => v.name ?? v.value)
        .filter(Boolean)
        .join(", ");
      return valueNames ? `${opt.name}: ${valueNames}` : "";
    })
    .filter(Boolean)
    .join(" / ");
};

export function AccountOrderDetail({
  backgroundColor = "#FAF8F5",
  backLinkText = "Siparişlerime Dön",
  backLinkUrl = "/account/orders",
  pageTitlePrefix = "Sipariş",
  orderNumberLabel = "Sipariş No",
  orderDateLabel = "Tarih",
  orderStatusLabel: _orderStatusLabel = "Durum",
  lineItemsSectionTitle = "Sipariş Kalemleri",
  quantityLabel = "Adet",
  summarySectionTitle = "Sipariş Özeti",
  subtotalLabel = "Ara Toplam",
  shippingLabel = "Kargo",
  discountLabel: _discountLabel = "İndirim",
  taxLabel = "KDV",
  totalLabel = "Genel Toplam",
  freeShippingText = "Ücretsiz",
  shippingAddressTitle = "Teslimat Adresi",
  billingAddressTitle = "Fatura Adresi",
  sameAddressText = "Teslimat adresiyle aynı",
  paymentMethodTitle = "Ödeme Yöntemi",
  trackingTitle = "Kargo Takibi",
  trackingNumberLabel = "Takip No",
  trackingLinkText = "Kargonu Takip Et",
  noTrackingText = "Takip bilgisi henüz oluşturulmadı",
  sidebarNavAriaLabel = "Hesap navigasyonu",
  installmentLabel = "Taksit",
  returnSectionTitle = "İade Et",
  returnIntroText = "İade etmek istediğiniz ürünleri ve adetleri seçin.",
  returnStartButtonText = "İade Başlat",
  returnCancelButtonText = "Vazgeç",
  returnSubmitButtonText = "İade Talebi Gönder",
  returnSubmittingButtonText = "Gönderiliyor...",
  returnSuccessMessage = "İade talebiniz başarıyla alındı.",
  returnErrorMessage = "İade talebi gönderilemedi. Lütfen tekrar deneyin.",
  returnNoSelectionMessage = "Lütfen en az bir ürün seçin.",
  returnQuantityLabel = "İade Adedi",
  returnIncreaseAriaLabel = "Adedi artır",
  returnDecreaseAriaLabel = "Adedi azalt",
  refundedItemsSectionTitle = "İade İşlemindeki Kalemler",
  refundedItemStatusText = "İade işleniyor",
}: Props) {
  const [order, setOrder] = useState<IkasOrder | null | undefined>(undefined);
  const [returnExpanded, setReturnExpanded] = useState(false);
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState<
    { kind: "success" | "error"; text: string } | null
  >(null);
  // Force re-render after mutating observable refund quantities via the SDK.
  const [, setRefundRevision] = useState(0);
  const bumpRefund = () => setRefundRevision((r) => r + 1);
  const returnsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!returnExpanded) return;
    returnsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [returnExpanded]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await waitForCustomerStoreInit(customerStore);
        if (cancelled) return;
        const [result] = await Promise.all([
          getOrderDetailsOfPage(customerStore),
          getOrderRefundSettings(customerStore),
        ]);
        if (cancelled) return;
        setOrder(result ?? null);
      } catch {
        if (!cancelled) setOrder(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderMain = () => {
    if (order === undefined) {
      return (
        <div class="account-order-detail__skeleton" aria-hidden="true">
          <div class="account-order-detail__skeleton-header">
            <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--back" />
            <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--title" />
            <div class="account-order-detail__skeleton-meta">
              <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--meta" />
              <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--badge" />
              <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--meta" />
            </div>
          </div>

          <div class="account-order-detail__skeleton-section">
            <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--heading" />
            {[0, 1].map((i) => (
              <div key={i} class="account-order-detail__skeleton-line-item">
                <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--thumb" />
                <div class="account-order-detail__skeleton-line-text">
                  <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--text" />
                  <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--text-short" />
                </div>
                <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--price" />
              </div>
            ))}
          </div>

          <div class="account-order-detail__skeleton-section">
            <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--heading" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} class="account-order-detail__skeleton-summary-row">
                <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--text-short" />
                <span class="account-order-detail__skeleton-bar account-order-detail__skeleton-bar--price" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (order === null) {
      return (
        <div class="account-order-detail__empty">
          <p class="account-order-detail__empty-text">
            Sipariş bulunamadı veya görüntüleme yetkiniz yok.
          </p>
          <a class="account-order-detail__empty-cta" href={backLinkUrl}>
            {backLinkText}
          </a>
        </div>
      );
    }

    const formattedDate = getIkasOrderFormattedOrderedAt(order);
    const status = order.orderPackageStatus
      ? getIkasOrderPackageStatusTranslation(order)
      : "";
    const formattedSubtotal = getIkasOrderFormattedTotalPrice(order);
    const shippingTotal = getIkasOrderShippingTotal(order);
    const formattedShipping =
      shippingTotal > 0 ? getIkasOrderFormattedShippingTotal(order) : "";
    const totalTax = getIkasOrderTotalTax(order);
    const formattedTax = totalTax > 0 ? getIkasOrderFormattedTotalTax(order) : "";
    const formattedTotal = getIkasOrderFormattedTotalFinalPrice(order);
    const adjustments = getIkasOrderDisplayedAdjustments(order) ?? [];

    const shippingAddress = order.shippingAddress;
    const billingAddress = order.billingAddress;
    const billingSame = isSameAddress(shippingAddress, billingAddress);

    const paymentTransaction: IkasOrderTransaction | null =
      (order.transactions ?? []).find((tx) => !!tx.paymentMethod) ?? null;
    const paymentMethodText = paymentTransaction
      ? getOrderTransactionPaymentMethodTranslation(paymentTransaction)
      : "";
    const installmentCount =
      paymentTransaction?.paymentMethodDetail?.installment?.installmentCount ?? 0;
    const installmentText =
      installmentCount > 1 ? `${installmentCount} ${installmentLabel}` : "";
    const paymentDisplay = [paymentMethodText, installmentText]
      .filter(Boolean)
      .join(" • ");

    const trackingPackage = order.orderPackages?.find(
      (p) => p.trackingInfo?.trackingNumber,
    );
    const trackingInfo = trackingPackage?.trackingInfo ?? null;

    const lineItems = order.orderLineItems ?? [];

    const refundableItems = getIkasOrderRefundableItems(order);
    const refundedItems = getIkasOrderRefundedItems(order);
    // SDK note: `isIkasOrderRefundable` only flips to true after the user
    // sets a refund quantity. For *visibility*, gate on the eligibility list.
    const canStartReturn = refundableItems.length > 0;

    const clearRefundSelection = () => {
      refundableItems.forEach((item) => setOrderLineItemRefundQuantity(0, item));
      bumpRefund();
    };

    const handleStartReturn = () => {
      setReturnFeedback(null);
      setReturnExpanded(true);
    };

    const handleCancelReturn = () => {
      clearRefundSelection();
      setReturnFeedback(null);
      setReturnExpanded(false);
    };

    const handleQuantityChange = (item: IkasOrderLineItem, delta: number) => {
      const current = getOrderLineItemRefundQuantity(item) ?? 0;
      setOrderLineItemRefundQuantity(current + delta, item);
      bumpRefund();
    };

    const totalRefundQuantity = refundableItems.reduce(
      (sum, item) => sum + (getOrderLineItemRefundQuantity(item) ?? 0),
      0,
    );

    const handleSubmitReturn = async () => {
      if (returnSubmitting) return;
      if (totalRefundQuantity <= 0) {
        setReturnFeedback({ kind: "error", text: returnNoSelectionMessage });
        return;
      }
      setReturnSubmitting(true);
      setReturnFeedback(null);
      try {
        const ok = await refundOrder(customerStore, order);
        if (ok) {
          setReturnFeedback({ kind: "success", text: returnSuccessMessage });
          setReturnExpanded(false);
          clearRefundSelection();
        } else {
          setReturnFeedback({ kind: "error", text: returnErrorMessage });
        }
      } catch {
        setReturnFeedback({ kind: "error", text: returnErrorMessage });
      } finally {
        setReturnSubmitting(false);
      }
    };

    return (
      <>
        <a class="account-order-detail__back-link" href={backLinkUrl}>
          ← {backLinkText}
        </a>

        <header class="account-order-detail__header">
          <h1 class="account-order-detail__title">
            {pageTitlePrefix} #{order.orderNumber ?? "-"}
          </h1>
          {status || (canStartReturn && !returnExpanded) ? (
            <div class="account-order-detail__header-actions">
              {status ? (
                <span class="account-order-detail__badge">{status}</span>
              ) : null}
              {canStartReturn && !returnExpanded ? (
                <button
                  type="button"
                  class="account-order-detail__returns-cta"
                  onClick={handleStartReturn}
                >
                  {returnStartButtonText}
                </button>
              ) : null}
            </div>
          ) : null}
        </header>
        <div class="account-order-detail__meta">
          <span>
            {orderNumberLabel}: #{order.orderNumber ?? "-"}
          </span>
          {formattedDate ? (
            <span>
              {orderDateLabel}: {formattedDate}
            </span>
          ) : null}
        </div>
        <hr class="account-order-detail__divider" />

        {/* Block 1 — Line Items + Price Summary (unified table) */}
        <section
          class="account-order-detail__section"
          aria-label={lineItemsSectionTitle}
        >
          <h2 class="account-order-detail__section-title">
            {lineItemsSectionTitle}
          </h2>
          <ul class="account-order-detail__rows">
            {lineItems.map((item) => {
              const variant = item.variant;
              const image = variant
                ? getIkasOrderLineVariantMainImage(variant)
                : null;
              const imageSrc = image ? getDefaultSrc(image) : null;
              const optionText = getVariantOptionText(item);
              return (
                <li
                  key={item.id}
                  class="account-order-detail__row account-order-detail__row--item"
                >
                  <div class="account-order-detail__thumb">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={variant?.name ?? ""}
                        loading="lazy"
                      />
                    ) : (
                      <div class="account-order-detail__thumb-placeholder" />
                    )}
                  </div>
                  <div class="account-order-detail__line-info">
                    <span class="account-order-detail__line-name">
                      {variant?.name ?? ""}
                    </span>
                    {optionText ? (
                      <span class="account-order-detail__line-meta">
                        {optionText}
                      </span>
                    ) : null}
                    <span class="account-order-detail__line-meta">
                      {quantityLabel}: {item.quantity} ×{" "}
                      {getOrderLineItemFormattedFinalPrice(item)}
                    </span>
                  </div>
                  <div class="account-order-detail__row-value account-order-detail__row-value--item">
                    {getOrderLineItemFormattedFinalPriceWithQuantity(item)}
                  </div>
                </li>
              );
            })}

            <li class="account-order-detail__row account-order-detail__row--summary">
              <span class="account-order-detail__row-label">
                {subtotalLabel}
              </span>
              <span class="account-order-detail__row-value">
                {formattedSubtotal}
              </span>
            </li>
            <li class="account-order-detail__row account-order-detail__row--summary">
              <span class="account-order-detail__row-label">
                {shippingLabel}
              </span>
              <span class="account-order-detail__row-value">
                {formattedShipping || freeShippingText}
              </span>
            </li>
            {adjustments.map((adj) => {
              const isDiscount = getOrderAdjustmentIsDecrement(adj);
              return (
                <li
                  key={adj.name}
                  class="account-order-detail__row account-order-detail__row--summary"
                >
                  <span class="account-order-detail__row-label">
                    {getOrderAdjustmentDisplayName(adj)}
                  </span>
                  <span
                    class={
                      "account-order-detail__row-value" +
                      (isDiscount
                        ? " account-order-detail__row-value--discount"
                        : "")
                    }
                  >
                    {getOrderAdjustmentFormattedAmount(adj)}
                  </span>
                </li>
              );
            })}
            {formattedTax ? (
              <li class="account-order-detail__row account-order-detail__row--summary">
                <span class="account-order-detail__row-label">{taxLabel}</span>
                <span class="account-order-detail__row-value">
                  {formattedTax}
                </span>
              </li>
            ) : null}
            <li
              class="account-order-detail__row account-order-detail__row--total"
              aria-label={summarySectionTitle}
            >
              <span class="account-order-detail__row-label account-order-detail__row-label--total">
                {totalLabel}
              </span>
              <span class="account-order-detail__row-value account-order-detail__row-value--total">
                {formattedTotal}
              </span>
            </li>
          </ul>
        </section>

        {/* Block 2 — Return Flow */}
        {canStartReturn &&
        (returnExpanded || returnFeedback?.kind === "success") ? (
          <section
            ref={returnsSectionRef}
            class="account-order-detail__returns"
            aria-label={returnSectionTitle}
          >
            {returnExpanded ? (
              <>
                <h2 class="account-order-detail__section-title">
                  {returnSectionTitle}
                </h2>
                {returnIntroText ? (
                  <p class="account-order-detail__returns-intro">
                    {returnIntroText}
                  </p>
                ) : null}

                <ul class="account-order-detail__returns-list">
                  {refundableItems.map((item) => {
                    const variant = item.variant;
                    const image = variant
                      ? getIkasOrderLineVariantMainImage(variant)
                      : null;
                    const imageSrc = image ? getDefaultSrc(image) : null;
                    const optionText = getVariantOptionText(item);
                    const currentQty =
                      getOrderLineItemRefundQuantity(item) ?? 0;
                    const maxQty = item.quantity;
                    return (
                      <li
                        key={item.id}
                        class="account-order-detail__returns-item"
                      >
                        <div class="account-order-detail__thumb">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={variant?.name ?? ""}
                              loading="lazy"
                            />
                          ) : (
                            <div class="account-order-detail__thumb-placeholder" />
                          )}
                        </div>
                        <div class="account-order-detail__line-info">
                          <span class="account-order-detail__line-name">
                            {variant?.name ?? ""}
                          </span>
                          {optionText ? (
                            <span class="account-order-detail__line-meta">
                              {optionText}
                            </span>
                          ) : null}
                          <span class="account-order-detail__line-meta">
                            {quantityLabel}: {item.quantity} ×{" "}
                            {getOrderLineItemFormattedFinalPrice(item)}
                          </span>
                        </div>
                        <div
                          class="account-order-detail__qty-stepper"
                          role="group"
                          aria-label={returnQuantityLabel}
                        >
                          <button
                            type="button"
                            class="account-order-detail__qty-btn"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={currentQty <= 0 || returnSubmitting}
                            aria-label={returnDecreaseAriaLabel}
                          >
                            −
                          </button>
                          <span
                            class="account-order-detail__qty-value"
                            aria-live="polite"
                          >
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            class="account-order-detail__qty-btn"
                            onClick={() => handleQuantityChange(item, +1)}
                            disabled={currentQty >= maxQty || returnSubmitting}
                            aria-label={returnIncreaseAriaLabel}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {returnFeedback ? (
                  <p
                    class={
                      "account-order-detail__returns-feedback" +
                      (returnFeedback.kind === "error"
                        ? " account-order-detail__returns-feedback--error"
                        : " account-order-detail__returns-feedback--success")
                    }
                    role={
                      returnFeedback.kind === "error" ? "alert" : "status"
                    }
                    aria-live="polite"
                  >
                    {returnFeedback.text}
                  </p>
                ) : null}

                <div class="account-order-detail__returns-actions">
                  <button
                    type="button"
                    class="account-order-detail__returns-cancel"
                    onClick={handleCancelReturn}
                    disabled={returnSubmitting}
                  >
                    {returnCancelButtonText}
                  </button>
                  <button
                    type="button"
                    class="account-order-detail__returns-submit"
                    onClick={handleSubmitReturn}
                    disabled={returnSubmitting || totalRefundQuantity <= 0}
                  >
                    {returnSubmitting
                      ? returnSubmittingButtonText
                      : returnSubmitButtonText}
                  </button>
                </div>
              </>
            ) : (
              <p
                class="account-order-detail__returns-feedback account-order-detail__returns-feedback--success"
                role="status"
                aria-live="polite"
              >
                {returnFeedback?.text}
              </p>
            )}
          </section>
        ) : null}

        {/* Block 2b — Already-refunded items */}
        {refundedItems.length > 0 ? (
          <section
            class="account-order-detail__refunded"
            aria-label={refundedItemsSectionTitle}
          >
            <h2 class="account-order-detail__section-title">
              {refundedItemsSectionTitle}
            </h2>
            <ul class="account-order-detail__refunded-list">
              {refundedItems.map((item) => {
                const variant = item.variant;
                const image = variant
                  ? getIkasOrderLineVariantMainImage(variant)
                  : null;
                const imageSrc = image ? getDefaultSrc(image) : null;
                const optionText = getVariantOptionText(item);
                return (
                  <li
                    key={item.id}
                    class="account-order-detail__refunded-item"
                  >
                    <div class="account-order-detail__thumb">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={variant?.name ?? ""}
                          loading="lazy"
                        />
                      ) : (
                        <div class="account-order-detail__thumb-placeholder" />
                      )}
                    </div>
                    <div class="account-order-detail__line-info">
                      <span class="account-order-detail__line-name">
                        {variant?.name ?? ""}
                      </span>
                      {optionText ? (
                        <span class="account-order-detail__line-meta">
                          {optionText}
                        </span>
                      ) : null}
                      <span class="account-order-detail__line-meta">
                        {quantityLabel}: {item.quantity}
                      </span>
                    </div>
                    <span class="account-order-detail__refunded-badge">
                      {refundedItemStatusText}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {/* Block 3 — Addresses */}
        <div class="account-order-detail__addresses">
          {shippingAddress ? (
            <section class="account-order-detail__address">
              <h2 class="account-order-detail__address-title">
                {shippingAddressTitle}
              </h2>
              {formatAddressLines(shippingAddress).map((line, i) => (
                <span key={i} class="account-order-detail__address-line">
                  {line}
                </span>
              ))}
            </section>
          ) : null}
          {billingAddress ? (
            <section class="account-order-detail__address">
              <h2 class="account-order-detail__address-title">
                {billingAddressTitle}
              </h2>
              {billingSame ? (
                <p class="account-order-detail__address-same">
                  {sameAddressText}
                </p>
              ) : (
                formatAddressLines(billingAddress).map((line, i) => (
                  <span key={i} class="account-order-detail__address-line">
                    {line}
                  </span>
                ))
              )}
            </section>
          ) : null}
        </div>

        {/* Block 4 — Payment Method */}
        {paymentDisplay ? (
          <section class="account-order-detail__payment">
            <h2 class="account-order-detail__minor-title">
              {paymentMethodTitle}
            </h2>
            <p class="account-order-detail__payment-label">{paymentDisplay}</p>
          </section>
        ) : null}

        {/* Block 5 — Tracking */}
        <section class="account-order-detail__tracking">
          <h2 class="account-order-detail__minor-title">{trackingTitle}</h2>
          {trackingInfo?.trackingNumber ? (
            <>
              <p class="account-order-detail__tracking-number">
                {trackingNumberLabel}: {trackingInfo.trackingNumber}
              </p>
              {trackingInfo.trackingLink ? (
                <a
                  class="account-order-detail__tracking-link"
                  href={trackingInfo.trackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${trackingLinkText} (yeni sekmede açılır)`}
                >
                  {trackingLinkText}
                </a>
              ) : null}
            </>
          ) : (
            <p class="account-order-detail__tracking-empty">
              {noTrackingText}
            </p>
          )}
        </section>
      </>
    );
  };

  return (
    <section
      class="account-order-detail"
      // Inline `visibility: hidden` prevents the cold-load FOUC; the
      // component's CSS flips it back via !important once the chunk loads.
      // `minHeight: 100vh` reserves space so the footer doesn't jump.
      style={{
        visibility: "hidden",
        minHeight: "100vh",
        ...(backgroundColor ? { backgroundColor } : null),
      }}
    >
      <div class="account-order-detail__container">
        <div class="account-order-detail__layout">
          <AccountSidebar activeKey="orders" navAriaLabel={sidebarNavAriaLabel} />
          <div class="account-order-detail__main">{renderMain()}</div>
        </div>
      </div>
    </section>
  );
}

export default AccountOrderDetail;

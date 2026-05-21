import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getOrderTrackingForm,
  initOrderTrackingForm,
  setOrderTrackingFormEmail,
  setOrderTrackingFormOrderNumber,
  submitOrderTrackingForm,
  clearOrderTrackingForm,
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
  IkasOrder,
  IkasOrderAddress,
  IkasOrderLineItem,
  IkasOrderTransaction,
} from "@ikas/bp-storefront";
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

export function GuestOrderTracking({
  backgroundColor = "#FAF8F5",
  heading = "Sipariş Sorgulama",
  showSubtext = true,
  subtext = "Sipariş bilgilerinizi görüntülemek için e-posta adresinizi ve sipariş numaranızı girin.",
  emailLabel = "E-posta",
  emailPlaceholder = "ornek@email.com",
  orderNumberLabel = "Sipariş No",
  orderNumberPlaceholder = "Ör. 1234",
  submitButtonText = "Siparişi Sorgula",
  submittingButtonText = "Sorgulanıyor...",
  orderDateLabel = "Tarih",
  lineItemsSectionTitle = "Sipariş Kalemleri",
  quantityLabel = "Adet",
  subtotalLabel = "Ara Toplam",
  shippingLabel = "Kargo",
  taxLabel = "KDV",
  totalLabel = "Genel Toplam",
  freeShippingText = "Ücretsiz",
  shippingAddressTitle = "Teslimat Adresi",
  billingAddressTitle = "Fatura Adresi",
  sameAddressText = "Teslimat adresiyle aynı",
  paymentMethodTitle = "Ödeme Yöntemi",
  installmentLabel = "Taksit",
  trackingTitle = "Kargo Takibi",
  trackingNumberLabel = "Takip No",
  trackingLinkText = "Kargonu Takip Et",
  noTrackingText = "Takip bilgisi henüz oluşturulmadı",
  newSearchText = "Yeni Sorgu",
  notFoundMessage = "Sipariş bulunamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
  genericErrorMessage = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.",
}: Props) {
  const form = getOrderTrackingForm(customerStore);

  useEffect(() => {
    initOrderTrackingForm(form);
  }, []);

  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<IkasOrder | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [orderNumberError, setOrderNumberError] = useState<string | null>(null);

  const formErrorId = "guest-order-tracking-form-error";
  const emailErrorId = "guest-order-tracking-email-error";
  const orderNumberErrorId = "guest-order-tracking-order-number-error";

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setEmailError(null);
    setOrderNumberError(null);
    setIsSubmitting(true);

    try {
      setOrderTrackingFormEmail(form, email);
      setOrderTrackingFormOrderNumber(form, orderNumber);
      const result = await submitOrderTrackingForm(form);
      if (result) {
        setOrder(result);
        return;
      }
      const emailMsg = form.email?.hasError ? form.email?.message : null;
      const orderNumberMsg = form.orderNumber?.hasError
        ? form.orderNumber?.message
        : null;
      if (emailMsg || orderNumberMsg) {
        setEmailError(emailMsg ?? null);
        setOrderNumberError(orderNumberMsg ?? null);
        return;
      }
      setFormError(form.responseMessage || notFoundMessage);
    } catch {
      setFormError(genericErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSearch = () => {
    clearOrderTrackingForm(customerStore);
    setEmail("");
    setOrderNumber("");
    setOrder(null);
    setFormError(null);
    setEmailError(null);
    setOrderNumberError(null);
  };

  const renderForm = () => (
    <>
      <h1 class="guest-order-tracking__heading">{heading}</h1>
      {showSubtext && subtext ? (
        <p class="guest-order-tracking__subtext">{subtext}</p>
      ) : null}

      <form
        class="guest-order-tracking__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div class="guest-order-tracking__field">
          <label
            class="guest-order-tracking__label"
            htmlFor="guest-order-tracking-email"
          >
            {emailLabel}
          </label>
          <input
            id="guest-order-tracking-email"
            class="guest-order-tracking__input"
            type="email"
            autocomplete="email"
            placeholder={emailPlaceholder}
            value={email}
            onInput={(e) =>
              setEmail((e.currentTarget as HTMLInputElement).value)
            }
            aria-invalid={emailError ? "true" : undefined}
            aria-describedby={emailError ? emailErrorId : undefined}
            disabled={isSubmitting}
            required
          />
          {emailError ? (
            <p
              id={emailErrorId}
              class="guest-order-tracking__field-error"
              role="alert"
            >
              {emailError}
            </p>
          ) : null}
        </div>

        <div class="guest-order-tracking__field">
          <label
            class="guest-order-tracking__label"
            htmlFor="guest-order-tracking-order-number"
          >
            {orderNumberLabel}
          </label>
          <input
            id="guest-order-tracking-order-number"
            class="guest-order-tracking__input"
            type="text"
            inputMode="numeric"
            autocomplete="off"
            placeholder={orderNumberPlaceholder}
            value={orderNumber}
            onInput={(e) =>
              setOrderNumber((e.currentTarget as HTMLInputElement).value)
            }
            aria-invalid={orderNumberError ? "true" : undefined}
            aria-describedby={
              orderNumberError ? orderNumberErrorId : undefined
            }
            disabled={isSubmitting}
            required
          />
          {orderNumberError ? (
            <p
              id={orderNumberErrorId}
              class="guest-order-tracking__field-error"
              role="alert"
            >
              {orderNumberError}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p
            id={formErrorId}
            class="guest-order-tracking__error"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          class="guest-order-tracking__submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting ? "true" : undefined}
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </form>
    </>
  );

  const renderOrderResult = (orderData: IkasOrder) => {
    const formattedDate = getIkasOrderFormattedOrderedAt(orderData);
    const status = orderData.orderPackageStatus
      ? getIkasOrderPackageStatusTranslation(orderData)
      : "";
    const formattedSubtotal = getIkasOrderFormattedTotalPrice(orderData);
    const shippingTotal = getIkasOrderShippingTotal(orderData);
    const formattedShipping =
      shippingTotal > 0 ? getIkasOrderFormattedShippingTotal(orderData) : "";
    const totalTax = getIkasOrderTotalTax(orderData);
    const formattedTax =
      totalTax > 0 ? getIkasOrderFormattedTotalTax(orderData) : "";
    const formattedTotal = getIkasOrderFormattedTotalFinalPrice(orderData);
    const adjustments = getIkasOrderDisplayedAdjustments(orderData) ?? [];

    const shippingAddress = orderData.shippingAddress;
    const billingAddress = orderData.billingAddress;
    const billingSame = isSameAddress(shippingAddress, billingAddress);

    const paymentTransaction: IkasOrderTransaction | null =
      (orderData.transactions ?? []).find((tx) => !!tx.paymentMethod) ?? null;
    const paymentMethodText = paymentTransaction
      ? getOrderTransactionPaymentMethodTranslation(paymentTransaction)
      : "";
    const installmentCount =
      paymentTransaction?.paymentMethodDetail?.installment?.installmentCount ??
      0;
    const installmentText =
      installmentCount > 1 ? `${installmentCount} ${installmentLabel}` : "";
    const paymentDisplay = [paymentMethodText, installmentText]
      .filter(Boolean)
      .join(" • ");

    const trackingPackage = orderData.orderPackages?.find(
      (p) => p.trackingInfo?.trackingNumber,
    );
    const trackingInfo = trackingPackage?.trackingInfo ?? null;

    const lineItems = orderData.orderLineItems ?? [];

    return (
      <div class="guest-order-tracking__result">
        <header class="guest-order-tracking__result-header">
          <h1 class="guest-order-tracking__result-title">
            {heading} #{orderData.orderNumber ?? "-"}
          </h1>
          {status ? (
            <span class="guest-order-tracking__badge">{status}</span>
          ) : null}
        </header>
        <div class="guest-order-tracking__meta">
          <span>
            {orderNumberLabel}: #{orderData.orderNumber ?? "-"}
          </span>
          {formattedDate ? (
            <span>
              {orderDateLabel}: {formattedDate}
            </span>
          ) : null}
        </div>
        <hr class="guest-order-tracking__divider" />

        <section
          class="guest-order-tracking__section"
          aria-label={lineItemsSectionTitle}
        >
          <h2 class="guest-order-tracking__section-title">
            {lineItemsSectionTitle}
          </h2>
          <ul class="guest-order-tracking__rows">
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
                  class="guest-order-tracking__row guest-order-tracking__row--item"
                >
                  <div class="guest-order-tracking__thumb">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={variant?.name ?? ""}
                        loading="lazy"
                      />
                    ) : (
                      <div class="guest-order-tracking__thumb-placeholder" />
                    )}
                  </div>
                  <div class="guest-order-tracking__line-info">
                    <span class="guest-order-tracking__line-name">
                      {variant?.name ?? ""}
                    </span>
                    {optionText ? (
                      <span class="guest-order-tracking__line-meta">
                        {optionText}
                      </span>
                    ) : null}
                    <span class="guest-order-tracking__line-meta">
                      {quantityLabel}: {item.quantity} ×{" "}
                      {getOrderLineItemFormattedFinalPrice(item)}
                    </span>
                  </div>
                  <div class="guest-order-tracking__row-value guest-order-tracking__row-value--item">
                    {getOrderLineItemFormattedFinalPriceWithQuantity(item)}
                  </div>
                </li>
              );
            })}

            <li class="guest-order-tracking__row guest-order-tracking__row--summary">
              <span class="guest-order-tracking__row-label">
                {subtotalLabel}
              </span>
              <span class="guest-order-tracking__row-value">
                {formattedSubtotal}
              </span>
            </li>
            <li class="guest-order-tracking__row guest-order-tracking__row--summary">
              <span class="guest-order-tracking__row-label">
                {shippingLabel}
              </span>
              <span class="guest-order-tracking__row-value">
                {formattedShipping || freeShippingText}
              </span>
            </li>
            {adjustments.map((adj) => {
              const isDiscount = getOrderAdjustmentIsDecrement(adj);
              return (
                <li
                  key={adj.name}
                  class="guest-order-tracking__row guest-order-tracking__row--summary"
                >
                  <span class="guest-order-tracking__row-label">
                    {getOrderAdjustmentDisplayName(adj)}
                  </span>
                  <span
                    class={
                      "guest-order-tracking__row-value" +
                      (isDiscount
                        ? " guest-order-tracking__row-value--discount"
                        : "")
                    }
                  >
                    {getOrderAdjustmentFormattedAmount(adj)}
                  </span>
                </li>
              );
            })}
            {formattedTax ? (
              <li class="guest-order-tracking__row guest-order-tracking__row--summary">
                <span class="guest-order-tracking__row-label">{taxLabel}</span>
                <span class="guest-order-tracking__row-value">
                  {formattedTax}
                </span>
              </li>
            ) : null}
            <li class="guest-order-tracking__row guest-order-tracking__row--total">
              <span class="guest-order-tracking__row-label guest-order-tracking__row-label--total">
                {totalLabel}
              </span>
              <span class="guest-order-tracking__row-value guest-order-tracking__row-value--total">
                {formattedTotal}
              </span>
            </li>
          </ul>
        </section>

        <div class="guest-order-tracking__addresses">
          {shippingAddress ? (
            <section class="guest-order-tracking__address">
              <h2 class="guest-order-tracking__address-title">
                {shippingAddressTitle}
              </h2>
              {formatAddressLines(shippingAddress).map((line, i) => (
                <span key={i} class="guest-order-tracking__address-line">
                  {line}
                </span>
              ))}
            </section>
          ) : null}
          {billingAddress ? (
            <section class="guest-order-tracking__address">
              <h2 class="guest-order-tracking__address-title">
                {billingAddressTitle}
              </h2>
              {billingSame ? (
                <p class="guest-order-tracking__address-same">
                  {sameAddressText}
                </p>
              ) : (
                formatAddressLines(billingAddress).map((line, i) => (
                  <span key={i} class="guest-order-tracking__address-line">
                    {line}
                  </span>
                ))
              )}
            </section>
          ) : null}
        </div>

        {paymentDisplay ? (
          <section class="guest-order-tracking__payment">
            <h2 class="guest-order-tracking__minor-title">
              {paymentMethodTitle}
            </h2>
            <p class="guest-order-tracking__payment-label">{paymentDisplay}</p>
          </section>
        ) : null}

        <section class="guest-order-tracking__tracking">
          <h2 class="guest-order-tracking__minor-title">{trackingTitle}</h2>
          {trackingInfo?.trackingNumber ? (
            <>
              <p class="guest-order-tracking__tracking-number">
                {trackingNumberLabel}: {trackingInfo.trackingNumber}
              </p>
              {trackingInfo.trackingLink ? (
                <a
                  class="guest-order-tracking__tracking-link"
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
            <p class="guest-order-tracking__tracking-empty">{noTrackingText}</p>
          )}
        </section>

        <button
          type="button"
          class="guest-order-tracking__new-search"
          onClick={handleNewSearch}
        >
          {newSearchText}
        </button>
      </div>
    );
  };

  return (
    <section
      class={
        "guest-order-tracking" +
        (order ? " guest-order-tracking--result" : "")
      }
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="guest-order-tracking__inner">
        {order ? renderOrderResult(order) : renderForm()}
      </div>
    </section>
  );
}

export default GuestOrderTracking;

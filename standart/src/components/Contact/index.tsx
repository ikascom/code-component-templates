import { useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  getContactForm,
  initContactForm,
  setContactFormFirstName,
  setContactFormLastName,
  setContactFormEmail,
  setContactFormPhone,
  setContactFormMessage,
  submitContactForm,
  clearContactForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function Contact({
  backgroundColor = "#FFFFFF",
  eyebrow = "İLETİŞİM",
  title = "Bize Ulaşın",
  subtitle = "Sorularınızı, geri bildirimlerinizi ve sipariş taleplerinizi bekliyoruz. Ekibimiz iş günleri içinde 24 saat içinde size dönüş yapar.",
  showAddress = true,
  addressLabel = "Adres",
  addressValue = "Atatürk Cad. No: 25, Şişli / İstanbul",
  phoneLabel = "Telefon",
  phoneValue = "+90 212 000 00 00",
  emailContactLabel = "E-posta",
  emailContactValue = "merhaba@conpaen.com",
  hoursLabel = "Çalışma Saatleri",
  hoursValue = "Pazartesi – Cuma · 09:00 – 18:00",
  firstNameLabel = "Ad",
  firstNamePlaceholder = "Adınız",
  lastNameLabel = "Soyad",
  lastNamePlaceholder = "Soyadınız",
  emailFieldLabel = "E-posta",
  emailFieldPlaceholder = "ornek@email.com",
  showPhoneField = true,
  phoneFieldLabel = "Telefon (opsiyonel)",
  phoneFieldPlaceholder = "+90 5xx xxx xx xx",
  messageLabel = "Mesajınız",
  messagePlaceholder = "Size nasıl yardımcı olabiliriz?",
  requiredNote = "* Zorunlu alanlar",
  submitButtonText = "Mesaj Gönder",
  submittingButtonText = "Gönderiliyor...",
  successTitle = "Mesajınız iletildi",
  successMessage = "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacak.",
  resetButtonText = "Yeni mesaj gönder",
  errorMessage = "Mesajınız gönderilemedi. Lütfen tekrar deneyin.",
}: Props) {
  const form = getContactForm(customerStore);
  const [resetTick, setResetTick] = useState(0);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    initContactForm(form);
  }, [resetTick]);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (form.isSubmitting) return;
    await submitContactForm(form);
  };

  const handleReset = () => {
    clearContactForm(customerStore);
    setResetTick((n) => n + 1);
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  const submitFailed = form.isSubmitted && form.isFailure;
  const submitError = submitFailed
    ? form.responseMessage || errorMessage
    : null;
  const errorId = "contact-form-error";

  return (
    <section
      class="contact-section"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="contact-section__inner">
        <header class="contact-section__header">
          {eyebrow ? (
            <span class="contact-section__eyebrow">{eyebrow}</span>
          ) : null}
          <h1 class="contact-section__title">{title}</h1>
          {subtitle ? (
            <p class="contact-section__subtitle">{subtitle}</p>
          ) : null}
        </header>

        <div
          class={
            "contact-section__grid" +
            (showAddress ? "" : " contact-section__grid--single")
          }
        >
          {showAddress ? (
            <aside class="contact-section__info">
              {addressValue ? (
                <div class="contact-section__info-row">
                  <span class="contact-section__info-label">
                    {addressLabel}
                  </span>
                  <span class="contact-section__info-value">
                    {addressValue}
                  </span>
                </div>
              ) : null}
              {phoneValue ? (
                <div class="contact-section__info-row">
                  <span class="contact-section__info-label">{phoneLabel}</span>
                  <a
                    class="contact-section__info-link"
                    href={`tel:${phoneValue.replace(/\s+/g, "")}`}
                  >
                    {phoneValue}
                  </a>
                </div>
              ) : null}
              {emailContactValue ? (
                <div class="contact-section__info-row">
                  <span class="contact-section__info-label">
                    {emailContactLabel}
                  </span>
                  <a
                    class="contact-section__info-link"
                    href={`mailto:${emailContactValue}`}
                  >
                    {emailContactValue}
                  </a>
                </div>
              ) : null}
              {hoursValue ? (
                <div class="contact-section__info-row">
                  <span class="contact-section__info-label">{hoursLabel}</span>
                  <span class="contact-section__info-value">{hoursValue}</span>
                </div>
              ) : null}
            </aside>
          ) : null}

          <div class="contact-section__form-wrap">
            {form.isSuccess ? (
              <div
                class="contact-section__success"
                role="status"
                aria-live="polite"
              >
                <h2 class="contact-section__success-title">{successTitle}</h2>
                <p class="contact-section__success-message">{successMessage}</p>
                <button
                  type="button"
                  class="contact-section__reset"
                  onClick={handleReset}
                >
                  {resetButtonText}
                </button>
              </div>
            ) : (
              <form
                class="contact-section__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div class="contact-section__row">
                  <div class="contact-section__field">
                    <label
                      class="contact-section__label"
                      htmlFor="contact-first-name"
                    >
                      {firstNameLabel}
                    </label>
                    <input
                      id="contact-first-name"
                      ref={firstFieldRef}
                      class="contact-section__input"
                      type="text"
                      autocomplete="given-name"
                      placeholder={firstNamePlaceholder}
                      value={form.firstName.value}
                      onInput={(e) =>
                        setContactFormFirstName(
                          form,
                          (e.currentTarget as HTMLInputElement).value
                        )
                      }
                      aria-invalid={
                        form.firstName.hasError ? "true" : undefined
                      }
                      disabled={form.isSubmitting}
                      required
                    />
                    {form.firstName.hasError && form.firstName.message ? (
                      <span class="contact-section__field-error">
                        {form.firstName.message}
                      </span>
                    ) : null}
                  </div>

                  <div class="contact-section__field">
                    <label
                      class="contact-section__label"
                      htmlFor="contact-last-name"
                    >
                      {lastNameLabel}
                    </label>
                    <input
                      id="contact-last-name"
                      class="contact-section__input"
                      type="text"
                      autocomplete="family-name"
                      placeholder={lastNamePlaceholder}
                      value={form.lastName.value}
                      onInput={(e) =>
                        setContactFormLastName(
                          form,
                          (e.currentTarget as HTMLInputElement).value
                        )
                      }
                      aria-invalid={form.lastName.hasError ? "true" : undefined}
                      disabled={form.isSubmitting}
                      required
                    />
                    {form.lastName.hasError && form.lastName.message ? (
                      <span class="contact-section__field-error">
                        {form.lastName.message}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div class="contact-section__field">
                  <label
                    class="contact-section__label"
                    htmlFor="contact-email"
                  >
                    {emailFieldLabel}
                  </label>
                  <input
                    id="contact-email"
                    class="contact-section__input"
                    type="email"
                    autocomplete="email"
                    placeholder={emailFieldPlaceholder}
                    value={form.email.value}
                    onInput={(e) =>
                      setContactFormEmail(
                        form,
                        (e.currentTarget as HTMLInputElement).value
                      )
                    }
                    aria-invalid={form.email.hasError ? "true" : undefined}
                    disabled={form.isSubmitting}
                    required
                  />
                  {form.email.hasError && form.email.message ? (
                    <span class="contact-section__field-error">
                      {form.email.message}
                    </span>
                  ) : null}
                </div>

                {showPhoneField ? (
                  <div class="contact-section__field">
                    <label
                      class="contact-section__label"
                      htmlFor="contact-phone"
                    >
                      {phoneFieldLabel}
                    </label>
                    <input
                      id="contact-phone"
                      class="contact-section__input"
                      type="tel"
                      autocomplete="tel"
                      placeholder={phoneFieldPlaceholder}
                      value={form.phone.value}
                      onInput={(e) =>
                        setContactFormPhone(
                          form,
                          (e.currentTarget as HTMLInputElement).value
                        )
                      }
                      aria-invalid={form.phone.hasError ? "true" : undefined}
                      disabled={form.isSubmitting}
                    />
                    {form.phone.hasError && form.phone.message ? (
                      <span class="contact-section__field-error">
                        {form.phone.message}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div class="contact-section__field">
                  <label
                    class="contact-section__label"
                    htmlFor="contact-message"
                  >
                    {messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    class="contact-section__input contact-section__textarea"
                    placeholder={messagePlaceholder}
                    rows={5}
                    value={form.message.value}
                    onInput={(e) =>
                      setContactFormMessage(
                        form,
                        (e.currentTarget as HTMLTextAreaElement).value
                      )
                    }
                    aria-invalid={form.message.hasError ? "true" : undefined}
                    disabled={form.isSubmitting}
                    required
                  />
                  {form.message.hasError && form.message.message ? (
                    <span class="contact-section__field-error">
                      {form.message.message}
                    </span>
                  ) : null}
                </div>

                {requiredNote ? (
                  <p class="contact-section__note">{requiredNote}</p>
                ) : null}

                {submitError ? (
                  <p
                    id={errorId}
                    class="contact-section__error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  class="contact-section__submit"
                  disabled={form.isSubmitting}
                  aria-busy={form.isSubmitting ? "true" : undefined}
                  aria-describedby={submitError ? errorId : undefined}
                >
                  {form.isSubmitting ? submittingButtonText : submitButtonText}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

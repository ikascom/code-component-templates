import { useEffect, useState } from "preact/hooks";
import {
  Router,
  createMediaSrcset,
  customerStore,
  getDefaultSrc,
  getRegisterForm,
  initRegisterForm,
  setRegisterFormEmail,
  setRegisterFormFirstName,
  setRegisterFormLastName,
  setRegisterFormPassword,
  setRegisterFormPhone,
  setRegisterFormIsMarketingAccepted,
  setRegisterFormIsMembershipAgreementAccepted,
  submitRegisterForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import ConsentModal from "../../sub-components/ConsentModal";

type ConsentKey = "agreement" | "marketing";

const PHONE_REGEX =
  /^(\+90\d{10}|(?!\+90)\+\d{11,14}|(?!\+?\d11,14})\d{10,14})$/;

const normalizePhone = (raw: string) => raw.replace(/[\s\-().]/g, "");

export function Register({
  backgroundColor = "#FAF8F5",
  promoImage,
  promoImageOverlay = true,
  promoHeading = "İlk Alışverişinizde %10 İndirim",
  promoText = "Üye olun, özel fırsatlar ve kampanyalardan ilk siz haberdar olun.",
  showAdvantages = true,
  advantage1Text = "Ücretsiz kargo fırsatları",
  advantage2Text = "Erken erişim kampanyaları",
  advantage3Text = "Özel üye indirimleri",
  heading = "Üye Ol",
  firstNameLabel = "Ad",
  firstNamePlaceholder = "Adınız",
  lastNameLabel = "Soyad",
  lastNamePlaceholder = "Soyadınız",
  emailLabel = "E-posta",
  emailPlaceholder = "ornek@email.com",
  showPhone = true,
  phoneRequired = false,
  phoneLabel = "Telefon",
  phonePlaceholder = "5XX XXX XX XX",
  phoneCountryCodeDefault = "+90",
  phoneCountryCodeAriaLabel = "Ülke kodu",
  phoneRequiredErrorText = "Telefon numarası gereklidir.",
  phoneInvalidErrorText = "Geçerli bir telefon numarası giriniz.",
  passwordLabel = "Şifre",
  passwordPlaceholder = "En az 8 karakter",
  submitButtonText = "Hesap Oluştur",
  submittingButtonText = "Hesap oluşturuluyor...",
  loginPromptText = "Zaten üye misiniz?",
  loginLinkText = "Giriş yapın",
  loginUrl,
  marketingConsentText = "<p>Kampanya ve fırsatlardan e-posta ile haberdar olmak istiyorum.</p>",
  agreementConsentText = "<p>Üyelik sözleşmesini okudum ve kabul ediyorum.</p>",
  agreementContent = "<p>Üyelik sözleşmesi içeriğini buraya ekleyin.</p>",
  agreementModalTitle = "Üyelik Sözleşmesi",
  marketingContent = "<p>Pazarlama izni metnini buraya ekleyin.</p>",
  marketingModalTitle = "Pazarlama İzni",
  closeConsentAriaLabel = "Kapat",
}: Props) {
  const loginHref =
    typeof loginUrl?.href === "string" && loginUrl.href.trim()
      ? loginUrl.href
      : "/login";
  const loginOpensInNewTab = !!loginUrl?.openInNewTab;
  const form = getRegisterForm(customerStore);

  const [openConsent, setOpenConsent] = useState<ConsentKey | null>(null);
  const [phoneCountry, setPhoneCountry] = useState(phoneCountryCodeDefault);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    initRegisterForm(form);
  }, []);

  const updatePhone = (country: string, number: string) => {
    setPhoneCountry(country);
    setPhoneNumber(number);
    const value: string | null = number.trim()
      ? normalizePhone(country + number)
      : null;
    setRegisterFormPhone(form, value as unknown as string);
    if (phoneError) setPhoneError(null);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (form.isSubmitting) return;

    if (showPhone) {
      const trimmedNumber = phoneNumber.trim();
      if (!trimmedNumber) {
        if (phoneRequired) {
          setPhoneError(phoneRequiredErrorText);
          return;
        }
      } else {
        const normalized = normalizePhone(phoneCountry + phoneNumber);
        if (!PHONE_REGEX.test(normalized)) {
          setPhoneError(phoneInvalidErrorText);
          return;
        }
      }
    }
    setPhoneError(null);

    const success = await submitRegisterForm(form);
    if (success) {
      Router.navigateToPage("ACCOUNT");
    }
  };

  const fieldError =
    form.firstName?.message ||
    form.lastName?.message ||
    form.email?.message ||
    form.phone?.message ||
    form.password?.message ||
    form.isMembershipAgreementAccepted?.message ||
    form.isMarketingAccepted?.message ||
    null;

  const responseError =
    form.isFailure && form.responseMessage ? form.responseMessage : null;

  const error = phoneError || responseError || fieldError;
  const errorId = "register-form-error";
  const describedBy = error ? errorId : undefined;
  const invalidAttr = error ? "true" : undefined;

  const advantages = showAdvantages
    ? [advantage1Text, advantage2Text, advantage3Text].filter(
        (text): text is string => !!text,
      )
    : [];

  const isMarketingAccepted = form.isMarketingAccepted?.value ?? false;
  const isAgreementAccepted = form.isMembershipAgreementAccepted?.value ?? false;
  const agreementHasError = !!form.isMembershipAgreementAccepted?.hasError;

  const activeModal =
    openConsent === "agreement"
      ? { title: agreementModalTitle, content: agreementContent }
      : openConsent === "marketing"
        ? { title: marketingModalTitle, content: marketingContent }
        : null;

  return (
    <section
      class="register-section"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="register-section__split">
        <aside
          class="register-section__promo"
          data-overlay={promoImageOverlay ? "true" : "false"}
        >
          {promoImage ? (
            <img
              class="register-section__promo-image"
              src={getDefaultSrc(promoImage)}
              srcSet={createMediaSrcset(promoImage)}
              sizes="60vw"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div class="register-section__promo-content">
            <h2 class="register-section__promo-heading">{promoHeading}</h2>
            <p
              class="register-section__promo-text"
              data-with-advantages={advantages.length > 0 ? "true" : "false"}
            >
              {promoText}
            </p>
            {advantages.length > 0 && (
              <ul class="register-section__advantages">
                {advantages.map((text) => (
                  <li class="register-section__advantage">
                    <Checkmark />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div class="register-section__form-wrap">
          <div class="register-section__form-inner">
            <h1 class="register-section__heading">{heading}</h1>
            <form
              class="register-section__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div class="register-section__name-row">
                <div class="register-section__field">
                  <label
                    class="register-section__label"
                    htmlFor="register-firstName"
                  >
                    {firstNameLabel}
                  </label>
                  <input
                    id="register-firstName"
                    class="register-section__input"
                    type="text"
                    autocomplete="given-name"
                    placeholder={firstNamePlaceholder}
                    value={form.firstName?.value ?? ""}
                    onInput={(e) =>
                      setRegisterFormFirstName(
                        form,
                        (e.currentTarget as HTMLInputElement).value,
                      )
                    }
                    aria-invalid={invalidAttr}
                    aria-describedby={describedBy}
                    disabled={form.isSubmitting}
                    required
                  />
                </div>
                <div class="register-section__field">
                  <label
                    class="register-section__label"
                    htmlFor="register-lastName"
                  >
                    {lastNameLabel}
                  </label>
                  <input
                    id="register-lastName"
                    class="register-section__input"
                    type="text"
                    autocomplete="family-name"
                    placeholder={lastNamePlaceholder}
                    value={form.lastName?.value ?? ""}
                    onInput={(e) =>
                      setRegisterFormLastName(
                        form,
                        (e.currentTarget as HTMLInputElement).value,
                      )
                    }
                    aria-invalid={invalidAttr}
                    aria-describedby={describedBy}
                    disabled={form.isSubmitting}
                    required
                  />
                </div>
              </div>

              <div class="register-section__field">
                <label
                  class="register-section__label"
                  htmlFor="register-email"
                >
                  {emailLabel}
                </label>
                <input
                  id="register-email"
                  class="register-section__input"
                  type="email"
                  autocomplete="email"
                  placeholder={emailPlaceholder}
                  value={form.email?.value ?? ""}
                  onInput={(e) =>
                    setRegisterFormEmail(
                      form,
                      (e.currentTarget as HTMLInputElement).value,
                    )
                  }
                  aria-invalid={invalidAttr}
                  aria-describedby={describedBy}
                  disabled={form.isSubmitting}
                  required
                />
              </div>

              {showPhone && (
                <div class="register-section__field">
                  <label
                    class="register-section__label"
                    htmlFor="register-phone"
                  >
                    {phoneLabel}
                  </label>
                  <div class="register-section__phone-group">
                    <input
                      class="register-section__phone-country"
                      type="text"
                      autocomplete="tel-country-code"
                      inputMode="tel"
                      aria-label={phoneCountryCodeAriaLabel}
                      value={phoneCountry}
                      onInput={(e) =>
                        updatePhone(
                          (e.currentTarget as HTMLInputElement).value,
                          phoneNumber,
                        )
                      }
                      disabled={form.isSubmitting}
                    />
                    <input
                      id="register-phone"
                      class="register-section__phone-number"
                      type="tel"
                      autocomplete="tel-national"
                      inputMode="numeric"
                      placeholder={phonePlaceholder}
                      value={phoneNumber}
                      onInput={(e) =>
                        updatePhone(
                          phoneCountry,
                          (e.currentTarget as HTMLInputElement).value,
                        )
                      }
                      aria-invalid={invalidAttr}
                      aria-describedby={describedBy}
                      aria-required={phoneRequired ? "true" : undefined}
                      disabled={form.isSubmitting}
                      required={phoneRequired}
                    />
                  </div>
                </div>
              )}

              <div class="register-section__field">
                <label
                  class="register-section__label"
                  htmlFor="register-password"
                >
                  {passwordLabel}
                </label>
                <input
                  id="register-password"
                  class="register-section__input"
                  type="password"
                  autocomplete="new-password"
                  placeholder={passwordPlaceholder}
                  value={form.password?.value ?? ""}
                  onInput={(e) =>
                    setRegisterFormPassword(
                      form,
                      (e.currentTarget as HTMLInputElement).value,
                    )
                  }
                  aria-invalid={invalidAttr}
                  aria-describedby={describedBy}
                  disabled={form.isSubmitting}
                  minLength={8}
                  required
                />
              </div>

              <div class="register-section__consents">
                <ConsentRow
                  id="register-agreement"
                  required
                  hasError={agreementHasError}
                  checked={isAgreementAccepted}
                  onToggle={(value) =>
                    setRegisterFormIsMembershipAgreementAccepted(form, value)
                  }
                  text={agreementConsentText}
                  hasContent={!!agreementContent}
                  onView={() => setOpenConsent("agreement")}
                  disabled={form.isSubmitting}
                />
                <ConsentRow
                  id="register-marketing"
                  checked={isMarketingAccepted}
                  onToggle={(value) =>
                    setRegisterFormIsMarketingAccepted(form, value)
                  }
                  text={marketingConsentText}
                  hasContent={!!marketingContent}
                  onView={() => setOpenConsent("marketing")}
                  disabled={form.isSubmitting}
                />
              </div>

              {error ? (
                <p
                  id={errorId}
                  class="register-section__error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                class="register-section__submit"
                disabled={form.isSubmitting}
                aria-busy={form.isSubmitting ? "true" : undefined}
              >
                {form.isSubmitting ? submittingButtonText : submitButtonText}
              </button>
            </form>

            <p class="register-section__login-prompt">
              {loginPromptText}{" "}
              <a
                class="register-section__login-link"
                href={loginHref}
                target={loginOpensInNewTab ? "_blank" : undefined}
                rel={loginOpensInNewTab ? "noopener noreferrer" : undefined}
              >
                {loginLinkText}
              </a>
            </p>
          </div>
        </div>
      </div>

      <ConsentModal
        isOpen={!!activeModal}
        title={activeModal?.title ?? ""}
        content={activeModal?.content ?? ""}
        closeAriaLabel={closeConsentAriaLabel}
        onClose={() => setOpenConsent(null)}
      />
    </section>
  );
}

interface ConsentRowProps {
  id: string;
  checked: boolean;
  onToggle: (value: boolean) => void;
  text: string;
  hasContent: boolean;
  onView: () => void;
  required?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}

function ConsentRow({
  id,
  checked,
  onToggle,
  text,
  hasContent,
  onView,
  required,
  hasError,
  disabled,
}: ConsentRowProps) {
  return (
    <div
      class="register-section__consent"
      data-error={hasError ? "true" : "false"}
    >
      <label class="register-section__consent-toggle" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          class="register-section__consent-input"
          checked={checked}
          onChange={(e) =>
            onToggle((e.currentTarget as HTMLInputElement).checked)
          }
          disabled={disabled}
          aria-required={required ? "true" : undefined}
          aria-invalid={hasError ? "true" : undefined}
        />
        <span class="register-section__consent-box" aria-hidden="true">
          <CheckIcon />
        </span>
      </label>
      {hasContent ? (
        <button
          type="button"
          class="register-section__consent-text register-section__consent-text--clickable"
          onClick={onView}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        <span
          class="register-section__consent-text"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5 L6.5 12 L13 4.5" />
    </svg>
  );
}

function Checkmark() {
  return (
    <svg
      class="register-section__check"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#fff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5 L6.5 12 L13 4.5" />
    </svg>
  );
}

export default Register;

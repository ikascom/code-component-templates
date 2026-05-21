import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getForgotPasswordForm,
  initForgotPasswordForm,
  setForgotPasswordFormEmail,
  submitForgotPasswordForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function ForgotPassword({
  backgroundColor = "#FAF8F5",
  heading = "Şifremi Unuttum",
  showSubtext = true,
  subtext = "E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.",
  emailLabel = "E-posta",
  emailPlaceholder = "ornek@email.com",
  submitButtonText = "Bağlantı Gönder",
  submittingButtonText = "Gönderiliyor...",
  successHeading = "Bağlantı Gönderildi",
  successText = "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.",
  backToLoginText = "Giriş sayfasına dön",
  loginUrl,
}: Props) {
  const loginHref =
    typeof loginUrl?.href === "string" && loginUrl.href.trim()
      ? loginUrl.href
      : "#";
  const loginOpensInNewTab = !!loginUrl?.openInNewTab;

  const form = getForgotPasswordForm(customerStore);

  useEffect(() => {
    initForgotPasswordForm(form);
  }, []);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorId = "forgot-password-form-error";
  const describedBy = error ? errorId : undefined;
  const invalidAttr = error ? "true" : undefined;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      setForgotPasswordFormEmail(form, email);
      const success = await submitForgotPasswordForm(form);
      if (success) {
        setIsSuccess(true);
        return;
      }
      const fieldMessage = form.email?.hasError ? form.email?.message : null;
      setError(
        fieldMessage ||
          form.responseMessage ||
          "Bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } catch {
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      class={
        "forgot-password-section" +
        (isSuccess ? " forgot-password-section--success" : "")
      }
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="forgot-password-section__inner">
        {isSuccess ? (
          <>
            <svg
              class="forgot-password-section__success-icon"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="21" />
              <path d="M15 24.5l6.5 6.5L33 19" />
            </svg>
            <h1 class="forgot-password-section__heading">{successHeading}</h1>
            <p class="forgot-password-section__subtext">{successText}</p>
            <a
              class="forgot-password-section__back-link forgot-password-section__back-link--success"
              href={loginHref}
              target={loginOpensInNewTab ? "_blank" : undefined}
              rel={loginOpensInNewTab ? "noopener noreferrer" : undefined}
            >
              {backToLoginText}
            </a>
          </>
        ) : (
          <>
            <h1 class="forgot-password-section__heading">{heading}</h1>
            {showSubtext && subtext ? (
              <p class="forgot-password-section__subtext">{subtext}</p>
            ) : null}

            <form
              class="forgot-password-section__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div class="forgot-password-section__field">
                <label
                  class="forgot-password-section__label"
                  htmlFor="forgot-password-email"
                >
                  {emailLabel}
                </label>
                <input
                  id="forgot-password-email"
                  class="forgot-password-section__input"
                  type="email"
                  autocomplete="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onInput={(e) =>
                    setEmail((e.currentTarget as HTMLInputElement).value)
                  }
                  aria-invalid={invalidAttr}
                  aria-describedby={describedBy}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {error ? (
                <p
                  id={errorId}
                  class="forgot-password-section__error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                class="forgot-password-section__submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting ? "true" : undefined}
              >
                {isSubmitting ? submittingButtonText : submitButtonText}
              </button>

              <a
                class="forgot-password-section__back-link"
                href={loginHref}
                target={loginOpensInNewTab ? "_blank" : undefined}
                rel={loginOpensInNewTab ? "noopener noreferrer" : undefined}
              >
                {backToLoginText}
              </a>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default ForgotPassword;

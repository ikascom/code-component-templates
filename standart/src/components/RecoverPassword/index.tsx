import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getRecoverPasswordForm,
  initRecoverPasswordForm,
  setRecoverPasswordFormPassword,
  setRecoverPasswordFormPasswordAgain,
  submitRecoverPasswordForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function RecoverPassword({
  backgroundColor = "#FAF8F5",
  heading = "Şifremi Yenile",
  showSubtext = true,
  subtext = "Hesabını korumak için yeni bir şifre belirle.",
  passwordLabel = "Yeni Şifre",
  passwordPlaceholder = "Yeni şifrenizi girin",
  passwordAgainLabel = "Yeni Şifre (Tekrar)",
  passwordAgainPlaceholder = "Yeni şifrenizi tekrar girin",
  submitButtonText = "Şifremi Değiştir",
  submittingButtonText = "Değiştiriliyor...",
  successHeading = "Şifren Güncellendi",
  successText = "Şifren başarıyla değiştirildi. Yeni şifrenle giriş yapabilirsin.",
  backToLoginText = "Giriş sayfasına dön",
  loginUrl,
}: Props) {
  const loginHref =
    typeof loginUrl?.href === "string" && loginUrl.href.trim()
      ? loginUrl.href
      : "#";
  const loginOpensInNewTab = !!loginUrl?.openInNewTab;

  const form = getRecoverPasswordForm(customerStore);

  useEffect(() => {
    initRecoverPasswordForm(form);
  }, []);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordErrorId = "recover-password-form-password-error";
  const passwordAgainErrorId = "recover-password-form-password-again-error";
  const formErrorId = "recover-password-form-error";

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      setRecoverPasswordFormPassword(form, password);
      setRecoverPasswordFormPasswordAgain(form, passwordAgain);

      const success = await submitRecoverPasswordForm(form);
      if (success) {
        setIsSuccess(true);
        return;
      }

      const fieldMessage =
        (form.password?.hasError ? form.password?.message : null) ||
        (form.passwordAgain?.hasError ? form.passwordAgain?.message : null);

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

  const passwordHasError = !!form.password?.hasError;
  const passwordAgainHasError = !!form.passwordAgain?.hasError;

  return (
    <section
      class={
        "recover-password-section" +
        (isSuccess ? " recover-password-section--success" : "")
      }
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="recover-password-section__inner">
        {isSuccess ? (
          <>
            <svg
              class="recover-password-section__success-icon"
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
            <h1 class="recover-password-section__heading">{successHeading}</h1>
            <p class="recover-password-section__subtext">{successText}</p>
            <a
              class="recover-password-section__back-link recover-password-section__back-link--success"
              href={loginHref}
              target={loginOpensInNewTab ? "_blank" : undefined}
              rel={loginOpensInNewTab ? "noopener noreferrer" : undefined}
            >
              {backToLoginText}
            </a>
          </>
        ) : (
          <>
            <h1 class="recover-password-section__heading">{heading}</h1>
            {showSubtext && subtext ? (
              <p class="recover-password-section__subtext">{subtext}</p>
            ) : null}

            <form
              class="recover-password-section__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div class="recover-password-section__field">
                <label
                  class="recover-password-section__label"
                  htmlFor="recover-password-new"
                >
                  {passwordLabel}
                </label>
                <input
                  id="recover-password-new"
                  class="recover-password-section__input"
                  type="password"
                  autocomplete="new-password"
                  placeholder={passwordPlaceholder}
                  value={password}
                  onInput={(e) =>
                    setPassword((e.currentTarget as HTMLInputElement).value)
                  }
                  aria-invalid={passwordHasError ? "true" : undefined}
                  aria-describedby={
                    passwordHasError ? passwordErrorId : undefined
                  }
                  disabled={isSubmitting}
                  required
                />
                {passwordHasError && form.password?.message ? (
                  <p
                    id={passwordErrorId}
                    class="recover-password-section__field-error"
                  >
                    {form.password.message}
                  </p>
                ) : null}
              </div>

              <div class="recover-password-section__field">
                <label
                  class="recover-password-section__label"
                  htmlFor="recover-password-again"
                >
                  {passwordAgainLabel}
                </label>
                <input
                  id="recover-password-again"
                  class="recover-password-section__input"
                  type="password"
                  autocomplete="new-password"
                  placeholder={passwordAgainPlaceholder}
                  value={passwordAgain}
                  onInput={(e) =>
                    setPasswordAgain(
                      (e.currentTarget as HTMLInputElement).value,
                    )
                  }
                  aria-invalid={passwordAgainHasError ? "true" : undefined}
                  aria-describedby={
                    passwordAgainHasError ? passwordAgainErrorId : undefined
                  }
                  disabled={isSubmitting}
                  required
                />
                {passwordAgainHasError && form.passwordAgain?.message ? (
                  <p
                    id={passwordAgainErrorId}
                    class="recover-password-section__field-error"
                  >
                    {form.passwordAgain.message}
                  </p>
                ) : null}
              </div>

              {error ? (
                <p
                  id={formErrorId}
                  class="recover-password-section__error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                class="recover-password-section__submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting ? "true" : undefined}
              >
                {isSubmitting ? submittingButtonText : submitButtonText}
              </button>

              <a
                class="recover-password-section__back-link"
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

export default RecoverPassword;

import { useState } from "preact/hooks";
import {
  Router,
  customerLogin,
  customerStore,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export function Login({
  backgroundColor = "#FAF8F5",
  heading = "Giriş Yap",
  showSubtext = true,
  subtext = "Hesabınıza erişmek için bilgilerinizi girin",
  emailLabel = "E-posta",
  emailPlaceholder = "ornek@email.com",
  passwordLabel = "Şifre",
  passwordPlaceholder = "••••••••",
  forgotPasswordText = "Şifremi unuttum",
  submitButtonText = "Giriş Yap",
  submittingButtonText = "Giriş yapılıyor...",
  registerPromptText = "Hesabınız yok mu?",
  registerLinkText = "Kayıt olun",
  forgotPasswordUrl,
  registerUrl,
}: Props) {
  const forgotHref =
    typeof forgotPasswordUrl?.href === "string" && forgotPasswordUrl.href.trim()
      ? forgotPasswordUrl.href
      : "/forgot-password";
  const forgotOpensInNewTab = !!forgotPasswordUrl?.openInNewTab;
  const registerHref =
    typeof registerUrl?.href === "string" && registerUrl.href.trim()
      ? registerUrl.href
      : "/register";
  const registerOpensInNewTab = !!registerUrl?.openInNewTab;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorId = "login-form-error";
  const describedBy = error ? errorId : undefined;
  const invalidAttr = error ? "true" : undefined;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await customerLogin(customerStore, email, password);
      if (result?.isSuccess) {
        Router.navigateToPage("ACCOUNT");
        return;
      }
      const codes = (result?.errorCodes ?? []) as string[];
      if (codes.includes("WRONG_PASSWORD")) {
        setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
      } else if (codes.includes("CUSTOMER_NOT_FOUND")) {
        setError("Bu e-posta adresine ait bir hesap bulunamadı.");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      class="login-section"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="login-section__inner">
        <h1 class="login-section__heading">{heading}</h1>
        {showSubtext && subtext ? (
          <p class="login-section__subtext">{subtext}</p>
        ) : null}

        <form
          class="login-section__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div class="login-section__field">
            <label class="login-section__label" htmlFor="login-email">
              {emailLabel}
            </label>
            <input
              id="login-email"
              class="login-section__input"
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

          <div class="login-section__field">
            <label class="login-section__label" htmlFor="login-password">
              {passwordLabel}
            </label>
            <input
              id="login-password"
              class="login-section__input"
              type="password"
              autocomplete="current-password"
              placeholder={passwordPlaceholder}
              value={password}
              onInput={(e) =>
                setPassword((e.currentTarget as HTMLInputElement).value)
              }
              aria-invalid={invalidAttr}
              aria-describedby={describedBy}
              disabled={isSubmitting}
              required
            />
            <a
              class="login-section__forgot-link"
              href={forgotHref}
              target={forgotOpensInNewTab ? "_blank" : undefined}
              rel={forgotOpensInNewTab ? "noopener noreferrer" : undefined}
            >
              {forgotPasswordText}
            </a>
          </div>

          {error ? (
            <p id={errorId} class="login-section__error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            class="login-section__submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting ? "true" : undefined}
          >
            {isSubmitting ? submittingButtonText : submitButtonText}
          </button>
        </form>

        <p class="login-section__register-prompt">
          {registerPromptText}{" "}
          <a
            class="login-section__register-link"
            href={registerHref}
            target={registerOpensInNewTab ? "_blank" : undefined}
            rel={registerOpensInNewTab ? "noopener noreferrer" : undefined}
          >
            {registerLinkText}
          </a>
        </p>
      </div>
    </section>
  );
}

export default Login;

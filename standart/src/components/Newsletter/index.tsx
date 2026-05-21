import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getNewsletterSubscriptionForm,
  initNewsletterSubscriptionForm,
  setNewsletterSubscriptionFormEmail,
  submitNewsletterSubscriptionForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter({
  eyebrowText = "Join the Community",
  showEyebrow = true,
  heading = "Stay in the Loop",
  description = "Be the first to hear about new arrivals, exclusive offers, and beauty rituals.",
  showDescription = true,
  emailPlaceholder = "Your email address",
  submitLabel = "Subscribe",
  submittingLabel = "Subscribing...",
  disclaimerText = "By subscribing, you agree to receive marketing communications from us.",
  successHeading = "You're in!",
  successBody = "Thank you for subscribing. Check your inbox for a confirmation.",
  errorGeneral = "Something went wrong. Please try again.",
  errorDuplicate = "This email is already subscribed.",
  errorEmpty = "Please enter your email address.",
  backgroundColor = "#F2EDE8",
  formAriaLabel = "Newsletter signup",
}: Props) {
  const form = getNewsletterSubscriptionForm(customerStore);

  useEffect(() => {
    initNewsletterSubscriptionForm(form);
  }, []);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorId = "newsletter-form-error";
  const inputId = "newsletter-email";
  const invalidAttr = error ? "true" : undefined;
  const describedBy = error ? errorId : undefined;

  const isDuplicateMessage = (message: string | undefined | null) => {
    if (!message) return false;
    const normalized = message.toLowerCase();
    return (
      normalized.includes("already") ||
      normalized.includes("exist") ||
      normalized.includes("subscribed") ||
      normalized.includes("duplicate")
    );
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setError(errorEmpty);
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError(errorGeneral);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      setNewsletterSubscriptionFormEmail(form, trimmed);
      const success = await submitNewsletterSubscriptionForm(form);
      if (success) {
        setIsSuccess(true);
        return;
      }
      const fieldMessage = form.email?.hasError ? form.email?.message : null;
      const responseMessage = form.responseMessage;
      if (
        isDuplicateMessage(fieldMessage) ||
        isDuplicateMessage(responseMessage)
      ) {
        setError(errorDuplicate);
        return;
      }
      setError(fieldMessage || responseMessage || errorGeneral);
    } catch {
      setError(errorGeneral);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      class="newsletter-section"
      style={backgroundColor ? { backgroundColor } : undefined}
      aria-labelledby="newsletter-heading"
    >
      <div class="newsletter-section__container">
        <div class="newsletter-section__inner" aria-live="polite">
          {isSuccess ? (
            <div class="newsletter-section__success" role="status">
              <svg
                class="newsletter-section__success-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" />
                <path d="M10 16.5l4 4 8-9" />
              </svg>
              <h2 class="newsletter-section__heading">{successHeading}</h2>
              <p class="newsletter-section__description">{successBody}</p>
            </div>
          ) : (
            <>
              {showEyebrow && eyebrowText ? (
                <p class="newsletter-section__eyebrow">{eyebrowText}</p>
              ) : null}

              <h2
                id="newsletter-heading"
                class="newsletter-section__heading"
              >
                {heading}
              </h2>

              {showDescription && description ? (
                <p class="newsletter-section__description">{description}</p>
              ) : null}

              <form
                class="newsletter-section__form"
                onSubmit={handleSubmit}
                aria-label={formAriaLabel}
                noValidate
              >
                <label class="newsletter-section__sr-only" htmlFor={inputId}>
                  {emailPlaceholder}
                </label>
                <input
                  id={inputId}
                  class={
                    error
                      ? "newsletter-section__input newsletter-section__input--error"
                      : "newsletter-section__input"
                  }
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
                <button
                  type="submit"
                  class="newsletter-section__submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting ? "true" : undefined}
                >
                  {isSubmitting ? submittingLabel : submitLabel}
                </button>
              </form>

              {error ? (
                <p
                  id={errorId}
                  class="newsletter-section__error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {disclaimerText ? (
                <p class="newsletter-section__disclaimer">{disclaimerText}</p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter;

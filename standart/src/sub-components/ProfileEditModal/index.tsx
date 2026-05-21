import { observer } from "@ikas/component-utils";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import {
  customerStore,
  getAccountInfoForm,
  initAccountInfoForm,
  setAccountInfoFormFirstName,
  setAccountInfoFormLastName,
  setAccountInfoFormPhone,
  setAccountInfoFormIsMarketingAccepted,
  submitAccountInfoForm,
} from "@ikas/bp-storefront";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  firstNameLabel: string;
  lastNameLabel: string;
  phoneLabel: string;
  marketingLabel: string;
  saveText: string;
  savingText: string;
  cancelText: string;
  closeAriaLabel: string;
}

const ProfileEditModal = observer(function ProfileEditModal({
  isOpen,
  onClose,
  title,
  firstNameLabel,
  lastNameLabel,
  phoneLabel,
  marketingLabel,
  saveText,
  savingText,
  cancelText,
  closeAriaLabel,
}: Props) {
  const titleId = `profile-edit-modal-title-${useId()}`;
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  const form = getAccountInfoForm(customerStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Force-rerender hint when async setters mutate the observable form item.
  const [, setRevision] = useState(0);
  const bump = () => setRevision((r) => r + 1);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setErrorMessage(null);
    setIsSubmitting(false);
    initAccountInfoForm(form).finally(bump);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      if (
        previouslyFocusedRef.current instanceof HTMLElement &&
        document.contains(previouslyFocusedRef.current)
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
    // form is a stable observable from the store; intentionally not in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const ok = await submitAccountInfoForm(form);
      if (ok) {
        onClose();
        return;
      }
      setErrorMessage(
        form.responseMessage ||
          "Bilgileriniz güncellenemedi. Lütfen alanları kontrol edin.",
      );
    } catch {
      setErrorMessage("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="profile-edit-modal" role="presentation">
      <div
        class="profile-edit-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        class="profile-edit-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header class="profile-edit-modal__header">
          <h2 id={titleId} class="profile-edit-modal__title">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            class="profile-edit-modal__close"
            aria-label={closeAriaLabel}
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form
          class="profile-edit-modal__body"
          onSubmit={handleSubmit}
          noValidate
        >
          <div class="profile-edit-modal__row">
            <div class="profile-edit-modal__field">
              <label
                class="profile-edit-modal__label"
                htmlFor="profile-firstname"
              >
                {firstNameLabel}
              </label>
              <input
                id="profile-firstname"
                class="profile-edit-modal__input"
                type="text"
                autocomplete="given-name"
                value={form.firstName?.value ?? ""}
                onInput={(e) => {
                  setAccountInfoFormFirstName(
                    form,
                    (e.currentTarget as HTMLInputElement).value,
                  );
                  bump();
                }}
                disabled={isSubmitting}
                required
              />
            </div>
            <div class="profile-edit-modal__field">
              <label
                class="profile-edit-modal__label"
                htmlFor="profile-lastname"
              >
                {lastNameLabel}
              </label>
              <input
                id="profile-lastname"
                class="profile-edit-modal__input"
                type="text"
                autocomplete="family-name"
                value={form.lastName?.value ?? ""}
                onInput={(e) => {
                  setAccountInfoFormLastName(
                    form,
                    (e.currentTarget as HTMLInputElement).value,
                  );
                  bump();
                }}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div class="profile-edit-modal__field">
            <label class="profile-edit-modal__label" htmlFor="profile-phone">
              {phoneLabel}
            </label>
            <input
              id="profile-phone"
              class="profile-edit-modal__input"
              type="tel"
              autocomplete="tel"
              value={form.phone?.value ?? ""}
              onInput={(e) => {
                setAccountInfoFormPhone(
                  form,
                  (e.currentTarget as HTMLInputElement).value,
                );
                bump();
              }}
              disabled={isSubmitting}
            />
          </div>

          <label class="profile-edit-modal__checkbox">
            <input
              type="checkbox"
              checked={!!form.isMarketingAccepted?.value}
              onChange={(e) => {
                setAccountInfoFormIsMarketingAccepted(
                  form,
                  (e.currentTarget as HTMLInputElement).checked,
                );
                bump();
              }}
              disabled={isSubmitting}
            />
            <span>{marketingLabel}</span>
          </label>

          {errorMessage ? (
            <p class="profile-edit-modal__error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div class="profile-edit-modal__actions">
            <button
              type="button"
              class="profile-edit-modal__btn profile-edit-modal__btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              class="profile-edit-modal__btn profile-edit-modal__btn--primary"
              disabled={isSubmitting}
              aria-busy={isSubmitting ? "true" : undefined}
            >
              {isSubmitting ? savingText : saveText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProfileEditModal;

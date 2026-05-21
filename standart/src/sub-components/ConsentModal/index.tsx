import { observer } from "@ikas/component-utils";
import { useEffect, useId, useRef } from "preact/hooks";

interface Props {
  isOpen: boolean;
  title: string;
  content: string;
  closeAriaLabel: string;
  onClose: () => void;
}

const ConsentModal = observer(function ConsentModal({
  isOpen,
  title,
  content,
  closeAriaLabel,
  onClose,
}: Props) {
  const titleId = `consent-modal-title-${useId()}`;
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div class="consent-modal" role="presentation">
      <div
        class="consent-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        class="consent-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header class="consent-modal__header">
          <h2 id={titleId} class="consent-modal__title">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            class="consent-modal__close"
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
        <div
          class="consent-modal__body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
});

export default ConsentModal;

import {
  getSelectedProductVariant,
  hasProductStock,
  hasProductVariantStock,
  getProductVariantIsBackInStockEnabled,
  getProductVariantIsBackInStockCustomerLoginRequired,
  saveProductVariantBackInStockReminder,
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  customerStore,
  Router,
} from "@ikas/bp-storefront";
import { useEffect, useState } from "preact/hooks";
import { Props } from "./types";
import Button from "../../sub-components/Button";
import Modal from "../../sub-components/Modal";
import { showToast } from "../../utils/toast";
import BackInStockForm from "./components/BackInStockForm";

export function ProductDetailBackInStock({
  product,
  notifyButtonText = "Notify Me When Available",
  reminderSavedText = "We'll notify you",
  alreadySavedMessage = "You're already on the list — we'll email you when it's back.",
  savedMessage = "Great! We'll email you when this product is back in stock.",
  loginRequiredMessage = "Please sign in so we can notify you.",
  errorMessage = "Something went wrong. Please try again.",
  modalTitle = "Notify me when available",
  modalDescription = "Enter your email and we'll let you know the moment this product is back in stock.",
  emailLabel = "Email",
  submitButtonText = "Notify Me",
  submittingText = "Saving...",
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
}: Props) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);

  const selectedVariant = product
    ? getSelectedProductVariant(product)
    : undefined;

  // Reset local UI state when the selected variant changes, seeding "saved"
  // from the variant's own persisted reminder state.
  useEffect(() => {
    setReminderSaved(!!selectedVariant?.isBackInStockReminderSaved);
    setIsEmailModalOpen(false);
  }, [selectedVariant?.id]);

  if (!product || !selectedVariant) return null;

  // This component owns the notify-me flow only. Stay out of the way unless the
  // variant is out of stock AND back-in-stock reminders are enabled for it.
  const isOutOfStock =
    !hasProductStock(product) || !hasProductVariantStock(selectedVariant);
  if (!isOutOfStock || !getProductVariantIsBackInStockEnabled(selectedVariant)) {
    return null;
  }

  // Login-required branch: register a logged-in customer immediately, otherwise
  // send an anonymous visitor to login first.
  const registerWithCustomerEmail = async () => {
    const email = customerStore.customer?.email;
    if (!email) {
      showToast(loginRequiredMessage, "error");
      Router.navigateToPage("LOGIN");
      return;
    }
    const ok = await saveProductVariantBackInStockReminder(selectedVariant, email);
    setReminderSaved(ok);
    showToast(ok ? savedMessage : errorMessage, ok ? "success" : "error");
  };

  const handleNotifyClick = () => {
    if (reminderSaved) {
      showToast(alreadySavedMessage, "success");
      return;
    }
    if (getProductVariantIsBackInStockCustomerLoginRequired(selectedVariant)) {
      void registerWithCustomerEmail();
      return;
    }
    // No login required: collect the email through the form.
    setIsEmailModalOpen(true);
  };

  const handleFormSaved = () => {
    setReminderSaved(true);
    setIsEmailModalOpen(false);
    showToast(savedMessage, "success");
  };

  return (
    <div
      className="kombos-pd-bis"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      {reminderSaved ? (
        <div className="kombos-pd-bis__saved" aria-live="polite">
          {reminderSavedText}
        </div>
      ) : (
        <Button
          variant="secondary"
          size="s"
          className="kombos-pd-bis__btn"
          onClick={handleNotifyClick}
        >
          {notifyButtonText}
        </Button>
      )}

      {isEmailModalOpen && (
        <Modal
          title={modalTitle}
          onClose={() => setIsEmailModalOpen(false)}
          footer={null}
        >
          <BackInStockForm
            variant={selectedVariant}
            description={modalDescription}
            emailLabel={emailLabel}
            submitButtonText={submitButtonText}
            submittingText={submittingText}
            errorMessage={errorMessage}
            onSaved={handleFormSaved}
          />
        </Modal>
      )}
    </div>
  );
}

export default ProductDetailBackInStock;

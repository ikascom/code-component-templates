import { useState } from "preact/hooks";
import Modal from "../Modal";
import Button from "../Button";

interface Props {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  confirmVariant?: "primary" | "dangerous";
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmModal({
  title,
  message,
  cancelText,
  confirmText,
  confirmVariant = "dangerous",
  onClose,
  onConfirm,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
  };

  return (
    <Modal onClose={onClose} title={title} maxWidth="25rem" footer={null}>
      <div className="confirm-modal">
        <p className="confirm-modal__message text-md-regular">{message}</p>
        <div className="confirm-modal__actions">
          <Button
            variant="secondary"
            size="s"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="confirm-modal__btn"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="s"
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="confirm-modal__btn"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

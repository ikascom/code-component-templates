import { useState, useEffect, useCallback } from "preact/hooks";
import { useScrollLock } from "../../hooks/useScrollLock";
import { cx } from "../../utils/cx";
import { XSVG } from "../icons";

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ src, alt, onClose }: Props) {
  const [open, setOpen] = useState(false);

  useScrollLock();

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className={cx("kombos-image-preview", open && "kombos-image-preview--open")}
      onClick={handleClose}
    >
      <button
        type="button"
        className="kombos-image-preview__close"
        onClick={handleClose}
        aria-label="Close"
      >
        <XSVG />
      </button>
      <img
        src={src}
        alt={alt}
        className="kombos-image-preview__img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

import { useState, useEffect, useRef, useId } from "preact/hooks";
import { createPortal } from "preact/compat";
import type { ComponentChildren } from "preact";
import { useScrollLock } from "../../hooks/useScrollLock";
import { cx } from "../../utils/cx";
import { XSVG } from "../icons";
import Button, { type ButtonProps } from "../Button";

interface Props {
  onClose: () => void;
  title: string;
  maxWidth?: string;
  children: ComponentChildren;
  className?: string;
  okText?: string;
  cancelText?: string;
  onOk?: (e: Event) => void;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  footer?: ComponentChildren | null;
}

export default function Modal({
  onClose,
  title,
  maxWidth = "37.5rem",
  children,
  className,
  okText,
  cancelText,
  onOk,
  okButtonProps,
  cancelButtonProps,
  footer,
}: Props) {
  const titleId = useId();
  const [visible, setVisible] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleCloseRef = useRef(() => {});
  handleCloseRef.current = () => {
    setVisible(false);
    setTimeout(() => onCloseRef.current(), 300);
  };

  useScrollLock();

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return createPortal(
    <div
      className={cx("kombos-modal", visible && "kombos-modal--open", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="kombos-modal__panel" style={{ maxWidth }}>
        <div className="kombos-modal__header">
          <h2 id={titleId} className="kombos-modal__title text-md-medium">
            {title}
          </h2>
          <button
            type="button"
            className="kombos-modal__close"
            onClick={() => handleCloseRef.current()}
            aria-label="Close"
          >
            <XSVG />
          </button>
        </div>

        <div className="kombos-modal__body">{children}</div>

        {footer !== null &&
          (footer !== undefined ? (
            <div className="kombos-modal__footer">{footer}</div>
          ) : (
            (cancelText || okText) && (
              <div className="kombos-modal__footer">
                {cancelText && (
                  <Button
                    variant="secondary"
                    size="s"
                    type="button"
                    onClick={() => handleCloseRef.current()}
                    {...cancelButtonProps}
                  >
                    {cancelText}
                  </Button>
                )}
                {okText && (
                  <Button
                    variant="primary"
                    size="s"
                    onClick={onOk}
                    {...okButtonProps}
                  >
                    {okText}
                  </Button>
                )}
              </div>
            )
          ))}
      </div>
    </div>,
    document.body,
  );
}

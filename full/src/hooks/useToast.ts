import { useState, useCallback, useRef } from "preact/hooks";

export const TOAST_LIMIT = 3;

type ToastVariant = "success" | "error";

export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, variant: ToastVariant) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}

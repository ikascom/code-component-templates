import { render } from "preact";
import { useEffect, useRef, useState, useCallback } from "preact/hooks";
import { CheckSVG, XSVG } from "../icons";
import { cx } from "../../utils/cx";
import type { ToastItem } from "../../hooks/useToast";
import { TOAST_LIMIT } from "../../hooks/useToast";

const DISMISS_DURATION = 3000;
const EXIT_DURATION = 350;
const GAP = 8;

// Injected once into <head> so styles apply to portal elements on body
let styleInjected = false;
function injectStyles() {
  if (styleInjected) return;
  styleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
.kombos-toast-container{position:fixed;top:1.5rem;left:50%;transform:translateX(-50%);z-index:var(--kombos-z-overlay);pointer-events:none;display:flex;flex-direction:column;align-items:center}
.kombos-toast-item{position:absolute;top:0;pointer-events:auto;transition:transform .4s cubic-bezier(.21,1.02,.73,1),opacity .3s ease}
.kombos-toast{display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;border-radius:6px;border:1px solid var(--kombos-gray-200);background:var(--kombos-white);box-shadow:0 4px 12px rgba(0,0,0,.08);white-space:nowrap;min-width:18rem;max-width:25rem;opacity:0;transform:translateY(-2rem);transition:opacity .3s ease,transform .4s cubic-bezier(.21,1.02,.73,1)}
.kombos-toast--mounted{opacity:1;transform:translateY(0)}
.kombos-toast--exiting{opacity:0;transform:translateY(-2rem);transition:opacity .25s ease,transform .35s cubic-bezier(.06,.71,.55,1)}
.kombos-toast__icon{display:flex;flex-shrink:0;font-size:1.125rem}
.kombos-toast--success .kombos-toast__icon{color:var(--kombos-success)}
.kombos-toast--error .kombos-toast__icon{color:var(--kombos-error)}
.kombos-toast__message{color:var(--kombos-gray-900);overflow:hidden;text-overflow:ellipsis}
.kombos-toast__close{display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;margin-left:auto;border:none;background:none;cursor:pointer;color:var(--kombos-gray-400);font-size:.875rem;transition:color .15s ease}
.kombos-toast__close:hover{color:var(--kombos-gray-700)}
`;
  document.head.appendChild(style);
}

interface ToastProps {
  id: number;
  message: string;
  variant: "success" | "error";
  frontIndex: number;
  expanded: boolean;
  pauseTimers: boolean;
  onDismiss: (id: number) => void;
  heights: { current: Map<number, number> };
  toastIds: number[];
}

function Toast({
  id,
  message,
  variant,
  frontIndex,
  expanded,
  pauseTimers,
  onDismiss,
  heights,
  toastIds,
}: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(DISMISS_DURATION);
  const startRef = useRef(0);
  const onDismissRef = useRef(onDismiss);
  const exitingRef = useRef(false);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (cardRef.current) {
      heights.current.set(id, cardRef.current.getBoundingClientRect().height);
    }
    requestAnimationFrame(() => setMounted(true));
    return () => {
      heights.current.delete(id);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    clearTimer();
    setExiting(true);
    setTimeout(() => onDismissRef.current(id), EXIT_DURATION);
  }, [id, clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    startRef.current = Date.now();
    timerRef.current = setTimeout(startExit, remainingRef.current);
  }, [clearTimer, startExit]);

  useEffect(() => {
    if (mounted && !pauseTimers && !exitingRef.current) startTimer();
    return clearTimer;
  }, [mounted, pauseTimers, startTimer]);

  useEffect(() => {
    if (!mounted || exitingRef.current) return;
    if (pauseTimers && timerRef.current) {
      clearTimer();
      remainingRef.current -= Date.now() - startRef.current;
      if (remainingRef.current < 0) remainingRef.current = 0;
    }
  }, [pauseTimers]);

  // Expanded offset (downward from top)
  let expandedOffset = 0;
  if (expanded) {
    const myIdx = toastIds.indexOf(id);
    for (let i = myIdx + 1; i < toastIds.length; i++) {
      expandedOffset += (heights.current.get(toastIds[i]) ?? 0) + GAP;
    }
  }

  // Stacking styles
  let wrapperTransform: string;
  let wrapperOpacity: number;
  let hidden = false;

  if (expanded) {
    wrapperTransform = `translateY(${expandedOffset}px) scale(1)`;
    wrapperOpacity = 1;
  } else if (frontIndex === 0) {
    wrapperTransform = "translateY(0) scale(1)";
    wrapperOpacity = 1;
  } else if (frontIndex === 1) {
    wrapperTransform = "translateY(0.5rem) scale(0.95)";
    wrapperOpacity = 0.8;
  } else if (frontIndex === 2) {
    wrapperTransform = "translateY(1rem) scale(0.9)";
    wrapperOpacity = 0.6;
  } else {
    wrapperTransform = "translateY(1rem) scale(0.9)";
    wrapperOpacity = 0;
    hidden = true;
  }

  const cardClass = cx(
    "kombos-toast",
    `kombos-toast--${variant}`,
    mounted && !exiting && "kombos-toast--mounted",
    exiting && "kombos-toast--exiting"
  );

  return (
    <div
      className="kombos-toast-item"
      style={{
        transform: wrapperTransform,
        opacity: wrapperOpacity,
        zIndex: 1000 - frontIndex,
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      <div ref={cardRef} className={cardClass} role="alert">
        <span className="kombos-toast__icon">
          {variant === "success" ? <CheckSVG /> : <XSVG />}
        </span>
        <span className="kombos-toast__message text-sm-medium">{message}</span>
        <button
          type="button"
          className="kombos-toast__close"
          onClick={startExit}
          aria-label="Close"
        >
          <XSVG />
        </button>
      </div>
    </div>
  );
}

// Rendered inside the portal (body-level), manages its own state
function ToastPortal({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const heights = useRef<Map<number, number>>(new Map());

  const visibleToasts = toasts.slice(-TOAST_LIMIT);
  const toastIds = visibleToasts.map((t) => t.id);

  return (
    <div
      className="kombos-toast-container"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {visibleToasts.map((t) => {
        const frontIndex = visibleToasts.length - 1 - visibleToasts.indexOf(t);
        return (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            variant={t.variant}
            frontIndex={frontIndex}
            expanded={expanded}
            pauseTimers={expanded}
            onDismiss={onDismiss}
            heights={heights}
            toastIds={toastIds}
          />
        );
      })}
    </div>
  );
}

// Public API — same interface, renders nothing in the component tree,
// syncs toasts into a body-level portal via render()
interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    injectStyles();
    const el = document.createElement("div");
    document.body.appendChild(el);
    elRef.current = el;
    return () => {
      render(null, el);
      el.remove();
    };
  }, []);

  // Re-render portal on every parent render
  useEffect(() => {
    if (!elRef.current) return;
    if (toasts.length === 0) {
      render(null, elRef.current);
    } else {
      render(
        <ToastPortal toasts={toasts} onDismiss={onDismiss} />,
        elRef.current
      );
    }
  });

  return null;
}

export default Toast;

import { useEffect, useRef, useState } from "preact/hooks";
import type { IkasNavigationLink } from "@ikas/bp-storefront";
import { Props } from "./types";

function resolveLink(link: IkasNavigationLink | null | undefined) {
  if (!link) return { href: "", label: "", openInNewTab: false };
  return {
    href: typeof link.href === "string" ? link.href.trim() : "",
    label: typeof link.label === "string" ? link.label.trim() : "",
    openInNewTab: !!link.openInNewTab,
  };
}

export function NotFound({
  eyebrow = "Error 404",
  displayNumber = "404",
  title = "Lost among the petals.",
  description = "The page you were looking for has wandered off. Perhaps it was never here, or it has since bloomed into something new. Let us guide you back.",
  primaryButton,
  secondaryButton,
  backgroundColor = "#FAF8F5",
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const primary = resolveLink(primaryButton);
  const secondary = resolveLink(secondaryButton);

  const hasEyebrow = !!eyebrow?.trim();
  const hasNumber = !!displayNumber?.trim();
  const hasTitle = !!title?.trim();
  const hasDescription = !!description?.trim();
  const hasPrimary = !!primary.label;
  const hasSecondary = !!secondary.label;
  const hasButtons = hasPrimary || hasSecondary;

  return (
    <section
      ref={sectionRef}
      class={`not-found ${isVisible ? "is-visible" : ""}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      aria-labelledby="not-found-title"
    >
      {hasNumber && (
        <span class="not-found__numeral" aria-hidden="true">
          {displayNumber}
        </span>
      )}

      <div class="not-found__container">
        <div class="not-found__content">
          {hasEyebrow && (
            <span
              class="not-found__eyebrow reveal-up"
              style={{ "--reveal-delay": "0ms" } as Record<string, string>}
            >
              <span class="not-found__eyebrow-rule" aria-hidden="true" />
              {eyebrow}
            </span>
          )}

          {hasTitle && (
            <h1
              id="not-found-title"
              class="not-found__title reveal-up"
              style={{ "--reveal-delay": "120ms" } as Record<string, string>}
            >
              {title}
            </h1>
          )}

          {hasDescription && (
            <p
              class="not-found__description reveal-up"
              style={{ "--reveal-delay": "200ms" } as Record<string, string>}
            >
              {description}
            </p>
          )}

          {hasButtons && (
            <div
              class="not-found__actions reveal-up"
              style={{ "--reveal-delay": "280ms" } as Record<string, string>}
            >
              {hasPrimary && (
                <a
                  class="not-found__btn not-found__btn--primary"
                  href={primary.href || "/"}
                  target={primary.openInNewTab ? "_blank" : undefined}
                  rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {primary.label}
                </a>
              )}
              {hasSecondary && (
                <a
                  class="not-found__btn not-found__btn--ghost"
                  href={secondary.href || "/"}
                  target={secondary.openInNewTab ? "_blank" : undefined}
                  rel={
                    secondary.openInNewTab ? "noopener noreferrer" : undefined
                  }
                >
                  {secondary.label}
                  <span class="not-found__btn-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NotFound;

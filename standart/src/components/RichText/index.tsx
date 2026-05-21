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

export function RichText({
  backgroundColor = "#FAF8F5",
  alignment = "center",
  showHeading = true,
  heading = "Başlığınızı buraya yazın",
  showText = true,
  text = "Markanızın hikayesini, kampanya detaylarını veya ürünlerinizi tanıtan bir metin buraya gelir.",
  showPrimaryButton = true,
  primaryButtonLink,
  primaryButtonStyle = "primary",
  showSecondaryButton = false,
  secondaryButtonLink,
  secondaryButtonStyle = "secondary",
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
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

  const primary = resolveLink(primaryButtonLink);
  const secondary = resolveLink(secondaryButtonLink);

  const hasHeading = !!showHeading && !!heading?.trim();
  const hasText = !!showText && !!text?.trim();
  const hasPrimary = !!showPrimaryButton && !!primary.label;
  const hasSecondary = !!showSecondaryButton && !!secondary.label;
  const hasButtons = hasPrimary || hasSecondary;

  if (!hasHeading && !hasText && !hasButtons) {
    return null;
  }

  const headingNeedsMargin = hasHeading && (hasText || hasButtons);
  const textNeedsMargin = hasText && hasButtons;

  const rootStyle = {
    "--rich-text-bg": backgroundColor,
  } as Record<string, string>;

  return (
    <section
      ref={sectionRef}
      class={`rich-text ${isVisible ? "is-visible" : ""}`}
      data-alignment={alignment}
      style={rootStyle}
    >
      <div class="rich-text-container">
        {hasHeading && (
          <h2
            class={`rich-text-heading reveal-item ${headingNeedsMargin ? "rich-text-heading--has-following" : ""}`}
            style={{ "--reveal-delay": "0ms" } as Record<string, string>}
          >
            {heading}
          </h2>
        )}

        {hasText && (
          <p
            class={`rich-text-body reveal-item ${textNeedsMargin ? "rich-text-body--has-following" : ""}`}
            style={{ "--reveal-delay": "80ms" } as Record<string, string>}
          >
            {text}
          </p>
        )}

        {hasButtons && (
          <div
            class="rich-text-actions reveal-item"
            style={{ "--reveal-delay": "160ms" } as Record<string, string>}
          >
            {hasPrimary && (
              <a
                class={`btn btn--${primaryButtonStyle}`}
                href={primary.href || "#"}
                target={primary.openInNewTab ? "_blank" : undefined}
                rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {primary.label}
              </a>
            )}
            {hasSecondary && (
              <a
                class={`btn btn--${secondaryButtonStyle}`}
                href={secondary.href || "#"}
                target={secondary.openInNewTab ? "_blank" : undefined}
                rel={secondary.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {secondary.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default RichText;

import { observer } from "@ikas/component-utils";
import type { IkasNavigationLink } from "@ikas/bp-storefront";

interface Props {
  eyebrowText: string;
  showEyebrow: boolean;
  title: string;
  description: string;
  primaryButtonLink?: IkasNavigationLink | null;
  showPrimaryButton: boolean;
  secondaryButtonLink?: IkasNavigationLink | null;
  showSecondaryButton: boolean;
}

function resolveLink(link: IkasNavigationLink | null | undefined) {
  if (!link) return { href: "", label: "", openInNewTab: false };
  return {
    href: typeof link.href === "string" ? link.href.trim() : "",
    label: typeof link.label === "string" ? link.label.trim() : "",
    openInNewTab: !!link.openInNewTab,
  };
}

const ImageWithTextPanel = observer(function ImageWithTextPanel({
  eyebrowText,
  showEyebrow,
  title,
  description,
  primaryButtonLink,
  showPrimaryButton,
  secondaryButtonLink,
  showSecondaryButton,
}: Props) {
  const primary = resolveLink(primaryButtonLink);
  const secondary = resolveLink(secondaryButtonLink);
  const hasPrimary = showPrimaryButton && !!primary.label;
  const hasSecondary = showSecondaryButton && !!secondary.label;
  const showActions = hasPrimary || hasSecondary;

  return (
    <div class="iwt-panel">
      {showEyebrow && eyebrowText && (
        <span class="iwt-panel__eyebrow">{eyebrowText}</span>
      )}
      <h2 class="iwt-panel__title">{title}</h2>
      <p class="iwt-panel__description">{description}</p>
      {showActions && (
        <div class="iwt-panel__actions">
          {hasPrimary && (
            <a
              class="iwt-panel__btn iwt-panel__btn--primary"
              href={primary.href || "#"}
              target={primary.openInNewTab ? "_blank" : undefined}
              rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {primary.label}
            </a>
          )}
          {hasSecondary && (
            <a
              class="iwt-panel__btn iwt-panel__btn--secondary"
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
  );
});

export default ImageWithTextPanel;

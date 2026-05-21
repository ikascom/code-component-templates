import { observer } from "@ikas/component-utils";
import {
  createMediaSrcset,
  getDefaultSrc,
  IkasImage,
  IkasNavigationLink,
} from "@ikas/bp-storefront";

interface Props {
  image?: IkasImage | null;
  title?: string;
  link?: IkasNavigationLink | null;
  imageAlt?: string;
  className?: string;
  delayIndex?: number;
  sizes?: string;
}

function resolveLink(link: IkasNavigationLink | null | undefined) {
  if (!link) return { href: "", label: "", openInNewTab: false };
  return {
    href: typeof link.href === "string" ? link.href.trim() : "",
    label: typeof link.label === "string" ? link.label.trim() : "",
    openInNewTab: !!link.openInNewTab,
  };
}

const MediaLinkCard = observer(function MediaLinkCard({
  image,
  title,
  link,
  imageAlt,
  className,
  delayIndex = 0,
  sizes,
}: Props) {
  const resolvedLink = resolveLink(link);
  const href = resolvedLink.href || "#";
  const accessibleLabel = title || resolvedLink.label || imageAlt || "Open link";
  const cardClass = ["media-link-card", className].filter(Boolean).join(" ");
  const cardStyle = {
    "--media-link-card-delay": `${delayIndex * 80}ms`,
  } as Record<string, string>;

  return (
    <a
      href={href}
      class={cardClass}
      aria-label={accessibleLabel}
      target={resolvedLink.openInNewTab ? "_blank" : undefined}
      rel={resolvedLink.openInNewTab ? "noopener noreferrer" : undefined}
      style={cardStyle}
    >
      <div class="media-link-card__media">
        {image ? (
          <img
            class="media-link-card__image"
            src={getDefaultSrc(image)}
            srcSet={createMediaSrcset(image)}
            sizes={sizes || "(max-width: 767px) 100vw, 50vw"}
            alt={imageAlt || ""}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div class="media-link-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div class="media-link-card__overlay" aria-hidden="true" />
      {title ? (
        <div class="media-link-card__content">
          <h3 class="media-link-card__title">{title}</h3>
        </div>
      ) : null}
    </a>
  );
});

export default MediaLinkCard;

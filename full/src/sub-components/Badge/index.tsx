import { ComponentChildren } from "preact";
import {
  IkasImage,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";

const TYPO_MAP = {
  xs: "text-xs-medium",
  s: "text-sm-medium",
  m: "text-md-medium",
  l: "text-md-medium",
} as const;

type Size = "xs" | "s" | "m" | "l";

interface BaseProps {
  size?: Size;
  selected?: boolean;
  outOfStock?: boolean;
  href?: string;
  onClick?: () => void;
  title?: string;
  "aria-label"?: string;
}

function StrikeLine() {
  return <span className="kombos-badge__strike" />;
}

/* ------------------------------------------------------------------ */
/*  BadgeImage                                                         */
/* ------------------------------------------------------------------ */

interface BadgeImageProps extends BaseProps {
  image: IkasImage;
  alt: string;
  sizes?: string;
  variantImg?: boolean;
}

export function BadgeImage({
  image,
  alt,
  sizes = "64px",
  variantImg,
  size = "s",
  selected,
  outOfStock,
  href,
  onClick,
  title,
  "aria-label": ariaLabel,
}: BadgeImageProps) {
  const className = cx(
    "kombos-badge",
    "kombos-badge--image",
    variantImg && "kombos-badge--variant-img",
    `kombos-badge--${size}`,
    selected && "kombos-badge--selected",
    outOfStock && "kombos-badge--nonstock",
  );

  const content = (
    <>
      <img
        src={getDefaultSrc(image)}
        srcSet={createMediaSrcset(image)}
        sizes={sizes}
        alt={alt}
        className="kombos-badge__img"
      />
      {outOfStock && <StrikeLine />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} title={title} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  BadgeColor                                                         */
/* ------------------------------------------------------------------ */

interface BadgeColorProps extends BaseProps {
  colorCode: string;
}

export function BadgeColor({
  colorCode,
  size = "s",
  selected,
  outOfStock,
  href,
  onClick,
  title,
  "aria-label": ariaLabel,
}: BadgeColorProps) {
  const className = cx(
    "kombos-badge",
    "kombos-badge--color",
    `kombos-badge--${size}`,
    selected && "kombos-badge--selected",
    outOfStock && "kombos-badge--nonstock",
  );

  const content = outOfStock ? <StrikeLine /> : null;

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={{ backgroundColor: colorCode }}
        title={title}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={{ backgroundColor: colorCode }}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  BadgeText                                                          */
/* ------------------------------------------------------------------ */

interface BadgeTextProps extends BaseProps {
  children: ComponentChildren;
}

export function BadgeText({
  children,
  size = "s",
  selected,
  outOfStock,
  href,
  onClick,
  title,
  "aria-label": ariaLabel,
}: BadgeTextProps) {
  const className = cx(
    "kombos-badge",
    "kombos-badge--text",
    `kombos-badge--${size}`,
    TYPO_MAP[size],
    selected && "kombos-badge--selected",
    outOfStock && "kombos-badge--nonstock",
  );

  const content = (
    <>
      {children}
      {outOfStock && <StrikeLine />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} title={title} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

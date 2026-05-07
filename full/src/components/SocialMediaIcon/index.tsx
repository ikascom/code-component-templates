import { getDefaultSrc, createMediaSrcset } from "@ikas/bp-storefront";
import { Props } from "./types";

export function SocialMediaIcon({ icon, link }: Props) {
  if (!icon) return null;

  return (
    <a
      href={link?.href}
      target={link?.openInNewTab ? "_blank" : undefined}
      rel={link?.openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={link?.label || undefined}
      className="kombos-social-media-icon"
    >
      <img
        src={getDefaultSrc(icon)}
        srcSet={createMediaSrcset(icon)}
        sizes="20px"
        alt={link?.label || ""}
        className="kombos-social-media-icon__img"
      />
    </a>
  );
}

export default SocialMediaIcon;

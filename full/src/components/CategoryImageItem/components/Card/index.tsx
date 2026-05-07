import {
  IkasImage,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { cx } from "../../../../utils/cx";

interface Props {
  img: IkasImage;
  cssClass: string;
  objectFit: string;
  aspectRatio?: string;
  overlay: boolean;
  label?: string;
  href?: string;
  openInNewTab?: boolean;
}

export default function Card({
  img,
  cssClass,
  objectFit,
  aspectRatio,
  overlay,
  label,
  href,
  openInNewTab,
}: Props) {
  const cardClass = cx("kombos-category-image-item__card", cssClass);
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? {
        href,
        target: openInNewTab ? "_blank" : undefined,
        rel: openInNewTab ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Tag className={cardClass} {...linkProps}>
      <div
        className="kombos-category-image-item__img-wrap"
        style={aspectRatio ? { aspectRatio, height: "auto" } : undefined}
      >
        <img
          className="kombos-category-image-item__img"
          src={getDefaultSrc(img)}
          srcSet={createMediaSrcset(img)}
          sizes="(max-width: 1023px) 100vw, 50vw"
          alt={label ? "" : img.altText || "Category"}
          style={{ objectFit }}
          loading="lazy"
          decoding="async"
        />
      </div>
      {overlay && <div className="kombos-category-image-item__overlay" />}
      {label && (
        <span className="kombos-category-image-item__label display-xs-semibold md:display-sm-semibold">
          {label}
        </span>
      )}
    </Tag>
  );
}

import {
  getProductVariantMainImage,
  getDefaultSrc,
  IkasProductVariant,
} from "@ikas/bp-storefront";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import type { AspectRatio, ObjectFit } from "../../global-types";
import { NoProductSVG } from "../icons";

interface Props {
  variant: IkasProductVariant | null;
  alt: string;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  wrapperClassName: string;
  mediaClassName: string;
  placeholderClassName: string;
}

export default function BundleMedia({
  variant,
  alt,
  aspectRatio,
  objectFit,
  wrapperClassName,
  mediaClassName,
  placeholderClassName,
}: Props) {
  const variantImage = variant ? getProductVariantMainImage(variant) : null;
  const imageSrc = variantImage?.image
    ? getDefaultSrc(variantImage.image)
    : null;

  const fitStyle = {
    objectFit: resolveObjectFit(objectFit) as CSSStyleDeclaration["objectFit"],
  };

  return (
    <div
      className={wrapperClassName}
      style={{ aspectRatio: resolveAspectRatio(aspectRatio) }}
    >
      {imageSrc ? (
        variantImage?.isVideo ? (
          <video
            src={imageSrc}
            className={mediaClassName}
            autoPlay
            loop
            muted
            playsInline
            style={fitStyle}
          >
            <track kind="captions" />
          </video>
        ) : (
          <img
            src={imageSrc}
            alt={alt}
            className={mediaClassName}
            loading="lazy"
            style={fitStyle}
          />
        )
      ) : (
        <div className={placeholderClassName}>
          <NoProductSVG />
        </div>
      )}
    </div>
  );
}

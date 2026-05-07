import {
  IkasImage,
  getDefaultSrc,
  createMediaSrcset,
  getFormattedFontSize,
  Router,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import {
  resolveAspectRatio,
  resolveObjectFit,
  resolveVerticalAlignment,
} from "../../utils/media";
import { cx } from "../../utils/cx";

function renderImage(params: {
  img: IkasImage;
  cssClass?: string;
  objectFit?: string;
  aspectRatio?: string;
  alt?: string;
  sizes?: string;
}) {
  const { img, cssClass, objectFit, aspectRatio, alt, sizes } = params;

  return (
    <div className={cssClass} style={aspectRatio ? { aspectRatio } : undefined}>
      <img
        className="kombos-hero-slider-item__img"
        src={getDefaultSrc(img)}
        srcSet={createMediaSrcset(img)}
        sizes={sizes}
        alt={alt}
        style={{ objectFit }}
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </div>
  );
}

export function HeroSliderItem({
  image,
  aspectRatio,
  objectFit,
  title = "",
  titleAlignment,
  textColor = "#FFFFFF",
  overlay = false,
  roundedCorners = false,
  link = null,
  buttonFontSize,
  buttonColor,
  buttonBgColor,
  buttonHoverColor,
  buttonHoverBgColor,
  mobileImage,
  mobileAspectRatio,
  mobileObjectFit,
  mobileTitle,
  mobileTextColor = "#FFFFFF",
  mobileOverlay = false,
  mobileRoundedCorners = false,
  mobileLink,
  mobileButtonFontSize,
  mobileButtonColor,
  mobileButtonBgColor,
  mobileButtonHoverColor,
  mobileButtonHoverBgColor,
  mobileTitleAlignment,
}: Props) {
  const desktopImg = image || mobileImage;
  const mobileImg = mobileImage || image;

  if (!desktopImg && !mobileImg) return null;

  const desktopFit = resolveObjectFit(objectFit);
  const mobileFit = mobileObjectFit
    ? resolveObjectFit(mobileObjectFit)
    : desktopFit;

  const desktopAR = aspectRatio ? resolveAspectRatio(aspectRatio) : undefined;
  const mobileAR = mobileAspectRatio
    ? resolveAspectRatio(mobileAspectRatio)
    : desktopAR;

  const desktopAlign = resolveVerticalAlignment(titleAlignment);
  const mobileAlign = mobileTitleAlignment
    ? resolveVerticalAlignment(mobileTitleAlignment)
    : "flex-start";

  const desktopTitle = title;
  const mobTitle = mobileTitle ?? title;

  const desktopTextColor = textColor;
  const mobTextColor = mobileTextColor ?? textColor;

  const desktopOverlay = overlay;
  const mobOverlay = mobileOverlay;

  // Mobile button falls back to desktop values
  const mobLink = mobileLink ?? link;
  const mobBtnFontSize = mobileButtonFontSize ?? buttonFontSize;
  const mobBtnColor = mobileButtonColor ?? buttonColor;
  const mobBtnBgColor = mobileButtonBgColor ?? buttonBgColor;
  const mobBtnHoverColor = mobileButtonHoverColor ?? buttonHoverColor;
  const mobBtnHoverBgColor = mobileButtonHoverBgColor ?? buttonHoverBgColor;

  const rootClass = cx(
    "kombos-hero-slider-item",
    roundedCorners && "kombos-hero-slider-item--rounded",
    mobileRoundedCorners && "kombos-hero-slider-item--mobile-rounded",
  );

  const handleDesktopClick = () => {
    if (!link) return;
    Router.navigate(link.href || "/", false, link.openInNewTab ?? false);
  };

  const handleMobileClick = () => {
    if (!mobLink) return;
    Router.navigate(mobLink.href || "/", false, mobLink.openInNewTab ?? false);
  };

  const formattedDesktopFontSize = getFormattedFontSize(buttonFontSize);
  const formattedMobileFontSize = getFormattedFontSize(mobBtnFontSize);

  const desktopBtnStyle = {
    ...(formattedDesktopFontSize ? { fontSize: formattedDesktopFontSize } : {}),
    ...(buttonColor ? { "--btn-color": buttonColor } : {}),
    ...(buttonBgColor ? { "--btn-bg": buttonBgColor } : {}),
    ...(buttonHoverColor ? { "--btn-hover-color": buttonHoverColor } : {}),
    ...(buttonHoverBgColor ? { "--btn-hover-bg": buttonHoverBgColor } : {}),
  };

  const mobileBtnStyle = {
    ...(formattedMobileFontSize ? { fontSize: formattedMobileFontSize } : {}),
    ...(mobBtnColor ? { "--btn-color": mobBtnColor } : {}),
    ...(mobBtnBgColor ? { "--btn-bg": mobBtnBgColor } : {}),
    ...(mobBtnHoverColor ? { "--btn-hover-color": mobBtnHoverColor } : {}),
    ...(mobBtnHoverBgColor ? { "--btn-hover-bg": mobBtnHoverBgColor } : {}),
  };

  return (
    <div className={rootClass}>
      {/* Desktop image */}
      {desktopImg &&
        renderImage({
          img: desktopImg,
          cssClass:
            "kombos-hero-slider-item__img-wrap kombos-hero-slider-item__img-wrap--desktop",
          objectFit: desktopFit,
          aspectRatio: desktopAR,
          alt: desktopImg?.altText ?? title,
          sizes: "(min-width: 1024px) 100vw, 1px",
        })}
      {/* Mobile image */}
      {mobileImg &&
        renderImage({
          img: mobileImg,
          cssClass:
            "kombos-hero-slider-item__img-wrap kombos-hero-slider-item__img-wrap--mobile",
          objectFit: mobileFit,
          aspectRatio: mobileAR,
          alt: mobileImg?.altText ?? mobTitle,
          sizes: "(max-width: 1023px) 100vw, 1px",
        })}
      {/* Desktop overlay */}
      {desktopOverlay && (
        <div className="kombos-hero-slider-item__overlay kombos-hero-slider-item__overlay--desktop" />
      )}
      {/* Mobile overlay */}
      {mobOverlay && (
        <div className="kombos-hero-slider-item__overlay kombos-hero-slider-item__overlay--mobile" />
      )}
      {/* Desktop content */}
      <div
        className="kombos-hero-slider-item__content kombos-hero-slider-item__content--desktop"
        style={{
          "--slide-justify": desktopAlign,
          ...(desktopTextColor ? { color: desktopTextColor } : {}),
        }}
      >
        {desktopTitle && (
          <div
            className="kombos-hero-slider-item__title display-md-medium md:display-lg-medium"
            dangerouslySetInnerHTML={{ __html: desktopTitle }}
          />
        )}
        {link && link.label && (
          <button
            type="button"
            className="kombos-hero-slider-item__cta"
            style={desktopBtnStyle}
            onClick={handleDesktopClick}
          >
            {link.label}
          </button>
        )}
      </div>
      {/* Mobile content */}
      <div
        className="kombos-hero-slider-item__content kombos-hero-slider-item__content--mobile"
        style={{
          "--slide-justify": mobileAlign,
          ...(mobTextColor ? { color: mobTextColor } : {}),
        }}
      >
        {mobTitle && (
          <div
            className="kombos-hero-slider-item__title display-xs-semibold md:display-sm-semibold"
            dangerouslySetInnerHTML={{ __html: mobTitle }}
          />
        )}
        {mobLink && mobLink.label && (
          <button
            type="button"
            className="kombos-hero-slider-item__cta"
            style={mobileBtnStyle}
            onClick={handleMobileClick}
          >
            {mobLink.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default HeroSliderItem;

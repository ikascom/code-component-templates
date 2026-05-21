import { createMediaSrcset, getDefaultSrc } from "@ikas/bp-storefront";
import { Props } from "./types";
import ImageWithTextPanel from "../../sub-components/ImageWithTextPanel";

export function ImageWithText({
  eyebrowText = "",
  showEyebrow = false,
  title,
  description,
  primaryButtonLink,
  showPrimaryButton = true,
  secondaryButtonLink,
  showSecondaryButton = false,
  image,
  imageAlt,
  imagePosition = "left",
  sectionWidth = "contained",
  imageAspectRatio = "4/3",
  backgroundColor = "#FAF8F5",
  textColor = "#1C1917",
  descriptionColor = "#6B6560",
  eyebrowColor = "#C9A882",
  accentColor = "#C9A882",
  imageAriaLabel = "Editorial image",
}: Props) {
  const isFullWidth = sectionWidth === "full-width";
  const isImageRight = imagePosition === "right";

  const sectionStyle = {
    backgroundColor,
    "--iwt-text-color": textColor,
    "--iwt-description-color": descriptionColor,
    "--iwt-eyebrow-color": eyebrowColor,
    "--iwt-accent-color": accentColor,
    "--iwt-image-aspect-ratio": imageAspectRatio,
  } as Record<string, string>;

  const sectionClass = [
    "image-with-text",
    isImageRight ? "image-with-text--image-right" : "",
    isFullWidth ? "image-with-text--full-width" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageNode = image ? (
    <img
      class="image-with-text__image"
      src={getDefaultSrc(image)}
      srcSet={createMediaSrcset(image)}
      sizes={isFullWidth ? "50vw" : "(max-width: 767px) 100vw, 50vw"}
      alt={imageAlt}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <div class="image-with-text__image-placeholder" aria-hidden="true" />
  );

  const grid = (
    <div class="image-with-text__grid">
      <div
        class="image-with-text__media"
        role="img"
        aria-label={imageAriaLabel}
      >
        {imageNode}
      </div>
      <div class="image-with-text__panel">
        <ImageWithTextPanel
          eyebrowText={eyebrowText}
          showEyebrow={showEyebrow}
          title={title}
          description={description}
          primaryButtonLink={primaryButtonLink}
          showPrimaryButton={showPrimaryButton}
          secondaryButtonLink={secondaryButtonLink}
          showSecondaryButton={showSecondaryButton}
        />
      </div>
    </div>
  );

  return (
    <section class={sectionClass} style={sectionStyle}>
      {isFullWidth ? grid : <div class="image-with-text__container">{grid}</div>}
    </section>
  );
}

export default ImageWithText;

import { useEffect, useRef, useState } from "preact/hooks";
import { getDefaultSrc, createMediaSrcset, getSrc } from "@ikas/bp-storefront";
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

export function HeroSlide({
  mediaType = "image",
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.30,
  overlayDirection = "bottom-up",
  contentAlignment = "center",
  contentPosition = "center",
  eyebrowText,
  heading,
  subtext,
  primaryButtonLink,
  showPrimaryButton = true,
  secondaryButtonLink,
  showSecondaryButton = false,
}: Props) {
  const primary = resolveLink(primaryButtonLink);
  const secondary = resolveLink(secondaryButtonLink);
  const hasPrimary = showPrimaryButton && !!primary.label;
  const hasSecondary = showSecondaryButton && !!secondary.label;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const videoSrc = backgroundVideo?.videoSrc ?? null;
  const videoAutoplay = !!backgroundVideo?.autoplay;
  const videoLoop = !!backgroundVideo?.loop;
  const videoMuted = backgroundVideo?.muted ?? true;
  const videoControls = !!backgroundVideo?.controls;
  const videoPoster = backgroundVideo?.thumbnailImage ?? null;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion || !videoAutoplay) {
      v.pause();
      v.removeAttribute("autoplay");
    } else {
      v.play().catch(() => {});
    }
  }, [reducedMotion, mediaType, videoSrc, videoAutoplay]);

  const slideStyle = {
    "--hero-slide-overlay-opacity": String(overlayOpacity ?? 0.30),
  } as Record<string, string>;

  const renderMedia = () => {
    if (mediaType === "video" && videoSrc) {
      const posterSrc = videoPoster ? getSrc(videoPoster, 1920) : undefined;
      const shouldAutoplay = videoAutoplay && !reducedMotion;
      return (
        <video
          ref={videoRef}
          class="hero-slide-media hero-slide-media--video"
          src={videoSrc}
          poster={posterSrc}
          autoPlay={shouldAutoplay}
          muted={videoMuted || shouldAutoplay}
          loop={videoLoop}
          controls={videoControls}
          playsInline
          preload="metadata"
          aria-hidden={videoControls ? undefined : "true"}
        />
      );
    }

    if (backgroundImage) {
      return (
        <img
          class="hero-slide-media hero-slide-media--image"
          src={getDefaultSrc(backgroundImage)}
          srcSet={createMediaSrcset(backgroundImage)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
      );
    }

    return null;
  };

  const hasMedia = (mediaType === "video" && !!videoSrc) || (mediaType === "image" && !!backgroundImage);

  return (
    <div
      class={`hero-slide hero-slide--align-${contentAlignment} hero-slide--position-${contentPosition} hero-slide--overlay-${overlayDirection}`}
      style={slideStyle}
      data-has-media={hasMedia ? "true" : "false"}
    >
      <div class="hero-slide-bg">
        {renderMedia()}
      </div>

      <div class={`hero-slide-overlay hero-slide-overlay--${overlayDirection}`} aria-hidden="true" />

      <div class="hero-slide-content-wrap">
        <div class="hero-slide-content">
          {eyebrowText && <span class="hero-slide-eyebrow">{eyebrowText}</span>}
          <h2 class="hero-slide-heading">{heading}</h2>
          {subtext && <p class="hero-slide-subtext">{subtext}</p>}
          {(hasPrimary || hasSecondary) && (
            <div class="hero-slide-actions">
              {hasPrimary && (
                <a
                  class="hero-slide-btn hero-slide-btn--primary"
                  href={primary.href || "#"}
                  target={primary.openInNewTab ? "_blank" : undefined}
                  rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {primary.label}
                </a>
              )}
              {hasSecondary && (
                <a
                  class="hero-slide-btn hero-slide-btn--secondary"
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
      </div>
    </div>
  );
}

export default HeroSlide;

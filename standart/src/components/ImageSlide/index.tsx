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

export function ImageSlide({
  mediaType = "image",
  backgroundImage,
  backgroundVideo,
  link,
  imageAltText = "",
  objectFit = "cover",
}: Props) {
  const resolved = resolveLink(link);
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

  const renderMedia = () => {
    if (mediaType === "video" && videoSrc) {
      const posterSrc = videoPoster ? getSrc(videoPoster, 1920) : undefined;
      const shouldAutoplay = videoAutoplay && !reducedMotion;
      return (
        <video
          ref={videoRef}
          class="image-slide-media image-slide-media--video"
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
          class="image-slide-media image-slide-media--image"
          src={getDefaultSrc(backgroundImage)}
          srcSet={createMediaSrcset(backgroundImage)}
          sizes="100vw"
          alt={imageAltText}
          loading="lazy"
          decoding="async"
        />
      );
    }

    return null;
  };

  const hasLink = !!resolved.href;
  const baseClass = `image-slide image-slide--fit-${objectFit}${hasLink ? " image-slide--has-link" : ""}`;
  const accessibleLabel = resolved.label || imageAltText || undefined;

  if (hasLink) {
    return (
      <a
        class={baseClass}
        href={resolved.href}
        target={resolved.openInNewTab ? "_blank" : undefined}
        rel={resolved.openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={accessibleLabel}
      >
        {renderMedia()}
      </a>
    );
  }

  return <div class={baseClass}>{renderMedia()}</div>;
}

export default ImageSlide;

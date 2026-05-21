import { useEffect, useRef, useState } from "preact/hooks";
import { getDefaultSrc, createMediaSrcset, getSrc } from "@ikas/bp-storefront";
import type { IkasNavigationLink } from "@ikas/bp-storefront";
import { Props } from "./types";
import ScrollIndicator from "../../sub-components/ScrollIndicator";

const PARALLAX_FACTOR = 0.4;
const DESKTOP_BREAKPOINT = 1024;

function resolveLink(link: IkasNavigationLink | null | undefined) {
  if (!link) return { href: "", label: "", openInNewTab: false };
  return {
    href: typeof link.href === "string" ? link.href.trim() : "",
    label: typeof link.label === "string" ? link.label.trim() : "",
    openInNewTab: !!link.openInNewTab,
  };
}

export function SingleHero({
  backgroundColor = "#1C1917",
  mediaType = "image",
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.30,
  overlayDirection = "bottom-up",
  sectionHeight = "100vh",
  contentAlignment = "center",
  contentPosition = "center",
  eyebrowText,
  heading,
  subtext,
  primaryButtonLink,
  showPrimaryButton = true,
  secondaryButtonLink,
  showSecondaryButton = false,
  showScrollIndicator = true,
  tuckUnderHeader = false,
}: Props) {
  const primary = resolveLink(primaryButtonLink);
  const secondary = resolveLink(secondaryButtonLink);
  const hasPrimary = showPrimaryButton && !!primary.label;
  const hasSecondary = showSecondaryButton && !!secondary.label;
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;
    if (window.innerWidth < DESKTOP_BREAKPOINT) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const section = sectionRef.current;
        const bg = bgRef.current;
        if (!section || !bg) return;
        const rect = section.getBoundingClientRect();
        const offset = -rect.top * PARALLAX_FACTOR;
        bg.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (bgRef.current) bgRef.current.style.transform = "";
    };
  }, [reducedMotion]);

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

  const handleScrollDown = () => {
    const section = sectionRef.current;
    if (!section) return;
    const next = section.nextElementSibling as HTMLElement | null;
    const top = next ? next.getBoundingClientRect().top + window.scrollY : section.offsetHeight;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const sectionStyle = {
    backgroundColor: backgroundColor || undefined,
    "--hero-overlay-opacity": String(overlayOpacity ?? 0.30),
    "--hero-section-height": sectionHeight,
  } as Record<string, string>;

  const renderMedia = () => {
    if (mediaType === "video" && videoSrc) {
      const posterSrc = videoPoster ? getSrc(videoPoster, 1920) : undefined;
      const shouldAutoplay = videoAutoplay && !reducedMotion;
      return (
        <video
          ref={videoRef}
          class="hero-media hero-media--video"
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
          class="hero-media hero-media--image"
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
    <section
      ref={sectionRef}
      class={`hero hero--align-${contentAlignment} hero--position-${contentPosition} hero--height-${sectionHeight} hero--overlay-${overlayDirection}${tuckUnderHeader ? " hero--tuck-under" : ""}`}
      style={sectionStyle}
      data-has-media={hasMedia ? "true" : "false"}
    >
      <div ref={bgRef} class="hero-bg">
        {renderMedia()}
      </div>

      <div class={`hero-overlay hero-overlay--${overlayDirection}`} aria-hidden="true" />

      <div class="hero-content-wrap">
        <div class="hero-content">
          {eyebrowText && <span class="hero-eyebrow">{eyebrowText}</span>}
          <h1 class="hero-heading">{heading}</h1>
          {subtext && <p class="hero-subtext">{subtext}</p>}
          {(hasPrimary || hasSecondary) && (
            <div class="hero-actions">
              {hasPrimary && (
                <a
                  class="hero-btn hero-btn--primary"
                  href={primary.href || "#"}
                  target={primary.openInNewTab ? "_blank" : undefined}
                  rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {primary.label}
                </a>
              )}
              {hasSecondary && (
                <a
                  class="hero-btn hero-btn--secondary"
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

      {showScrollIndicator && (
        <ScrollIndicator onClick={handleScrollDown} label="Scroll down" />
      )}
    </section>
  );
}

export default SingleHero;

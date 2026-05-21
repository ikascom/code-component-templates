import { useEffect, useRef, useState } from "preact/hooks";
import { IkasComponentRenderer } from "@ikas/bp-storefront";
import { Props } from "./types";
import ScrollIndicator from "../../sub-components/ScrollIndicator";

export function HeroSlider(props: Props) {
  const {
    backgroundColor = "#1C1917",
    sectionHeight = "100vh",
    slides,
    autoplay = true,
    autoplayInterval = 6,
    pauseOnHover = true,
    loop = true,
    showArrows = true,
    showDots = true,
    showScrollIndicator = true,
    prevButtonLabel = "Previous slide",
    nextButtonLabel = "Next slide",
    slideDotLabel = "Go to slide",
    tuckUnderHeader = false,
  } = props;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesArray = (slides as any[] | undefined) ?? [];
  const total = slidesArray.length;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (total > 0 && activeIndex >= total) setActiveIndex(0);
  }, [total]);

  const goTo = (i: number) => {
    if (total === 0) return;
    const next = loop
      ? ((i % total) + total) % total
      : Math.max(0, Math.min(total - 1, i));
    setActiveIndex(next);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  useEffect(() => {
    if (!autoplay || reducedMotion || total <= 1 || isPaused) return;
    const seconds = Math.max(1, autoplayInterval ?? 6);
    const id = window.setTimeout(() => {
      const next = loop
        ? (activeIndex + 1) % total
        : Math.min(total - 1, activeIndex + 1);
      setActiveIndex(next);
    }, seconds * 1000);
    return () => window.clearTimeout(id);
  }, [activeIndex, autoplay, autoplayInterval, reducedMotion, total, isPaused, loop]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (total <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    const onFocusIn = () => setIsPaused(true);
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (!next || !el.contains(next)) setIsPaused(false);
    };
    el.addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [activeIndex, total, loop]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrev();
      else goNext();
    }
  };

  const handleScrollDown = () => {
    const section = sectionRef.current;
    if (!section) return;
    const next = section.nextElementSibling as HTMLElement | null;
    const top = next ? next.getBoundingClientRect().top + window.scrollY : section.offsetHeight;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const sectionStyle = {
    backgroundColor: backgroundColor || undefined,
    "--hero-slider-section-height": sectionHeight,
  } as Record<string, string>;

  const onMouseEnter = () => { if (pauseOnHover) setIsPaused(true); };
  const onMouseLeave = () => { if (pauseOnHover) setIsPaused(false); };

  return (
    <section
      ref={sectionRef}
      class={`hero-slider hero-slider--height-${sectionHeight}${tuckUnderHeader ? " hero-slider--tuck-under" : ""}`}
      style={sectionStyle}
      tabIndex={0}
      aria-roledescription="carousel"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div class="hero-slider-track" aria-live="polite">
        {slidesArray.map((slide, i) => (
          <div
            key={i}
            class={`hero-slider-slot${i === activeIndex ? " is-active" : ""}`}
            aria-hidden={i === activeIndex ? "false" : "true"}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
          >
            <IkasComponentRenderer
              id={`hero-slider-slide-${i}`}
              components={[slide] as any[]}
              parentProps={props}
            />
          </div>
        ))}
      </div>

      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            class="hero-slider-arrow hero-slider-arrow--prev"
            onClick={goPrev}
            aria-label={prevButtonLabel}
            disabled={!loop && activeIndex === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            class="hero-slider-arrow hero-slider-arrow--next"
            onClick={goNext}
            aria-label={nextButtonLabel}
            disabled={!loop && activeIndex === total - 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {showDots && total > 1 && (
        <div class="hero-slider-dots" role="tablist">
          {slidesArray.map((_, i) => (
            <button
              key={i}
              type="button"
              class={`hero-slider-dot${i === activeIndex ? " is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`${slideDotLabel} ${i + 1}`}
              aria-selected={i === activeIndex ? "true" : "false"}
              role="tab"
            />
          ))}
        </div>
      )}

      {showScrollIndicator && (
        <ScrollIndicator onClick={handleScrollDown} label="Scroll down" />
      )}
    </section>
  );
}

export default HeroSlider;

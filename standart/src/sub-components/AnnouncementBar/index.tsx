import { useState, useEffect, useRef, useId } from "preact/hooks";
import { IkasNavigationLink } from "@ikas/bp-storefront";

interface Announcement {
  text: string;
  link?: IkasNavigationLink | null;
  backgroundColor: string;
  textColor: string;
}

interface Props {
  announcement1Text: string;
  announcement1Link?: IkasNavigationLink | null;
  announcement1BackgroundColor: string;
  announcement1TextColor: string;
  announcement2Text: string;
  announcement2Link?: IkasNavigationLink | null;
  announcement2BackgroundColor: string;
  announcement2TextColor: string;
  autoPlay: boolean;
  autoPlayInterval: number;
  prevAriaLabel: string;
  nextAriaLabel: string;
  barAriaLabel: string;
}

const TRANSITION_MS = 400;
const SWIPE_THRESHOLD = 50;

type Direction = "next" | "prev";

export default function AnnouncementBar({
  announcement1Text,
  announcement1Link,
  announcement1BackgroundColor,
  announcement1TextColor,
  announcement2Text,
  announcement2Link,
  announcement2BackgroundColor,
  announcement2TextColor,
  autoPlay,
  autoPlayInterval,
  prevAriaLabel,
  nextAriaLabel,
  barAriaLabel,
}: Props) {
  if (!announcement1Text) return null;

  const announcements: Announcement[] = [
    {
      text: announcement1Text,
      link: announcement1Link,
      backgroundColor: announcement1BackgroundColor,
      textColor: announcement1TextColor,
    },
    ...(announcement2Text
      ? [
          {
            text: announcement2Text,
            link: announcement2Link,
            backgroundColor: announcement2BackgroundColor,
            textColor: announcement2TextColor,
          },
        ]
      : []),
  ];

  const isCarousel = announcements.length > 1;
  const containerId = useId();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const goTo = (next: number, dir: Direction) => {
    if (isAnimating || next === activeIndex) return;
    setDirection(dir);
    setIsAnimating(true);
    setActiveIndex(next);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_MS);
  };

  const handleNext = () => {
    if (!isCarousel) return;
    goTo((activeIndex + 1) % announcements.length, "next");
  };

  const handlePrev = () => {
    if (!isCarousel) return;
    goTo(
      (activeIndex - 1 + announcements.length) % announcements.length,
      "prev"
    );
  };

  useEffect(() => {
    if (!isCarousel || !autoPlay || paused) return;
    intervalRef.current = setInterval(() => {
      setDirection("next");
      setIsAnimating(true);
      setActiveIndex((prev) => (prev + 1) % announcements.length);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, TRANSITION_MS);
    }, Math.max(1000, autoPlayInterval));
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCarousel, autoPlay, paused, autoPlayInterval, announcements.length, activeIndex]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX == null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) handleNext();
    else handlePrev();
  };

  const current = announcements[activeIndex];
  const slideClass = isAnimating
    ? direction === "next"
      ? "announcement-bar-text--slide-next"
      : "announcement-bar-text--slide-prev"
    : "";

  const renderText = (item: Announcement) => {
    const href = item.link?.href;
    if (href) {
      return (
        <a
          class="announcement-bar-link"
          href={href}
          target={item.link?.openInNewTab ? "_blank" : undefined}
          rel={item.link?.openInNewTab ? "noopener noreferrer" : undefined}
          style={{ color: item.textColor }}
        >
          {item.text}
        </a>
      );
    }
    return item.text;
  };

  return (
    <div
      class={`announcement-bar${isCarousel ? " announcement-bar--carousel" : ""}`}
      role="region"
      aria-label={barAriaLabel}
      style={{ backgroundColor: current.backgroundColor, color: current.textColor }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={isCarousel ? handleTouchStart : undefined}
      onTouchEnd={isCarousel ? handleTouchEnd : undefined}
    >
      {isCarousel && (
        <button
          type="button"
          class="announcement-bar-arrow announcement-bar-arrow--prev"
          onClick={handlePrev}
          aria-label={prevAriaLabel}
          aria-controls={containerId}
          style={{ color: current.textColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div
        id={containerId}
        class={`announcement-bar-text ${slideClass}`}
        aria-live="polite"
      >
        {renderText(current)}
      </div>

      {isCarousel && (
        <button
          type="button"
          class="announcement-bar-arrow announcement-bar-arrow--next"
          onClick={handleNext}
          aria-label={nextAriaLabel}
          aria-controls={containerId}
          style={{ color: current.textColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Props } from "./types";
import BlogCard from "../../sub-components/BlogCard";

export function BlogSlider(props: Props) {
  const {
    blogList,
    sectionTitle = "From the Journal",
    showSectionTitle = true,
    viewAllLabel = "View All",
    viewAllUrl = "/blog",
    showViewAll = true,
    emptyStateText = "Stories are on the way.",
    prevAriaLabel = "Previous post",
    nextAriaLabel = "Next post",
    sliderAriaLabel = "Blog post slider",
    backgroundColor,
    cardAspectRatio = "1/1",
  } = props;

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [revealed, setRevealed] = useState(false);

  const blogs = useMemo(() => {
    const data = blogList?.data ?? [];
    return [...data].sort((a, b) => {
      const aDate = a.publishedAt ?? a.createdAt ?? 0;
      const bDate = b.publishedAt ?? b.createdAt ?? 0;
      return bDate - aDate;
    });
  }, [blogList?.data]);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, blogs.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const sectionStyle = backgroundColor ? { backgroundColor } : undefined;

  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= maxIndex;

  const translatePercent =
    visibleCount > 0 ? -(currentIndex * (100 / visibleCount)) : 0;

  const trackStyle = {
    transform: `translateX(${translatePercent}%)`,
    "--blog-slider-visible": String(visibleCount),
  } as Record<string, string>;

  return (
    <section
      class="blog-slider"
      style={sectionStyle}
      ref={sectionRef}
      data-revealed={revealed ? "true" : "false"}
    >
      <div class="blog-slider-inner">
        {(showSectionTitle || showViewAll) && (
          <div class="blog-slider-header">
            {showSectionTitle && sectionTitle && (
              <h2 class="blog-slider-title">{sectionTitle}</h2>
            )}
            {showViewAll && viewAllLabel && viewAllUrl && (
              <a class="blog-slider-view-all" href={viewAllUrl}>
                <span>{viewAllLabel}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            )}
          </div>
        )}

        {blogs.length === 0 ? (
          <p class="blog-slider-empty">{emptyStateText}</p>
        ) : (
          <div
            class="blog-slider-viewport"
            role="region"
            aria-label={sliderAriaLabel}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              class="blog-slider-arrow blog-slider-arrow--prev"
              onClick={goPrev}
              aria-label={prevAriaLabel}
              aria-disabled={atStart ? "true" : "false"}
              disabled={atStart}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div class="blog-slider-track-wrap">
              <div class="blog-slider-track" ref={trackRef} style={trackStyle}>
                {blogs.map((blog, i) => (
                  <div
                    class="blog-slider-slide"
                    key={blog.id}
                    style={{
                      ["--blog-slide-delay" as any]: `${i * 80}ms`,
                    }}
                  >
                    <BlogCard blog={blog} aspectRatio={cardAspectRatio} />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              class="blog-slider-arrow blog-slider-arrow--next"
              onClick={goNext}
              aria-label={nextAriaLabel}
              aria-disabled={atEnd ? "true" : "false"}
              disabled={atEnd}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogSlider;

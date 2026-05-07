import {
  createMediaSrcset,
  getDefaultSrc,
  getThumbnailSrc,
  IkasImage,
} from "@ikas/bp-storefront";
import { useRef, useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { cx } from "../../../../utils/cx";
import { NoProductSVG, PlaySVG } from "../../../../sub-components/icons";
import SliderArrow from "../../../../sub-components/SliderArrow";
import { resolveAspectRatio, resolveObjectFit } from "../../../../utils/media";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

const SETTLE_DELAY = 100;
const DRAG_THRESHOLD_RATIO = 0.15;
const SNAP_DURATION = 300;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

interface Props {
  images: IkasImage[];
  productName: string;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

export default function ProductGallery({
  images,
  productName,
  aspectRatio,
  objectFit,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const mainWrapRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const isProgrammaticRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const animFrameRef = useRef(0);

  const hasMultiple = images.length > 1;
  const resolvedAR = resolveAspectRatio(aspectRatio);
  const resolvedOF = resolveObjectFit(objectFit);

  const imageStyle = useMemo(() => ({ objectFit: resolvedOF as CSSStyleDeclaration["objectFit"] }), [resolvedOF]);
  const thumbStyle = useMemo(() => ({ aspectRatio: resolvedAR }), [resolvedAR]);

  // Sync thumbnail column height with main image
  useEffect(() => {
    if (!hasMultiple) return;
    const syncHeight = () => {
      const wrap = mainWrapRef.current;
      const thumbs = thumbsRef.current;
      if (wrap && thumbs) {
        thumbs.style.maxHeight = `${wrap.offsetHeight}px`;
      }
    };
    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [hasMultiple, aspectRatio]);

  // Auto-play/pause videos based on selected slide
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.children;
    for (let i = 0; i < slides.length; i++) {
      const video = slides[i].querySelector("video");
      if (!video) continue;
      if (i === selectedIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [selectedIndex]);

  const scrollThumbIntoView = useCallback((index: number) => {
    const thumb = thumbsRef.current?.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const smoothScrollTo = useCallback((track: HTMLElement, target: number) => {
    cancelAnimationFrame(animFrameRef.current);
    const start = track.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) {
      track.scrollLeft = target;
      track.style.scrollSnapType = "x mandatory";
      isProgrammaticRef.current = false;
      return;
    }
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / SNAP_DURATION, 1);
      track.scrollLeft = start + distance * easeInOutCubic(elapsed);
      if (elapsed < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        track.style.scrollSnapType = "x mandatory";
        isProgrammaticRef.current = false;
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  const goToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    isProgrammaticRef.current = true;
    clearTimeout(settleTimerRef.current);
    const slide = track.children[index] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
    setSelectedIndex(index);
    scrollThumbIntoView(index);
  }, [scrollThumbIntoView]);

  const handlePrev = useCallback(() => {
    goToSlide(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  }, [goToSlide, selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    goToSlide(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  }, [goToSlide, selectedIndex, images.length]);

  const handleScroll = useCallback(() => {
    clearTimeout(settleTimerRef.current);
    if (isProgrammaticRef.current) {
      settleTimerRef.current = setTimeout(() => {
        isProgrammaticRef.current = false;
      }, SETTLE_DELAY);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const newIndex = Math.round(track.scrollLeft / track.clientWidth);
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedIndex(newIndex);
    }
  }, [images.length]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(animFrameRef.current);
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragScrollLeftRef.current = track.scrollLeft;
    track.style.scrollSnapType = "none";
    track.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = dragScrollLeftRef.current - (e.pageX - dragStartXRef.current);
  }, []);

  const handleMouseEnd = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const track = trackRef.current;
    if (!track) return;
    track.style.cursor = "";

    const dragDelta = dragStartXRef.current - e.pageX;
    const threshold = track.clientWidth * DRAG_THRESHOLD_RATIO;
    let targetIndex = Math.round(dragScrollLeftRef.current / track.clientWidth);
    if (dragDelta > threshold) targetIndex++;
    else if (dragDelta < -threshold) targetIndex--;
    const clamped = Math.max(0, Math.min(targetIndex, images.length - 1));

    isProgrammaticRef.current = true;
    setSelectedIndex(clamped);
    smoothScrollTo(track, track.clientWidth * clamped);
    scrollThumbIntoView(clamped);
  }, [images.length, smoothScrollTo, scrollThumbIntoView]);

  return (
    <div className="kombos-pd__gallery">
      {hasMultiple && (
        <div className="kombos-pd__thumbs" ref={thumbsRef}>
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              className={cx("kombos-pd__thumb", i === selectedIndex && "kombos-pd__thumb--active")}
              onClick={() => goToSlide(i)}
              style={thumbStyle}
            >
              {img.isVideo ? (
                <div className="kombos-pd__thumb-video">
                  <video
                    src={getDefaultSrc(img)}
                    className="kombos-pd__thumb-img"
                    style={imageStyle}
                    muted
                    preload="metadata"
                  >
                    <track kind="captions" />
                  </video>
                  <span className="kombos-pd__thumb-play">
                    <PlaySVG />
                  </span>
                </div>
              ) : (
                <img
                  src={getThumbnailSrc(img)}
                  srcSet={createMediaSrcset(img)}
                  sizes="112px"
                  alt={`${productName} ${i + 1}`}
                  className="kombos-pd__thumb-img"
                  style={imageStyle}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="kombos-pd__main-col">
        <div
          className="kombos-pd__main-image-wrap"
          ref={mainWrapRef}
          style={{ aspectRatio: resolvedAR }}
        >
          <div
            className="kombos-pd__track"
            ref={trackRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseEnd}
            onMouseLeave={handleMouseEnd}
          >
            {images.length > 0 ? (
              images.map((img, i) => (
                <div key={img.id || i} className="kombos-pd__slide">
                  {img.isVideo ? (
                    <video
                      className="kombos-pd__main-image kombos-pd__main-video"
                      src={getDefaultSrc(img)}
                      loop
                      muted
                      playsInline
                      style={imageStyle}
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <img
                      className="kombos-pd__main-image"
                      src={getDefaultSrc(img)}
                      srcSet={createMediaSrcset(img)}
                      sizes="(max-width: 1023px) 100vw, min(calc((100vw - 440px) / 2), 530px)"
                      alt={img?.altText || `${productName} ${i + 1}`}
                      style={imageStyle}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchpriority={i === 0 ? "high" : undefined}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="kombos-pd__slide">
                <div className="kombos-pd__main-image kombos-pd__main-image--placeholder">
                  <NoProductSVG />
                </div>
              </div>
            )}
          </div>

          {hasMultiple && (
            <>
              <SliderArrow
                direction="left"
                className="kombos-pd__arrow kombos-pd__arrow--prev"
                onClick={handlePrev}
              />
              <SliderArrow
                direction="right"
                className="kombos-pd__arrow kombos-pd__arrow--next"
                onClick={handleNext}
              />
            </>
          )}

          {hasMultiple && (
            <div className="kombos-pd__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cx("kombos-pd__dot", i === selectedIndex && "kombos-pd__dot--active")}
                  onClick={() => goToSlide(i)}
                  aria-label={`${images[i]?.isVideo ? "Video" : "Image"} ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

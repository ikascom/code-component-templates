import { observer } from "@ikas/component-utils";
import { useEffect, useRef } from "preact/hooks";
import {
  createMediaSrcset,
  getDefaultSrc,
  getThumbnailSrc,
} from "@ikas/bp-storefront";
import type { IkasImage } from "@ikas/bp-storefront";
import type {
  PdpGalleryView,
  PdpThumbnailPosition,
  SliderAspectRatio,
} from "../../global-types";

interface Props {
  images: IkasImage[];
  productName: string;
  galleryStyle: PdpGalleryView;
  aspectRatio: SliderAspectRatio;
  showThumbnails: boolean;
  thumbnailPosition: PdpThumbnailPosition;
  activeIndex: number;
  onSelect: (index: number) => void;
}

const altFor = (img: IkasImage, fallback: string) =>
  img.altText?.trim() || img.fileName?.trim() || fallback;

const ProductGallery = observer(function ProductGallery({
  images,
  productName,
  galleryStyle,
  aspectRatio,
  showThumbnails,
  thumbnailPosition,
  activeIndex,
  onSelect,
}: Props) {
  const ratio = aspectRatio === "1/1" ? "1 / 1" : "3 / 4";
  const itemStyle = { aspectRatio: ratio };

  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const isScrollDrivenRef = useRef(false);
  const safeIndexRef = useRef(0);
  const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(images.length - 1, 0));
  safeIndexRef.current = safeIndex;

  // Scroll the main track to the active slide when activeIndex changes from outside
  // (e.g. thumbnail click). Skip when the change came from the user's own scroll —
  // otherwise we'd kick off a second animation on top of the native snap.
  useEffect(() => {
    if (isScrollDrivenRef.current) {
      isScrollDrivenRef.current = false;
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[safeIndex] as HTMLElement | undefined;
    if (!slide) return;
    if (Math.abs(track.scrollLeft - slide.offsetLeft) > 2) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  }, [safeIndex]);

  // Keep the active thumbnail visible
  useEffect(() => {
    const thumbs = thumbsRef.current;
    if (!thumbs) return;
    const thumb = thumbs.children[safeIndex] as HTMLElement | undefined;
    if (!thumb) return;
    const target = thumb.offsetLeft - (thumbs.clientWidth - thumb.clientWidth) / 2;
    if (Math.abs(thumbs.scrollLeft - target) > 2) {
      thumbs.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [safeIndex]);

  // Sync activeIndex with the slide currently in view; pause off-screen videos
  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length <= 1) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = slides.indexOf(entry.target as HTMLElement);
          const video = (entry.target as HTMLElement).querySelector("video");
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (idx >= 0 && idx !== safeIndexRef.current) {
              isScrollDrivenRef.current = true;
              onSelect(idx);
            }
            video?.play().catch(() => {});
          } else {
            video?.pause();
          }
        });
      },
      { root: track, threshold: [0.6] }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [images.length, onSelect]);

  if (!images.length) {
    return (
      <div
        class="pdp-gallery pdp-gallery--empty"
        style={itemStyle}
        aria-hidden="true"
      />
    );
  }

  if (galleryStyle === "grid") {
    return (
      <div class="pdp-gallery pdp-gallery--grid">
        {images.map((img, i) => (
          <figure key={img.id} class="pdp-gallery-grid-item" style={itemStyle}>
            {img.isVideo ? (
              <video
                class="pdp-gallery-grid-img pdp-gallery-grid-video"
                src={getDefaultSrc(img)}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label={altFor(img, productName)}
              />
            ) : (
              <img
                class="pdp-gallery-grid-img"
                src={getDefaultSrc(img)}
                srcSet={createMediaSrcset(img)}
                sizes="(min-width: 1024px) 28vw, 100vw"
                alt={altFor(img, productName)}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            )}
          </figure>
        ))}
      </div>
    );
  }

  const galleryClass = `pdp-gallery pdp-gallery--thumbnails pdp-gallery--thumbs-${thumbnailPosition}`;

  return (
    <div class={galleryClass}>
      <div class="pdp-gallery-main" ref={trackRef} style={itemStyle}>
        {images.map((img, i) => (
          <div key={img.id} class="pdp-gallery-slide">
            {img.isVideo ? (
              <video
                class="pdp-gallery-main-img pdp-gallery-main-video"
                src={getDefaultSrc(img)}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={altFor(img, productName)}
              />
            ) : (
              <img
                class="pdp-gallery-main-img"
                src={getDefaultSrc(img)}
                srcSet={createMediaSrcset(img)}
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={altFor(img, productName)}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>

      {showThumbnails && images.length > 1 && (
        <div class="pdp-gallery-thumbs" role="list" ref={thumbsRef}>
          {images.map((img, i) => {
            const isActive = i === safeIndex;
            return (
              <button
                key={img.id}
                type="button"
                role="listitem"
                class={`pdp-gallery-thumb${isActive ? " is-active" : ""}`}
                style={itemStyle}
                onClick={() => onSelect(i)}
                aria-label={altFor(img, `${productName} - ${i + 1}`)}
                aria-current={isActive ? "true" : undefined}
              >
                {img.isVideo ? (
                  <video
                    class="pdp-gallery-thumb-img"
                    src={getDefaultSrc(img)}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    class="pdp-gallery-thumb-img"
                    src={getThumbnailSrc(img)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default ProductGallery;

import { useEffect, useRef, useState } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import type { IkasProduct } from "@ikas/bp-storefront";
import type { SliderAspectRatio } from "../../global-types";
import ProductCard from "../ProductCard";

interface Props {
  products: IkasProduct[];
  aspectRatio: SliderAspectRatio;
  productsPerView: number;
  showProductName: boolean;
  showPrice: boolean;
  showRating: boolean;
  reviewCountLabel: string;
  enableHoverImage: boolean;
  prevAriaLabel: string;
  nextAriaLabel: string;
  imageAltPrefix: string;
  saleLabel: string;
  soldOutLabel: string;
  offLabel: string;
  savingsBadgeStyle: "amount" | "percent";
}

const ProductSliderTrack = observer(function ProductSliderTrack({
  products,
  aspectRatio,
  productsPerView,
  showProductName,
  showPrice,
  showRating,
  reviewCountLabel,
  enableHoverImage,
  prevAriaLabel,
  nextAriaLabel,
  imageAltPrefix,
  saleLabel,
  soldOutLabel,
  offLabel,
  savingsBadgeStyle,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [arrowTop, setArrowTop] = useState<number | null>(null);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  const updateArrowTop = () => {
    const el = trackRef.current;
    if (!el) return;
    const media = el.querySelector(".product-card-media") as HTMLElement | null;
    if (media) setArrowTop(media.offsetHeight / 2);
  };

  useEffect(() => {
    updateEdges();
    updateArrowTop();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateEdges);
    window.addEventListener("resize", updateArrowTop);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateArrowTop);
      ro.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateEdges);
      window.removeEventListener("resize", updateArrowTop);
      ro?.disconnect();
    };
  }, [products.length, aspectRatio, productsPerView]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".product-card") as HTMLElement | null;
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : el.clientWidth / Math.max(1, productsPerView);
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  const trackStyle = {
    "--products-per-view": String(Math.max(1, productsPerView || 4)),
    ...(arrowTop != null ? { "--arrow-top": `${arrowTop}px` } : {}),
  } as Record<string, string>;

  return (
    <div class="product-slider-track-wrapper" style={trackStyle}>
      <button
        type="button"
        class="product-slider-arrow product-slider-arrow--prev"
        onClick={() => scrollByCard(-1)}
        aria-label={prevAriaLabel}
        aria-hidden={atStart ? "true" : "false"}
        tabIndex={atStart ? -1 : 0}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div class="product-slider-track" ref={trackRef}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            aspectRatio={aspectRatio}
            showProductName={showProductName}
            showPrice={showPrice}
            showRating={showRating}
            reviewCountLabel={reviewCountLabel}
            enableHoverImage={enableHoverImage}
            imageAltPrefix={imageAltPrefix}
            saleLabel={saleLabel}
            soldOutLabel={soldOutLabel}
            offLabel={offLabel}
            savingsBadgeStyle={savingsBadgeStyle}
          />
        ))}
      </div>

      <button
        type="button"
        class="product-slider-arrow product-slider-arrow--next"
        onClick={() => scrollByCard(1)}
        aria-label={nextAriaLabel}
        aria-hidden={atEnd ? "true" : "false"}
        tabIndex={atEnd ? -1 : 0}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
});

export default ProductSliderTrack;

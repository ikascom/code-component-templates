import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { Props } from "./types";
import SliderArrow from "../../sub-components/SliderArrow";
import { cx } from "../../utils/cx";
import { IkasComponentRenderer } from "@ikas/bp-storefront";

export function HeroSlider(props: Props) {
  const {
    backgroundColor,
    autoplay = false,
    autoplayDelay = 5000,
    fullWidth = false,
    showArrows = false,
    components,
  } = props;

  const count = components?.length ?? 0;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!autoplay || count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, autoplayDelay);
  }, [autoplay, autoplayDelay, count]);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setCurrent(((index % count) + count) % count);
      resetAutoplay();
    },
    [count, resetAutoplay],
  );

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetAutoplay]);

  if (count === 0) return null;

  const viewportClass = cx(
    "kombos-hero-slider__viewport",
    !fullWidth && "kombos-hero-slider__viewport--contained",
    !fullWidth && "kombos-container",
  );

  return (
    <section
      className="kombos-hero-slider"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className={viewportClass}>
        <div className="kombos-hero-slider__viewport-inner">
          <div
            className="kombos-hero-slider__track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            <IkasComponentRenderer
              id="hero-slider"
              components={components}
              parentProps={props}
            />
          </div>

          {/* Navigation arrows */}
          {showArrows && count > 1 && (
            <>
              <SliderArrow
                direction="left"
                className="kombos-hero-slider__arrow kombos-hero-slider__arrow--prev"
                onClick={() => goTo(current - 1)}
              />
              <SliderArrow
                direction="right"
                className="kombos-hero-slider__arrow kombos-hero-slider__arrow--next"
                onClick={() => goTo(current + 1)}
              />
            </>
          )}

          {/* Dot pagination */}
          {count > 1 && (
            <div className="kombos-hero-slider__dots">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className={cx(
                    "kombos-hero-slider__dot",
                    i === current && "kombos-hero-slider__dot--active",
                  )}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;

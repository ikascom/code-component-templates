import { useEffect, useCallback, useRef, useState } from "preact/hooks";
import { Props } from "./types";
import { IkasComponentRenderer } from "@ikas/bp-storefront";

const SWIPE_THRESHOLD = 50;

export function Announcements(props: Props) {
  const {
    bgColor,
    textColor,
    items,
    autoPlay = false,
    autoPlayInterval = 5000,
  } = props;
  const [current, setCurrent] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = items?.length ?? 0;

  const resetAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!autoPlay || count <= 1) return;
    const interval = autoPlayInterval > 0 ? autoPlayInterval : 7000;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, interval);
  }, [autoPlay, autoPlayInterval, count]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetAutoPlay]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const diff = dragStartX.current - e.clientX;
      if (count <= 1) return;

      if (diff > SWIPE_THRESHOLD) {
        setCurrent((prev) => (prev + 1) % count);
        resetAutoPlay();
      } else if (diff < -SWIPE_THRESHOLD) {
        setCurrent((prev) => (prev - 1 + count) % count);
        resetAutoPlay();
      }
    },
    [count, resetAutoPlay],
  );

  return (
    <div
      className="kombos-announcements"
      style={{
        backgroundColor: bgColor ?? "var(--kombos-gray-900)",
        color: textColor ?? "var(--kombos-white)",
      }}
    >
      <div
        className="kombos-announcements__slider"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="kombos-announcements__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          <IkasComponentRenderer
            id="announcements"
            components={items}
            parentProps={props}
          />
        </div>
      </div>
    </div>
  );
}

export default Announcements;

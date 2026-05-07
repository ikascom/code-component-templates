import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import {
  IkasProductList,
  IkasProductFilter,
  onNumberRangeFilterChange,
  getProductListInitialData,
  getProductListCurrencySymbol,
} from "@ikas/bp-storefront";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  onFilterChange?: () => void;
}

const FilterRangeValues = observer(function FilterRangeValues({
  productList,
  filter,
  onFilterChange,
}: Props) {
  const limit = filter.numberRangeLimit;
  const range = filter.numberRange;

  const minBound = limit?.from ?? 0;
  const maxBound = limit?.to ?? 100;

  const [localFrom, setLocalFrom] = useState(range?.from ?? minBound);
  const [localTo, setLocalTo] = useState(range?.to ?? maxBound);
  const [dragging, setDragging] = useState<"from" | "to" | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  // Sync local state when filter changes externally (e.g. clear all filters)
  useEffect(() => {
    if (!dragging) {
      setLocalFrom(range?.from ?? minBound);
      setLocalTo(range?.to ?? maxBound);
    }
  }, [range?.from, range?.to, minBound, maxBound]);

  if (minBound === maxBound) return null;

  const suffix =
    filter.type === "DISCOUNT_RATIO"
      ? "%"
      : getProductListCurrencySymbol(productList);

  const valueToPercent = (val: number) =>
    ((val - minBound) / (maxBound - minBound)) * 100;

  const percentToValue = (pct: number) =>
    Math.round(minBound + (pct / 100) * (maxBound - minBound));

  const clientXToPercent = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, raw));
  };

  const applyFilter = useCallback(
    (from: number, to: number) => {
      onNumberRangeFilterChange(filter, { from, to });
      getProductListInitialData(productList);
      onFilterChange?.();
    },
    [filter, productList, onFilterChange],
  );

  const handlePointerDown = (handle: "from" | "to", e: PointerEvent) => {
    e.preventDefault();
    setDragging(handle);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (handle: "from" | "to", e: PointerEvent) => {
    if (dragging !== handle) return;
    const pct = clientXToPercent(e.clientX);
    const val = percentToValue(pct);

    if (handle === "from") {
      setLocalFrom(Math.min(val, localTo));
    } else {
      setLocalTo(Math.max(val, localFrom));
    }
  };

  const handlePointerUp = (handle: "from" | "to") => {
    if (dragging !== handle) return;
    setDragging(null);
    applyFilter(localFrom, localTo);
  };

  const handleTrackClick = (e: MouseEvent) => {
    // Ignore clicks on handles
    if ((e.target as HTMLElement).closest(".kombos-range-slider__handle"))
      return;

    const pct = clientXToPercent(e.clientX);
    const val = percentToValue(pct);
    const distFrom = Math.abs(val - localFrom);
    const distTo = Math.abs(val - localTo);

    let newFrom = localFrom;
    let newTo = localTo;

    if (distFrom <= distTo) {
      newFrom = Math.min(val, localTo);
      setLocalFrom(newFrom);
    } else {
      newTo = Math.max(val, localFrom);
      setLocalTo(newTo);
    }

    applyFilter(newFrom, newTo);
  };

  const fromPct = valueToPercent(localFrom);
  const toPct = valueToPercent(localTo);

  return (
    <div className="kombos-range-slider">
      <div className="kombos-range-slider__values">
        <span
          className="kombos-range-slider__value-label text-xs-semibold"
          style={{ left: `${fromPct}%` }}
        >
          {localFrom}
        </span>
        <span
          className="kombos-range-slider__value-label text-xs-semibold"
          style={{ left: `${toPct}%` }}
        >
          {localTo}
        </span>
      </div>

      <div
        ref={trackRef}
        className="kombos-range-slider__track"
        onClick={handleTrackClick}
      >
        <div
          className="kombos-range-slider__fill"
          style={{ left: `${fromPct}%`, right: `${100 - toPct}%` }}
        />
        <div
          className="kombos-range-slider__handle"
          role="slider"
          aria-label="Minimum"
          aria-valuemin={minBound}
          aria-valuemax={maxBound}
          aria-valuenow={localFrom}
          tabIndex={0}
          style={{ left: `${fromPct}%` }}
          onPointerDown={(e) => handlePointerDown("from", e)}
          onPointerMove={(e) => handlePointerMove("from", e)}
          onPointerUp={() => handlePointerUp("from")}
        />
        <div
          className="kombos-range-slider__handle"
          role="slider"
          aria-label="Maximum"
          aria-valuemin={minBound}
          aria-valuemax={maxBound}
          aria-valuenow={localTo}
          tabIndex={0}
          style={{ left: `${toPct}%` }}
          onPointerDown={(e) => handlePointerDown("to", e)}
          onPointerMove={(e) => handlePointerMove("to", e)}
          onPointerUp={() => handlePointerUp("to")}
        />
      </div>

      <div className="kombos-range-slider__bounds">
        <span className="kombos-range-slider__bound text-xs-regular">
          {`${minBound} ${suffix}`}
        </span>
        <span className="kombos-range-slider__bound text-xs-regular">
          {`${maxBound} ${suffix}`}
        </span>
      </div>
    </div>
  );
});

export default FilterRangeValues;

import { MinusSVG, PlusSVG } from "../icons";
import { cx } from "../../utils/cx";

interface Props {
  value: number;
  onChange: (value: number) => void;
  size?: "default" | "sm";
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  size = "default",
  min = 1,
  max,
}: Props) {
  const canDecrease = value > min;
  const canIncrease = max == null || value < max;

  return (
    <div className={cx("kombos-pd__qty", size === "sm" && "kombos-pd__qty--sm")}>
      <button
        type="button"
        className="kombos-pd__qty-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
      >
        <MinusSVG />
      </button>
      <span
        className={cx("kombos-pd__qty-value", size === "sm" ? "text-sm-medium" : "text-md-medium")}
      >
        {value}
      </span>
      <button
        type="button"
        className="kombos-pd__qty-btn"
        onClick={() => onChange(max == null ? value + 1 : Math.min(max, value + 1))}
        disabled={!canIncrease}
        aria-label="Increase quantity"
      >
        <PlusSVG />
      </button>
    </div>
  );
}

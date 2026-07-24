import { MinusSVG, PlusSVG } from "../icons";
import { cx } from "../../utils/cx";

interface Props {
  value: number;
  onChange: (value: number) => void;
  size?: "default" | "sm";
}

export default function QuantitySelector({
  value,
  onChange,
  size = "default",
}: Props) {
  return (
    <div className={cx("kombos-pd__qty", size === "sm" && "kombos-pd__qty--sm")}>
      <button
        type="button"
        className="kombos-pd__qty-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
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
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <PlusSVG />
      </button>
    </div>
  );
}

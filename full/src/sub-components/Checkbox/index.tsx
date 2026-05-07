import { cx } from "../../utils/cx";
import { CheckSVG } from "../icons";

interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  status?: "default" | "error" | "success";
  className?: string;
  "aria-label"?: string;
}

export default function Checkbox({
  checked = false,
  onChange,
  status = "default",
  className,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <label
      className={cx("kombos-checkbox", checked && "kombos-checkbox--checked", className)}
      data-state={status !== "default" ? status : undefined}
    >
      <input
        type="checkbox"
        className="kombos-checkbox__native"
        checked={checked}
        onChange={() => onChange?.(!checked)}
        aria-label={ariaLabel}
      />
      <span
        className={cx("kombos-checkbox__box", checked && "kombos-checkbox__box--checked")}
      >
        {checked && (
          <span className="kombos-checkbox__icon">
            <CheckSVG />
          </span>
        )}
      </span>
    </label>
  );
}

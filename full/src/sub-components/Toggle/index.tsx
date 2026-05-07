import { cx } from "../../utils/cx";

interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Toggle",
}: Props) {
  function handleClick(e: Event) {
    e.preventDefault();
    if (disabled) return;
    onChange?.(!checked);
  }

  return (
    <label
      className={cx(
        "kombos-toggle",
        checked && "kombos-toggle--checked",
        disabled && "kombos-toggle--disabled",
        className,
      )}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        className="kombos-toggle__native"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span className="kombos-toggle__track">
        <span className="kombos-toggle__thumb" />
      </span>
    </label>
  );
}

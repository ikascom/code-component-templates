import { CSSProperties } from "preact";
import { cx } from "../../utils/cx";
import { CaretDownSVG, XCircleSVG } from "../icons";

type Size = "xs" | "s" | "m";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  size?: Size;
  status?: "default" | "error" | "success";
  value?: string;
  onChange?: (e: Event) => void;
  onClear?: () => void;
  allowClear?: boolean;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

const typographyClass: Record<Size, string> = {
  xs: "text-sm-semibold",
  s: "text-md-semibold",
  m: "text-lg-semibold",
};

export default function Select({
  options,
  size = "s",
  status = "default",
  value,
  onChange,
  onClear,
  allowClear,
  className,
  disabled,
  id,
  style,
  "aria-label": ariaLabel,
}: Props) {
  const showClear = allowClear && !!value && !disabled;

  const cls = cx(
    "kombos-select",
    `kombos-select--${size}`,
    showClear && "kombos-select--clearable",
    typographyClass[size],
    className,
  );

  return (
    <div className="kombos-select-wrap" style={style} data-state={status !== "default" ? status : undefined}>
      <select
        id={id}
        className={cls}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <CaretDownSVG className="kombos-select__icon" />
      {showClear && (
        <button
          type="button"
          className="kombos-select__clear"
          onClick={onClear}
          aria-label="Clear selection"
        >
          <XCircleSVG />
        </button>
      )}
    </div>
  );
}

import type { ButtonHTMLAttributes, ComponentChildren } from "preact";
import { SpinnerSVG } from "../icons";
import { cx } from "../../utils/cx";

type Variant = "primary" | "secondary" | "dangerous";
type Size = "xs" | "s" | "m";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "size" | "icon" | "loading"
> {
  variant?: Variant;
  size?: Size;
  icon?: ComponentChildren;
  loading?: boolean;
}

const TYPOGRAPHY: Record<Size, string> = {
  xs: "text-sm-semibold",
  s: "text-md-semibold",
  m: "text-lg-semibold",
};

export default function Button({
  variant = "primary",
  size = "s",
  icon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = cx(
    "kombos-btn",
    `kombos-btn--${variant}`,
    `kombos-btn--${size}`,
    TYPOGRAPHY[size],
    className,
  );

  return (
    <button className={cls} disabled={loading || disabled} {...rest}>
      {loading ? (
        <SpinnerSVG className="kombos-btn__spinner" />
      ) : (
        icon && <span className="kombos-btn__icon">{icon}</span>
      )}
      {children}
    </button>
  );
}

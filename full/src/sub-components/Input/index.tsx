import { useState } from "preact/hooks";
import type { Ref, InputHTMLAttributes, ComponentChildren } from "preact";
import { cx } from "../../utils/cx";
import { EyeSVG, EyeSlashSVG } from "../icons";

const TYPOGRAPHY: Record<string, string> = {
  s: "text-md-regular",
  xs: "text-sm-regular",
};

interface Props extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "label" | "icon"
> {
  size?: "xs" | "s";
  status?: "default" | "error" | "success";
  password?: boolean;
  disabled?: boolean;
  leftIcon?: ComponentChildren;
  inputRef?: Ref<HTMLInputElement>;
}

export default function Input({
  size = "s",
  status = "default",
  password = false,
  disabled,
  leftIcon,
  inputRef,
  className,
  value,
  type = "text",
  ...rest
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const cls = cx(
    "kombos-input",
    `kombos-input--${size}`,
    leftIcon && "kombos-input--with-icon",
    disabled && "kombos-input--disabled",
    className,
  );

  return (
    <div className={cls} data-state={status !== "default" ? status : undefined}>
      {leftIcon && <span className="kombos-input__icon">{leftIcon}</span>}
      <input
        ref={inputRef}
        className={`kombos-input__native ${TYPOGRAPHY[size]}`}
        type={password ? (showPassword ? "text" : "password") : type}
        disabled={disabled}
        value={value ?? ""}
        {...rest}
      />
      {password && (
        <button
          type="button"
          className="kombos-input__toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeSVG /> : <EyeSlashSVG />}
        </button>
      )}
    </div>
  );
}

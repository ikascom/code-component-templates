import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { cx } from "../../utils/cx";
import { cloneElement, isValidElement } from "preact";

type FormItemStatus = "default" | "error" | "success";

interface Props {
  label?: ComponentChildren;
  description?: ComponentChildren;
  status?: FormItemStatus;
  helper?: ComponentChildren;
  children: ComponentChildren;
  className?: string;
  htmlFor?: string;
}

export default function FormItem({
  label,
  description,
  status = "default",
  helper,
  children,
  className,
  htmlFor,
}: Props) {
  const autoId = useId();
  const helperId = helper ? `${autoId}-helper` : undefined;

  const enhancedChildren =
    helperId && isValidElement(children)
      ? cloneElement(children, { "aria-describedby": helperId })
      : children;

  return (
    <div
      className={cx("kombos-form-item", className)}
      data-state={status !== "default" ? status : undefined}
    >
      {label &&
        (htmlFor ? (
          <label
            htmlFor={htmlFor}
            className="kombos-form-item__label text-xs-medium"
          >
            {label}
          </label>
        ) : (
          <span className="kombos-form-item__label text-xs-medium">
            {label}
          </span>
        ))}
      {description && (
        <span className="kombos-form-item__description text-xs-regular">
          {description}
        </span>
      )}
      {enhancedChildren}
      {helper && (
        <span id={helperId} className="kombos-form-item__helper text-xs-regular">
          {helper}
        </span>
      )}
    </div>
  );
}

import type { JSX, Ref } from "preact";
import { cx } from "../../utils/cx";

const TYPOGRAPHY: Record<string, string> = {
  s: "text-md-regular",
  xs: "text-sm-regular",
};

interface Props
  extends Omit<JSX.IntrinsicElements["textarea"], "size" | "ref"> {
  size?: "xs" | "s";
  status?: "default" | "error" | "success";
  disabled?: boolean;
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export default function Textarea({
  size = "s",
  status = "default",
  disabled,
  textareaRef,
  className,
  value,
  ...rest
}: Props) {
  const cls = cx(
    "kombos-textarea",
    `kombos-textarea--${size}`,
    disabled && "kombos-textarea--disabled",
    className,
  );

  return (
    <div className={cls} data-state={status !== "default" ? status : undefined}>
      <textarea
        ref={textareaRef}
        className={`kombos-textarea__native ${TYPOGRAPHY[size]}`}
        disabled={disabled}
        spellcheck={false}
        value={value ?? ""}
        {...rest}
      />
    </div>
  );
}

import type { JSX } from "preact";
import { CaretLeftSVG, CaretRightSVG } from "../icons";
import { cx } from "../../utils/cx";

interface Props extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "direction"> {
  direction: "left" | "right";
  disabled?: boolean;
}

export default function SliderArrow({
  direction,
  className,
  ...rest
}: Props) {
  const Icon = direction === "left" ? CaretLeftSVG : CaretRightSVG;

  return (
    <button
      className={cx("kombos-slider-arrow", className)}
      aria-label={direction === "left" ? "Previous" : "Next"}
      {...rest}
    >
      <Icon />
    </button>
  );
}

import { useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { Star1SVG, StarFilledSVG } from "../icons";

interface Props {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  className?: string;
}

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
  className,
}: Props) {
  const [hovered, setHovered] = useState(0);

  const displayValue = interactive && hovered > 0 ? hovered : value;

  return (
    <div
      className={cx(
        "kombos-star-rating",
        `kombos-star-rating--${size}`,
        interactive && "kombos-star-rating--interactive",
        className
      )}
      onMouseLeave={interactive ? () => setHovered(0) : undefined}
      role={!interactive ? "img" : undefined}
      aria-label={!interactive ? `${value} out of ${max} stars` : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= Math.round(displayValue);
        const Icon = isFilled ? StarFilledSVG : Star1SVG;

        if (!interactive) {
          return (
            <span
              key={i}
              className={cx(
                "kombos-star-rating__star",
                isFilled && "kombos-star-rating__star--filled"
              )}
              aria-hidden="true"
            >
              <Icon />
            </span>
          );
        }

        return (
          <button
            key={i}
            type="button"
            className={cx(
              "kombos-star-rating__star",
              isFilled && "kombos-star-rating__star--filled"
            )}
            onClick={() => onChange?.(starIndex)}
            onMouseEnter={() => setHovered(starIndex)}
            aria-label={`${starIndex} star`}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

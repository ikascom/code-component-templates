import { observer } from "@ikas/component-utils";

interface Props {
  averageRating: number | null | undefined;
  reviewCount: number | null | undefined;
  reviewCountLabel: string;
  size?: "sm" | "md";
}

const ProductRating = observer(function ProductRating({
  averageRating,
  reviewCount,
  reviewCountLabel,
  size = "sm",
}: Props) {
  if (
    averageRating == null ||
    averageRating <= 0 ||
    reviewCount == null ||
    reviewCount <= 0
  ) {
    return null;
  }

  const rating = Math.max(0, Math.min(5, averageRating));
  const visualRating = Math.floor(rating * 4) / 4;
  const ratingAria = `${Math.round(rating * 10) / 10}/5, ${reviewCount} ${reviewCountLabel}`;

  return (
    <div class={`rating rating--${size}`} aria-label={ratingAria}>
      <span class="rating-stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fillPct = Math.max(0, Math.min(1, visualRating - i)) * 100;
          return (
            <span class="rating-star" key={i}>
              <svg
                class="rating-star-bg"
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
              >
                <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.27l-6.18 3.23L7 14.63l-5-4.87 6.91-1z" />
              </svg>
              <span
                class="rating-star-fill"
                style={{ width: `${fillPct}%` }}
              >
                <svg
                  class="rating-star-fg"
                  viewBox="0 0 24 24"
                  width="auto"
                  height="100%"
                  preserveAspectRatio="xMinYMid meet"
                >
                  <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.27l-6.18 3.23L7 14.63l-5-4.87 6.91-1z" />
                </svg>
              </span>
            </span>
          );
        })}
      </span>
      <span class="rating-count">
        {reviewCount} {reviewCountLabel}
      </span>
    </div>
  );
});

export default ProductRating;

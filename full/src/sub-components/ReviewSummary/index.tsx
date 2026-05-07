import type { ComponentChildren } from "preact";
import type { IkasProductStar } from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import StarRating from "../StarRating";

interface Props {
  averageStar: number;
  totalReview: number;
  stars: IkasProductStar[];
  reviewCountText: string;
  action?: ComponentChildren;
  className?: string;
}

export default function ReviewSummary({
  averageStar,
  totalReview,
  stars,
  reviewCountText,
  action,
  className,
}: Props) {
  return (
    <div className={cx("kombos-review-summary", className)}>
      <div className="kombos-review-summary__overview">
        <span className="kombos-review-summary__average display-xs-semibold">
          {averageStar.toFixed(1)}
        </span>
        <StarRating value={averageStar} size="md" />
        <span className="kombos-review-summary__count text-sm-regular">
          {reviewCountText.replace("{count}", String(totalReview))}
        </span>
      </div>

      <div className="kombos-review-summary__bars">
        {[5, 4, 3, 2, 1].map((starLevel) => {
          const entry = stars.find((s) => s.star === starLevel);
          const count = entry?.count ?? 0;
          const percentage = totalReview > 0 ? (count / totalReview) * 100 : 0;

          return (
            <div key={starLevel} className="kombos-review-summary__bar-row">
              <span className="kombos-review-summary__bar-label text-sm-medium">
                {starLevel}
              </span>
              <div className="kombos-review-summary__bar-track">
                <div
                  className="kombos-review-summary__bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="kombos-review-summary__bar-count text-xs-regular">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {action && (
        <div className="kombos-review-summary__action">{action}</div>
      )}
    </div>
  );
}

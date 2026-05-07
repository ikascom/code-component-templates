import type { IkasCustomerReview } from "@ikas/bp-storefront";
import {
  getIkasCustomerReviewFormattedDate,
  getThumbnailSrc,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import { getFullName } from "../../utils/fullName";
import StarRating from "../StarRating";
import { ArrowBendUpLeftSVG } from "../icons";

interface Props {
  review: IkasCustomerReview;
  merchantReplyLabel: string;
  onImageClick?: (src: string, alt: string) => void;
  className?: string;
}

export default function ReviewCard({
  review,
  merchantReplyLabel,
  onImageClick,
  className,
}: Props) {
  const name = getFullName(review.firstName, review.lastName);
  const date = getIkasCustomerReviewFormattedDate(review);
  const hasImages = review.images && review.images.length > 0;

  return (
    <article className={cx("kombos-review-card", className)}>
      <div className="kombos-review-card__header">
        <div className="kombos-review-card__meta">
          {name && (
            <span className="kombos-review-card__author text-sm-semibold">
              {name}
            </span>
          )}
          {date && (
            <span className="kombos-review-card__date text-xs-regular">
              {date}
            </span>
          )}
        </div>
        <StarRating value={review.star} size="sm" />
      </div>

      {review.title && (
        <h4 className="kombos-review-card__title text-md-semibold">
          {review.title}
        </h4>
      )}

      {review.comment && (
        <p className="kombos-review-card__comment text-sm-regular">
          {review.comment}
        </p>
      )}

      {hasImages && (
        <div className="kombos-review-card__images">
          {review.images?.map((image, i) => {
            const thumbSrc = getThumbnailSrc(image);
            const fullSrc = getDefaultSrc(image);

            if (!thumbSrc) return null;

            return (
              <button
                key={i}
                type="button"
                className="kombos-review-card__image-btn"
                onClick={() =>
                  onImageClick?.(fullSrc, review.title || "Review image")
                }
              >
                <img
                  src={thumbSrc}
                  alt={image.altText || review.title || "Review image"}
                  className="kombos-review-card__image"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {review.reply && (
        <div className="kombos-review-card__reply">
          <div className="kombos-review-card__reply-header">
            <ArrowBendUpLeftSVG />
            <span className="kombos-review-card__reply-label text-xs-semibold">
              {merchantReplyLabel}
            </span>
          </div>
          <p className="kombos-review-card__reply-text text-sm-regular">
            {review.reply}
          </p>
        </div>
      )}
    </article>
  );
}

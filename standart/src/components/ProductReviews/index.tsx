import { useEffect, useMemo, useState } from "preact/hooks";
import {
  getProductCustomerReviews,
  getThumbnailSrc,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import type {
  IkasCustomerReview,
  IkasCustomerReviewList,
  IkasImage,
} from "@ikas/bp-storefront";
import { Props } from "./types";

const MAX_FETCH = 100;

function formatTrDate(timestamp: number) {
  const d = new Date(timestamp);
  const date = d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${date} ${hours}:${minutes}`;
}

function StarRow({
  rating,
  size,
  ariaLabel,
}: {
  rating: number;
  size: "summary" | "card";
  ariaLabel?: string;
}) {
  const clamped = Math.max(0, Math.min(5, rating));
  return (
    <span
      class={`pr-stars pr-stars--${size}`}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fillPct = Math.max(0, Math.min(1, clamped - i)) * 100;
        return (
          <span class="pr-star" key={i}>
            <svg class="pr-star-bg" viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.27l-6.18 3.23L7 14.63l-5-4.87 6.91-1z" />
            </svg>
            <span class="pr-star-fill" style={{ width: `${fillPct}%` }}>
              <svg
                class="pr-star-fg"
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
  );
}

export function ProductReviews({
  product,
  sectionTitle = "Yorumlar",
  showSectionTitle = true,
  verifiedBadgeLabel = "DOĞRULANMIŞ KULLANICI",
  reviewCountLabel = "değerlendirme",
  loadMoreButtonText = "Daha Fazla Göster",
  emptyStateText = "Henüz yorum yapılmamış.",
  initialReviewCount = 5,
  showVerifiedBadge = true,
  backgroundColor,
}: Props) {
  const batchSize = initialReviewCount && initialReviewCount > 0 ? initialReviewCount : 5;
  const [reviewList, setReviewList] = useState<IkasCustomerReviewList | null>(null);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [loading, setLoading] = useState(true);

  const productId = product?.id ?? null;

  useEffect(() => {
    let cancelled = false;
    if (!product) {
      setReviewList(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductCustomerReviews(product, MAX_FETCH, 1)
      .then((list) => {
        if (cancelled) return;
        setReviewList(list);
        setVisibleCount(batchSize);
      })
      .catch(() => {
        if (cancelled) return;
        setReviewList(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, batchSize]);

  const reviews: IkasCustomerReview[] = reviewList?.data ?? [];
  const totalCount = reviewList?.count ?? reviews.length;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.star || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <section
      class="product-reviews"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div class="pr-container">
        <header class="pr-summary">
          <div class="pr-summary-head">
            {showSectionTitle && sectionTitle ? (
              <h2 class="pr-title">{sectionTitle}</h2>
            ) : null}
            {totalCount > 0 ? (
              <div class="pr-summary-meta">
                <StarRow
                  rating={averageRating}
                  size="summary"
                  ariaLabel={`5 üzerinden ${averageRating} yıldız`}
                />
                <span class="pr-summary-count">
                  {totalCount} {reviewCountLabel}
                </span>
              </div>
            ) : null}
          </div>
          <div class="pr-separator" aria-hidden="true" />
        </header>

        {loading ? (
          <div class="pr-empty" role="status" aria-live="polite">
            <span class="pr-empty-text">…</span>
          </div>
        ) : reviews.length === 0 ? (
          <div class="pr-empty">
            <svg
              class="pr-empty-icon"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              stroke-width="1.25"
              aria-hidden="true"
            >
              <path d="M12 3.5l2.7 5.47 6.05.88-4.38 4.27 1.03 6.02L12 17.27 6.6 20.14l1.03-6.02L3.25 9.85l6.05-.88L12 3.5z" />
            </svg>
            <p class="pr-empty-text">{emptyStateText}</p>
          </div>
        ) : (
          <div class="pr-list">
            {visibleReviews.map((review) => {
              const author = [review.firstName, review.lastName]
                .filter(Boolean)
                .join(" ")
                .trim();
              const isVerified = !!review.orderId;
              return (
                <article class="pr-card" key={review.id}>
                  <div class="pr-card-header">
                    <StarRow
                      rating={review.star || 0}
                      size="card"
                      ariaLabel={`5 üzerinden ${review.star || 0} yıldız`}
                    />
                    {author ? (
                      <span class="pr-card-author">{author}</span>
                    ) : null}
                    {showVerifiedBadge && isVerified ? (
                      <span
                        class="pr-verified"
                        aria-label="Doğrulanmış kullanıcı"
                      >
                        <svg
                          class="pr-verified-icon"
                          viewBox="0 0 16 16"
                          width="12"
                          height="12"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-7" />
                        </svg>
                        <span class="pr-verified-label">
                          {verifiedBadgeLabel}
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <time
                    class="pr-card-date"
                    dateTime={new Date(review.createdAt).toISOString()}
                  >
                    {formatTrDate(review.createdAt)}
                  </time>
                  {review.title ? (
                    <h3 class="pr-card-title">{review.title}</h3>
                  ) : null}
                  {review.comment ? (
                    <p class="pr-card-body">{review.comment}</p>
                  ) : null}
                  {review.images && review.images.length > 0 ? (
                    <ul class="pr-card-images" aria-label="Yorum görselleri">
                      {review.images.map((image: IkasImage, idx: number) => (
                        <li class="pr-card-image" key={image.id ?? idx}>
                          <a
                            class="pr-card-image-link"
                            href={getDefaultSrc(image)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Yorum görselini görüntüle ${idx + 1}`}
                          >
                            <img
                              src={getThumbnailSrc(image)}
                              srcSet={createMediaSrcset(image)}
                              sizes="(max-width: 768px) 25vw, 96px"
                              alt=""
                              loading="lazy"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}

            {hasMore ? (
              <div class="pr-load-more-wrap">
                <button
                  type="button"
                  class="pr-load-more"
                  aria-label="Daha fazla yorum yükle"
                  onClick={() =>
                    setVisibleCount((c) => Math.min(c + batchSize, reviews.length))
                  }
                >
                  {loadMoreButtonText}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductReviews;

import { useState, useEffect, useRef } from "preact/hooks";
import type { IkasCustomerReviewList } from "@ikas/bp-storefront";
import {
  customerStore,
  getProductCustomerReviews,
  getCustomerReviewListPageCount,
  hasCustomerReviewListPrevPage,
  hasCustomerReviewListNextPage,
  getCustomerReviewListPage,
  isCustomerReviewEnabled,
  isCustomerReviewLoginRequired,
  hasCustomer,
  Router,
  getIkasProductCustomerReviewForm,
  clearIkasProductCustomerReviewForm,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import Pagination from "../../sub-components/Pagination";
import Button from "../../sub-components/Button";
import Modal from "../../sub-components/Modal";
import ImagePreviewModal from "../../sub-components/ImagePreviewModal";
import ReviewSummary from "../../sub-components/ReviewSummary";
import ReviewCard from "../../sub-components/ReviewCard";
import ReviewForm from "../../sub-components/ReviewForm";
import PageLoader from "../../sub-components/PageLoader";

export function ProductDetailReviews({
  product,
  reviewsPerPage = 5,
  sectionTitle = "Customer Reviews",
  writeReviewButtonText = "Write a Review",
  emptyStateText = "No reviews yet. Be the first to review this product!",
  reviewCountText = "Based on {count} reviews",
  submitButtonText = "Submit Review",
  submittingButtonText = "Submitting...",
  titlePlaceholder = "Review title",
  commentPlaceholder = "Write your review...",
  merchantReplyLabel = "Store Reply",
  starRequiredError = "Please select a rating",
  cancelButtonText = "Cancel",
  errorMessage = "Something went wrong. Please try again.",
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [reviewList, setReviewList] = useState<IkasCustomerReviewList | null>(
    null,
  );
  const [formVisible, setFormVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product) return;

    setIsLoading(true);

    getProductCustomerReviews(product, reviewsPerPage)
      .then((result) => {
        setReviewList(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [product, reviewsPerPage]);

  if (!product) return null;

  const reviewsEnabled = isCustomerReviewEnabled(product);
  const hasReviews = reviewList && reviewList.data.length > 0;
  const hasSummary =
    product.averageRating !== null && product.reviewCount !== null;

  const handleWriteReview = () => {
    if (isCustomerReviewLoginRequired(product) && !hasCustomer(customerStore)) {
      Router.navigateToPage("LOGIN");
      return;
    }

    setFormVisible(true);
  };

  const handlePageChange = async (page: number) => {
    if (!reviewList) return;

    await getCustomerReviewListPage(reviewList, page);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reviewForm = getIkasProductCustomerReviewForm(product);

  const handleCloseForm = () => {
    clearIkasProductCustomerReviewForm(product);
    setFormVisible(false);
  };

  const handleReviewSuccess = () => {
    getProductCustomerReviews(product, reviewsPerPage).then(setReviewList);
    handleCloseForm();
  };

  return (
    <section className="product-detail-reviews">
      <div className="kombos-container product-detail-reviews__inner">
        <div className="product-detail-reviews__header">
          <h2 className="product-detail-reviews__title display-xs-semibold">
            {sectionTitle}
          </h2>
          {reviewsEnabled && !hasSummary && (
            <Button variant="secondary" size="s" onClick={handleWriteReview}>
              {writeReviewButtonText}
            </Button>
          )}
        </div>

        {hasSummary && (
          <ReviewSummary
            averageStar={product.averageRating!}
            totalReview={product.reviewCount!}
            stars={product.stars ?? []}
            reviewCountText={reviewCountText}
            action={
              reviewsEnabled ? (
                <Button
                  variant="secondary"
                  size="s"
                  onClick={handleWriteReview}
                >
                  {writeReviewButtonText}
                </Button>
              ) : undefined
            }
          />
        )}

        {isLoading && <PageLoader />}

        {!hasReviews && !isLoading && reviewList && (
          <p className="product-detail-reviews__empty text-md-regular">
            {emptyStateText}
          </p>
        )}

        {hasReviews && !isLoading && (
          <>
            <div ref={listRef} className="product-detail-reviews__list">
              {reviewList?.data.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  merchantReplyLabel={merchantReplyLabel}
                  onImageClick={(src, alt) => setPreviewImage({ src, alt })}
                />
              ))}
            </div>

            <Pagination
              currentPage={reviewList.page}
              totalPages={getCustomerReviewListPageCount(reviewList!)}
              hasPrev={hasCustomerReviewListPrevPage(reviewList!)}
              hasNext={hasCustomerReviewListNextPage(reviewList!)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {formVisible && (
        <Modal
          title={writeReviewButtonText}
          onClose={handleCloseForm}
          okText={
            reviewForm.isSubmitting ? submittingButtonText : submitButtonText
          }
          cancelText={cancelButtonText}
          okButtonProps={{
            type: "submit",
            form: "review-form",
            disabled: reviewForm.isSubmitting,
          }}
        >
          <ReviewForm
            product={product}
            onSuccess={handleReviewSuccess}
            titlePlaceholder={titlePlaceholder}
            commentPlaceholder={commentPlaceholder}
            starRequiredError={starRequiredError}
            errorMessage={errorMessage}
          />
        </Modal>
      )}

      {previewImage && (
        <ImagePreviewModal
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </section>
  );
}

export default ProductDetailReviews;

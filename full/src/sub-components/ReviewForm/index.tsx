import { observer } from "@ikas/component-utils";
import type { IkasProduct } from "@ikas/bp-storefront";
import {
  getIkasProductCustomerReviewForm,
  submitCustomerReviewForm,
  setCustomerReviewFormStar,
  setCustomerReviewFormTitle,
  setCustomerReviewFormComment,
} from "@ikas/bp-storefront";
import { showToast } from "../../utils/toast";
import FormItem from "../FormItem";
import Input from "../Input";
import Textarea from "../Textarea";
import StarRating from "../StarRating";

interface Props {
  product: IkasProduct;
  onSuccess: () => void;
  titlePlaceholder: string;
  commentPlaceholder: string;
  starRequiredError: string;
  errorMessage: string;
}

const ReviewForm = observer(function ReviewForm({
  product,
  onSuccess,
  titlePlaceholder,
  commentPlaceholder,
  starRequiredError,
  errorMessage,
}: Props) {
  const form = getIkasProductCustomerReviewForm(product);

  const handleStarChange = (value: number) => {
    setCustomerReviewFormStar(form, String(value));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const success = await submitCustomerReviewForm(form);

    if (success) {
      onSuccess();
    } else {
      showToast(form.responseMessage || errorMessage, "error");
    }
  };

  const starValue = Number(form.star.value) || 0;

  return (
    <form
      id="review-form"
      className="kombos-review-form"
      onSubmit={handleSubmit}
    >
      <div className="kombos-review-form__field">
        <FormItem
          status={form.star.hasError ? "error" : "default"}
          helper={
            form.star.hasError
              ? form.star.message || starRequiredError
              : undefined
          }
        >
          <StarRating
            value={starValue}
            interactive
            onChange={handleStarChange}
            size="md"
          />
        </FormItem>
      </div>

      <FormItem
        label={form.title.label || undefined}
        status={form.title.hasError ? "error" : "default"}
        helper={form.title.hasError ? form.title.message : undefined}
      >
        <Input
          placeholder={titlePlaceholder}
          value={form.title.value}
          onInput={(e) => {
            setCustomerReviewFormTitle(
              form,
              (e.target as HTMLInputElement).value,
            );
          }}
        />
      </FormItem>

      <FormItem
        label={form.comment.label || undefined}
        status={form.comment.hasError ? "error" : "default"}
        helper={form.comment.hasError ? form.comment.message : undefined}
      >
        <Textarea
          placeholder={commentPlaceholder}
          value={form.comment.value}
          onInput={(e) => {
            setCustomerReviewFormComment(
              form,
              (e.target as HTMLTextAreaElement).value,
            );
          }}
          rows={4}
        />
      </FormItem>
    </form>
  );
});

export default ReviewForm;

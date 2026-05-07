import { useState, useEffect } from "preact/hooks";
import {
  customerStore,
  getCouponCodeForm,
  initCouponCodeForm,
  setCouponCodeFormCouponCode,
  submitCouponCodeForm,
  removeCouponCodeForm,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";

interface Props {
  appliedCoupon?: string | null;
  toggleText: string;
  placeholder: string;
  applyText: string;
  removeText: string;
  applyingText: string;
}

const CouponCode = observer(function CouponCode({
  appliedCoupon,
  toggleText,
  placeholder,
  applyText,
  removeText,
  applyingText,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const couponForm = getCouponCodeForm(customerStore);

  useEffect(() => {
    initCouponCodeForm(couponForm);
  }, [couponForm]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await submitCouponCodeForm(couponForm);
  };

  const handleRemove = async () => {
    await removeCouponCodeForm(couponForm);
    setIsOpen(false);
  };

  if (appliedCoupon) {
    return (
      <div className="coupon-code">
        <div className="coupon-code__applied">
          <span className="coupon-code__value text-sm-medium">
            {appliedCoupon}
          </span>
          <button
            type="button"
            className="coupon-code__remove text-sm-medium"
            onClick={handleRemove}
          >
            {removeText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="coupon-code">
      {!isOpen ? (
        <button
          type="button"
          className="coupon-code__toggle text-sm-semibold"
          onClick={() => setIsOpen(true)}
        >
          {toggleText}
        </button>
      ) : (
        <form className="coupon-code__form" onSubmit={handleSubmit}>
          <Input
            placeholder={couponForm.couponCode?.placeholder ?? placeholder}
            value={couponForm.couponCode?.value ?? ""}
            onInput={(e: Event) =>
              setCouponCodeFormCouponCode(
                couponForm,
                (e.target as HTMLInputElement).value,
              )
            }
            status={couponForm.isFailure ? "error" : undefined}
          />
          <Button
            variant="secondary"
            size="xs"
            disabled={couponForm.isSubmitting}
          >
            {couponForm.isSubmitting ? applyingText : applyText}
          </Button>
        </form>
      )}
      {couponForm.isFailure && couponForm.responseMessage && (
        <p className="coupon-code__error text-xs-regular">
          {couponForm.responseMessage}
        </p>
      )}
    </div>
  );
});

export default CouponCode;

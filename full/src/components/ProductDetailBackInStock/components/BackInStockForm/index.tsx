import {
  IkasProductVariant,
  getProductVariantBackInStockForm,
  initBackInStockNotificationForm,
  setBackInStockNotificationFormEmail,
  submitBackInStockNotificationForm,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { useEffect } from "preact/hooks";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import FormItem from "../../../../sub-components/FormItem";

interface Props {
  variant: IkasProductVariant;
  description: string;
  emailLabel: string;
  submitButtonText: string;
  submittingText: string;
  errorMessage: string;
  onSaved: () => void;
}

// observer() because it reads the MobX-backed notification form and must
// re-render as the customer types and as the submit status flags change.
const BackInStockForm = observer(function BackInStockForm({
  variant,
  description,
  emailLabel,
  submitButtonText,
  submittingText,
  errorMessage,
  onSaved,
}: Props) {
  const form = getProductVariantBackInStockForm(variant);

  // Initialize once per variant (resets fields + validation flags).
  useEffect(() => {
    initBackInStockNotificationForm(form, variant);
  }, [form, variant]);

  const emailHasError = !!form.email?.hasError;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (await submitBackInStockNotificationForm(form)) onSaved();
  };

  const handleEmailInput = (e: Event) =>
    setBackInStockNotificationFormEmail(
      form,
      (e.target as HTMLInputElement).value,
    );

  return (
    <form className="kombos-pd-bis__form" onSubmit={handleSubmit}>
      {description && <p className="kombos-pd-bis__desc">{description}</p>}
      <FormItem
        label={emailLabel}
        htmlFor="back-in-stock-email"
        status={emailHasError ? "error" : "default"}
        helper={emailHasError ? form.email?.message : undefined}
      >
        <Input
          id="back-in-stock-email"
          type="email"
          value={form.email?.value ?? ""}
          placeholder={form.email?.placeholder}
          status={emailHasError ? "error" : "default"}
          onInput={handleEmailInput}
        />
      </FormItem>
      {form.isFailure && (
        <p className="kombos-pd-bis__error">
          {form.responseMessage || errorMessage}
        </p>
      )}
      <Button
        variant="primary"
        size="s"
        type="submit"
        className="kombos-pd-bis__submit"
        loading={form.isSubmitting}
        disabled={form.isSubmitting}
      >
        {form.isSubmitting ? submittingText : submitButtonText}
      </Button>
    </form>
  );
});

export default BackInStockForm;

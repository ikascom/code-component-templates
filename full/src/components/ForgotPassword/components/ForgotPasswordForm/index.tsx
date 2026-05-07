import {
  getForgotPasswordForm,
  setForgotPasswordFormEmail,
  submitForgotPasswordForm,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import { Props } from "../../types";
import FormItem from "../../../../sub-components/FormItem";
import Input from "../../../../sub-components/Input";
import Button from "../../../../sub-components/Button";

interface ForgotPasswordFormProps extends Props {
  forgotForm: ReturnType<typeof getForgotPasswordForm>;
}

const ForgotPasswordForm = observer(function ForgotPasswordForm({
  forgotForm,
  title = "Forgot Password",
  subtitle = "We'll send you an email to reset your password",
  emailLabel = "Email",
  emailPlaceholder = "example@email.com",
  submitButtonText = "Send",
  submittingButtonText = "Sending...",
  successTitle = "Forgot Password",
  successMessage = "We've sent you an email.",
  successButtonText = "Start Shopping",
  backToLoginText = "Back to Login",
}: ForgotPasswordFormProps) {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await submitForgotPasswordForm(forgotForm);
  };

  if (forgotForm.isSuccess) {
    return (
      <div className="forgot-password__container">
        <div className="forgot-password__header">
          <h1 className="forgot-password__title text-xl-medium md:display-xs-medium">
            {successTitle}
          </h1>
          <p className="forgot-password__subtitle text-sm-regular">
            {successMessage}
          </p>
        </div>

        <Button
          variant="primary"
          size="s"
          className="forgot-password__submit-btn"
          onClick={() => Router.navigate("/")}
        >
          {successButtonText}
        </Button>

        <div className="forgot-password__footer">
          <button
            type="button"
            className="forgot-password__back-link text-sm-medium"
            onClick={() => Router.navigateToPage("LOGIN")}
          >
            {backToLoginText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password__container">
      <div className="forgot-password__header">
        <h1 className="forgot-password__title text-xl-medium md:display-xs-medium">{title}</h1>
        <p className="forgot-password__subtitle text-sm-regular">{subtitle}</p>
      </div>

      {forgotForm.isFailure && forgotForm.responseMessage && (
        <div className="forgot-password__error-banner text-sm-regular">
          {forgotForm.responseMessage}
        </div>
      )}

      <form className="forgot-password__form" onSubmit={handleSubmit}>
        <FormItem
          label={emailLabel}
          htmlFor="forgot-email"
          status={forgotForm.email?.hasError ? "error" : "default"}
          helper={
            forgotForm.email?.hasError ? forgotForm.email.message : undefined
          }
        >
          <Input
            id="forgot-email"
            type="email"
            placeholder={emailPlaceholder}
            value={forgotForm.email?.value ?? ""}
            onInput={(e: Event) =>
              setForgotPasswordFormEmail(
                forgotForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <Button
          variant="primary"
          size="s"
          className="forgot-password__submit-btn"
          disabled={forgotForm.isSubmitting}
        >
          {forgotForm.isSubmitting ? submittingButtonText : submitButtonText}
        </Button>
      </form>

      <div className="forgot-password__footer">
        <button
          type="button"
          className="forgot-password__back-link text-sm-medium"
          onClick={() => Router.navigateToPage("LOGIN")}
        >
          {backToLoginText}
        </button>
      </div>
    </div>
  );
});

export default ForgotPasswordForm;

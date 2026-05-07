import {
  getRecoverPasswordForm,
  setRecoverPasswordFormPassword,
  setRecoverPasswordFormPasswordAgain,
  submitRecoverPasswordForm,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import { Props } from "../../types";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import FormItem from "../../../../sub-components/FormItem";

interface RecoverPasswordFormProps extends Omit<Props, "backgroundColor"> {
  recoverForm: ReturnType<typeof getRecoverPasswordForm>;
}

const RecoverPasswordForm = observer(function RecoverPasswordForm({
  recoverForm,
  title = "Change Password",
  subtitle = "Please set your new password.",
  passwordLabel = "New Password",
  passwordPlaceholder = "Password",
  passwordAgainLabel = "Confirm New Password",
  passwordAgainPlaceholder = "Password",
  submitButtonText = "Change",
  submittingButtonText = "Changing...",
  successMessage = "Your password has been successfully changed.",
  loginLinkText = "Sign In",
}: RecoverPasswordFormProps) {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const success = await submitRecoverPasswordForm(recoverForm);
    if (success) {
      Router.navigateToPage("LOGIN");
    }
  };

  return (
    <div className="recover-password__container">
      <div className="recover-password__header">
        <h1 className="recover-password__title text-xl-medium md:display-xs-medium">{title}</h1>
        <p className="recover-password__subtitle text-sm-regular">{subtitle}</p>
      </div>

      {recoverForm.isSuccess && (
        <div className="recover-password__success-banner text-sm-regular">
          {successMessage}
        </div>
      )}

      {recoverForm.isFailure && recoverForm.responseMessage && (
        <div className="recover-password__error-banner text-sm-regular">
          {recoverForm.responseMessage}
        </div>
      )}

      {!recoverForm.isSuccess && (
        <form className="recover-password__form" onSubmit={handleSubmit}>
          <FormItem
            label={passwordLabel}
            htmlFor="recover-password"
            status={recoverForm.password?.hasError ? "error" : "default"}
            helper={
              recoverForm.password?.hasError
                ? recoverForm.password.message
                : undefined
            }
          >
            <Input
              id="recover-password"
              password
              placeholder={passwordPlaceholder}
              value={recoverForm.password?.value ?? ""}
              onInput={(e: Event) =>
                setRecoverPasswordFormPassword(
                  recoverForm,
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          </FormItem>

          <FormItem
            label={passwordAgainLabel}
            htmlFor="recover-password-again"
            status={recoverForm.passwordAgain?.hasError ? "error" : "default"}
            helper={
              recoverForm.passwordAgain?.hasError
                ? recoverForm.passwordAgain.message
                : undefined
            }
          >
            <Input
              id="recover-password-again"
              password
              placeholder={passwordAgainPlaceholder}
              value={recoverForm.passwordAgain?.value ?? ""}
              onInput={(e: Event) =>
                setRecoverPasswordFormPasswordAgain(
                  recoverForm,
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          </FormItem>

          <Button
            variant="primary"
            size="s"
            className="recover-password__submit-btn"
            disabled={recoverForm.isSubmitting}
          >
            {recoverForm.isSubmitting ? submittingButtonText : submitButtonText}
          </Button>
        </form>
      )}

      <div className="recover-password__footer">
        <button
          type="button"
          className="recover-password__login-link text-sm-medium"
          onClick={() => Router.navigateToPage("LOGIN")}
        >
          {loginLinkText}
        </button>
      </div>
    </div>
  );
});

export default RecoverPasswordForm;

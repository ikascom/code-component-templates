import {
  customerStore,
  getRegisterForm,
  setRegisterFormFirstName,
  setRegisterFormLastName,
  setRegisterFormEmail,
  setRegisterFormPassword,
  setRegisterFormIsMarketingAccepted,
  setRegisterFormIsMembershipAgreementAccepted,
  submitRegisterForm,
  socialLogin,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import { Props } from "../../types";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import FormItem from "../../../../sub-components/FormItem";
import Checkbox from "../../../../sub-components/Checkbox";
import SocialLoginButton from "../../../../sub-components/SocialLoginButton";
import { GoogleSVG, FacebookSVG } from "../../../../sub-components/icons";

interface RegisterFormProps extends Props {
  registerForm: ReturnType<typeof getRegisterForm>;
}

const RegisterForm = observer(function RegisterForm({
  registerForm,
  title = "Create Account",
  subtitle = "Create your free account and start shopping.",
  firstNameLabel = "First Name",
  lastNameLabel = "Last Name",
  emailLabel = "Email",
  passwordLabel = "Password",
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  passwordPlaceholder = "Enter your password",
  submitButtonText = "Sign Up",
  submittingButtonText = "Signing up...",
  loginLinkText = "Already have an account? Sign in",
  marketingConsentText = "I want to receive emails about campaigns and promotions",
  agreementConsentText = "I accept the membership agreement",
  googleButtonText = "Sign up with Google",
  facebookButtonText = "Sign up with Facebook",
  dividerText = "or",
  showGoogleLogin = false,
  showFacebookLogin = false,
  marketingConsentLink,
  agreementConsentLink,
}: RegisterFormProps) {
  const resolvedFirstNamePlaceholder = firstNamePlaceholder || firstNameLabel;
  const resolvedLastNamePlaceholder = lastNamePlaceholder || lastNameLabel;
  const resolvedEmailPlaceholder = emailPlaceholder || emailLabel;

  const showSocialLogin = showGoogleLogin || showFacebookLogin;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const success = await submitRegisterForm(registerForm);
    if (success) {
      Router.navigateToPage("ACCOUNT");
    }
  };

  return (
    <div className="register__container">
      <div className="register__header">
        <h1 className="register__title text-xl-medium md:display-xs-medium">
          {title}
        </h1>
        <div
          className="register__subtitle text-sm-regular"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </div>

      {registerForm.isFailure && registerForm.responseMessage && (
        <div className="register__error-banner text-sm-regular">
          {registerForm.responseMessage}
        </div>
      )}

      {showSocialLogin && (
        <div className="register__social">
          {showGoogleLogin && (
            <SocialLoginButton
              icon={<GoogleSVG />}
              onClick={() => socialLogin(customerStore, "google")}
            >
              {googleButtonText}
            </SocialLoginButton>
          )}
          {showFacebookLogin && (
            <SocialLoginButton
              icon={<FacebookSVG />}
              onClick={() => socialLogin(customerStore, "facebook")}
            >
              {facebookButtonText}
            </SocialLoginButton>
          )}
        </div>
      )}

      {showSocialLogin && (
        <div className="register__divider">
          <span className="register__divider-line" />
          <span className="register__divider-text text-xs-regular">
            {dividerText}
          </span>
          <span className="register__divider-line" />
        </div>
      )}

      <form className="register__form" onSubmit={handleSubmit}>
        <FormItem
          label={firstNameLabel}
          htmlFor="register-first-name"
          status={registerForm.firstName?.hasError ? "error" : "default"}
          helper={
            registerForm.firstName?.hasError
              ? registerForm.firstName.message
              : undefined
          }
        >
          <Input
            id="register-first-name"
            name="given-name"
            autoComplete="given-name"
            placeholder={resolvedFirstNamePlaceholder}
            value={registerForm.firstName?.value ?? ""}
            onInput={(e: Event) =>
              setRegisterFormFirstName(
                registerForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <FormItem
          label={lastNameLabel}
          htmlFor="register-last-name"
          status={registerForm.lastName?.hasError ? "error" : "default"}
          helper={
            registerForm.lastName?.hasError
              ? registerForm.lastName.message
              : undefined
          }
        >
          <Input
            id="register-last-name"
            name="family-name"
            autoComplete="family-name"
            placeholder={resolvedLastNamePlaceholder}
            value={registerForm.lastName?.value ?? ""}
            onInput={(e: Event) =>
              setRegisterFormLastName(
                registerForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <FormItem
          label={emailLabel}
          htmlFor="register-email"
          status={registerForm.email?.hasError ? "error" : "default"}
          helper={
            registerForm.email?.hasError
              ? registerForm.email.message
              : undefined
          }
        >
          <Input
            id="register-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={resolvedEmailPlaceholder}
            value={registerForm.email?.value ?? ""}
            onInput={(e: Event) =>
              setRegisterFormEmail(
                registerForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <FormItem
          label={passwordLabel}
          htmlFor="register-password"
          status={registerForm.password?.hasError ? "error" : "default"}
          helper={
            registerForm.password?.hasError
              ? registerForm.password.message
              : undefined
          }
        >
          <Input
            id="register-password"
            password
            name="new-password"
            autoComplete="new-password"
            placeholder={passwordPlaceholder}
            value={registerForm.password?.value ?? ""}
            onInput={(e: Event) =>
              setRegisterFormPassword(
                registerForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <div className="register__consents">
          <div className="register__consent-field">
            <div className="register__consent-row">
              <Checkbox
                checked={registerForm.isMarketingAccepted?.value ?? false}
                onChange={(checked) =>
                  setRegisterFormIsMarketingAccepted(registerForm, checked)
                }
              />
              {marketingConsentLink?.href ? (
                <a
                  className="register__consent-label text-sm-regular"
                  href={marketingConsentLink.href}
                  target={
                    marketingConsentLink.openInNewTab ? "_blank" : undefined
                  }
                  rel={
                    marketingConsentLink.openInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  dangerouslySetInnerHTML={{ __html: marketingConsentText }}
                />
              ) : (
                <span
                  className="register__consent-label text-sm-regular"
                  dangerouslySetInnerHTML={{ __html: marketingConsentText }}
                />
              )}
            </div>
            {registerForm.isMarketingAccepted?.hasError && (
              <span className="register__consent-error text-xs-regular">
                {registerForm.isMarketingAccepted.message}
              </span>
            )}
          </div>

          <div className="register__consent-field">
            <div className="register__consent-row">
              <Checkbox
                checked={
                  registerForm.isMembershipAgreementAccepted?.value ?? false
                }
                onChange={(checked) =>
                  setRegisterFormIsMembershipAgreementAccepted(
                    registerForm,
                    checked,
                  )
                }
                status={
                  registerForm.isMembershipAgreementAccepted?.hasError
                    ? "error"
                    : "default"
                }
              />
              {agreementConsentLink?.href ? (
                <a
                  className="register__consent-label text-sm-regular"
                  href={agreementConsentLink.href}
                  target={
                    agreementConsentLink.openInNewTab ? "_blank" : undefined
                  }
                  rel={
                    agreementConsentLink.openInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  dangerouslySetInnerHTML={{ __html: agreementConsentText }}
                />
              ) : (
                <span
                  className="register__consent-label text-sm-regular"
                  dangerouslySetInnerHTML={{ __html: agreementConsentText }}
                />
              )}
            </div>
            {registerForm.isMembershipAgreementAccepted?.hasError && (
              <span className="register__consent-error text-xs-regular">
                {registerForm.isMembershipAgreementAccepted.message}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="s"
          className="register__submit-btn"
          disabled={registerForm.isSubmitting}
        >
          {registerForm.isSubmitting ? submittingButtonText : submitButtonText}
        </Button>
      </form>

      <div className="register__footer">
        <button
          type="button"
          className="register__login-link text-sm-medium"
          onClick={() => Router.navigateToPage("LOGIN")}
        >
          {loginLinkText}
        </button>
      </div>
    </div>
  );
});

export default RegisterForm;

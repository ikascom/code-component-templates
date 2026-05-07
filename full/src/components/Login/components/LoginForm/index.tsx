import {
  customerStore,
  setLoginFormEmail,
  setLoginFormPassword,
  submitLoginForm,
  socialLogin,
  Router,
  getLoginForm,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import { Props } from "../../types";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import FormItem from "../../../../sub-components/FormItem";
import SocialLoginButton from "../../../../sub-components/SocialLoginButton";
import { GoogleSVG, FacebookSVG } from "../../../../sub-components/icons";

interface LoginFormProps extends Props {
  loginForm: ReturnType<typeof getLoginForm>;
}

const LoginForm = observer(function LoginForm({
  loginForm,
  title = "Sign In",
  subtitle = "Sign in to your account to track your orders\nand continue shopping.",
  emailLabel = "Email",
  emailPlaceholder = "example@email.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Enter your password",
  forgotPasswordText = "Forgot my password",
  submitButtonText = "Sign In",
  submittingButtonText = "Signing in...",
  createAccountText = "Create new account",
  showGoogleLogin = false,
  showFacebookLogin = false,
  googleButtonText = "Sign in with Google",
  facebookButtonText = "Sign in with Facebook",
  dividerText = "or",
}: LoginFormProps) {
  const showSocialLogin = showGoogleLogin || showFacebookLogin;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const success = await submitLoginForm(loginForm);
    if (success) {
      Router.navigateToPage("ACCOUNT");
    }
  };

  return (
    <div className="login__container">
      <div className="login__header">
        <h1 className="login__title text-xl-medium md:display-xs-medium">
          {title}
        </h1>
        <div
          className="login__subtitle text-sm-regular"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </div>

      {loginForm.isFailure && loginForm.responseMessage && (
        <div className="login__error-banner text-sm-regular">
          {loginForm.responseMessage}
        </div>
      )}

      {showSocialLogin && (
        <div className="login__social">
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
        <div className="login__divider">
          <span className="login__divider-line" />
          <span className="login__divider-text text-xs-regular">
            {dividerText}
          </span>
          <span className="login__divider-line" />
        </div>
      )}

      <form className="login__form" onSubmit={handleSubmit}>
        <FormItem
          label={emailLabel}
          htmlFor="login-email"
          status={loginForm.email?.hasError ? "error" : "default"}
          helper={
            loginForm.email?.hasError ? loginForm.email.message : undefined
          }
        >
          <Input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={emailPlaceholder}
            value={loginForm.email?.value ?? ""}
            onInput={(e: Event) =>
              setLoginFormEmail(loginForm, (e.target as HTMLInputElement).value)
            }
          />
        </FormItem>

        <FormItem
          label={passwordLabel}
          htmlFor="login-password"
          status={loginForm.password?.hasError ? "error" : "default"}
          helper={
            loginForm.password?.hasError
              ? loginForm.password.message
              : undefined
          }
        >
          <Input
            id="login-password"
            password
            name="current-password"
            autoComplete="current-password"
            placeholder={passwordPlaceholder}
            value={loginForm.password?.value ?? ""}
            onInput={(e: Event) =>
              setLoginFormPassword(
                loginForm,
                (e.target as HTMLInputElement).value,
              )
            }
          />
        </FormItem>

        <div className="login__options">
          <button
            type="button"
            className="login__forgot text-sm-regular"
            onClick={() => Router.navigateToPage("FORGOT_PASSWORD")}
          >
            {forgotPasswordText}
          </button>
        </div>

        <Button
          variant="primary"
          size="s"
          className="login__submit-btn"
          disabled={loginForm.isSubmitting}
        >
          {loginForm.isSubmitting ? submittingButtonText : submitButtonText}
        </Button>
      </form>

      <div className="login__footer">
        <button
          type="button"
          className="login__create-account text-sm-regular"
          onClick={() => Router.navigateToPage("REGISTER")}
        >
          {createAccountText}
        </button>
      </div>
    </div>
  );
});

export default LoginForm;

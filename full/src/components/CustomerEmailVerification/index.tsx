import { useState, useEffect } from "preact/hooks";
import {
  customerStore,
  activateCustomer,
  resendCustomerActivationMail,
  Router,
} from "@ikas/bp-storefront";

import { Props } from "./types";
import { cx } from "../../utils/cx";
import { CheckCircleSVG, XCircleSVG } from "../../sub-components/icons";
import SpinnerIcon from "../../sub-components/SpinnerIcon";
import Button from "../../sub-components/Button";
import FormItem from "../../sub-components/FormItem";
import Input from "../../sub-components/Input";

type Status = "loading" | "success" | "error";
type ResendStatus = "idle" | "sending" | "success" | "error";

export function CustomerEmailVerification({
  title = "Account Activation",
  successTitle = "Your Account Has Been Activated!",
  successMessage = "Your account has been successfully activated. You can sign in and start shopping.",
  errorTitle = "Activation Failed",
  errorMessage = "Your activation link may be invalid or expired.",
  loadingMessage = "Activating your account...",
  loginButtonText = "Sign In",
  resendTitle = "Resend Activation Email",
  emailLabel = "Email",
  emailPlaceholder = "example@email.com",
  resendButtonText = "Resend",
  resendingButtonText = "Sending...",
  resendSuccessMessage = "Activation email has been resent. Please check your inbox.",
  resendErrorMessage = "Failed to send email. Please try again.",
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");

  useEffect(() => {
    let cancelled = false;

    activateCustomer(customerStore)
      .then((success) => {
        if (!cancelled) setStatus(success ? "success" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const resending = resendStatus === "sending";

  const handleResend = async () => {
    const trimmed = email.trim();
    if (!trimmed || resending) return;
    setResendStatus("sending");

    const success = await resendCustomerActivationMail(customerStore, trimmed);
    setResendStatus(success ? "success" : "error");
  };

  return (
    <section className="customer-email-verification">
      <div className="customer-email-verification__wrapper kombos-container">
        <div className="customer-email-verification__container">
          {status === "loading" && (
            <div className="customer-email-verification__state">
              <h1 className="customer-email-verification__title text-xl-medium md:display-xs-medium">
                {title}
              </h1>
              <SpinnerIcon className="customer-email-verification__spinner" />
              <p className="customer-email-verification__state-text text-md-regular">
                {loadingMessage}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="customer-email-verification__state">
              <div className="customer-email-verification__icon customer-email-verification__icon--success">
                <CheckCircleSVG />
              </div>
              <h1 className="customer-email-verification__title text-xl-medium md:display-xs-medium">
                {successTitle}
              </h1>
              <p className="customer-email-verification__message text-md-regular">{successMessage}</p>
              <Button
                className="customer-email-verification__action-btn"
                variant="primary"
                size="s"
                onClick={() => Router.navigateToPage("LOGIN")}
              >
                {loginButtonText}
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="customer-email-verification__state">
              <div className="customer-email-verification__icon customer-email-verification__icon--error">
                <XCircleSVG />
              </div>
              <h1 className="customer-email-verification__title text-xl-medium md:display-xs-medium">
                {errorTitle}
              </h1>
              <p className="customer-email-verification__message text-md-regular">{errorMessage}</p>

              <div className="customer-email-verification__resend">
                <h2 className="customer-email-verification__resend-title text-md-semibold md:text-lg-semibold">
                  {resendTitle}
                </h2>
                <form
                  className="customer-email-verification__resend-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleResend();
                  }}
                >
                  <FormItem label={emailLabel} htmlFor="customer-email-verification-email">
                    <Input
                      id="customer-email-verification-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder={emailPlaceholder}
                      value={email}
                      onInput={(e) =>
                        setEmail((e.target as HTMLInputElement).value)
                      }
                    />
                  </FormItem>
                  <Button
                    className="customer-email-verification__resend-btn"
                    variant="primary"
                    size="s"
                    disabled={resending || !email.trim()}
                  >
                    {resending ? resendingButtonText : resendButtonText}
                  </Button>
                </form>

                {(resendStatus === "success" || resendStatus === "error") && (
                  <div
                    className={cx(
                      "customer-email-verification__banner text-sm-regular",
                      `customer-email-verification__banner--${resendStatus}`,
                    )}
                  >
                    {resendStatus === "success"
                      ? resendSuccessMessage
                      : resendErrorMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CustomerEmailVerification;

import {
  customerStore,
  getForgotPasswordForm,
  initForgotPasswordForm,
} from "@ikas/bp-storefront";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";

import { Props } from "./types";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import PageLoader from "../../sub-components/PageLoader";

export function ForgotPassword(props: Props) {
  const forgotForm = getForgotPasswordForm(customerStore);

  const isChecking = useRedirectIfLoggedIn(() => {
    initForgotPasswordForm(forgotForm);
  });

  if (isChecking) return <PageLoader />;

  return (
    <section className="forgot-password">
      <div className="forgot-password__wrapper kombos-container">
        <ForgotPasswordForm forgotForm={forgotForm} {...props} />
      </div>
    </section>
  );
}

export default ForgotPassword;

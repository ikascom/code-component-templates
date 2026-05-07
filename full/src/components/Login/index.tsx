import {
  customerStore,
  initLoginForm,
  Router,
  getLoginForm,
  handleSocialLogin,
} from "@ikas/bp-storefront";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";

import { Props } from "./types";
import LoginForm from "./components/LoginForm";
import PageLoader from "../../sub-components/PageLoader";

export function Login(props: Props) {
  const loginForm = getLoginForm(customerStore);

  const isChecking = useRedirectIfLoggedIn(() => {
    initLoginForm(loginForm);
    handleSocialLogin(customerStore).then((result) => {
      if (result.status === "success") {
        Router.navigateToPage("ACCOUNT");
      }
    });
  });

  if (isChecking) return <PageLoader />;

  return (
    <section className="login">
      <div className="login__wrapper kombos-container">
        <LoginForm loginForm={loginForm} {...props} />
      </div>
    </section>
  );
}

export default Login;

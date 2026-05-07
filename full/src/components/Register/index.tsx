import {
  customerStore,
  getRegisterForm,
  initRegisterForm,
} from "@ikas/bp-storefront";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";

import { Props } from "./types";
import RegisterForm from "./components/RegisterForm";
import PageLoader from "../../sub-components/PageLoader";

export function Register(props: Props) {
  const registerForm = getRegisterForm(customerStore);

  const isChecking = useRedirectIfLoggedIn(() => {
    initRegisterForm(registerForm);
  });

  if (isChecking) return <PageLoader />;

  return (
    <section className="register">
      <div className="register__wrapper kombos-container">
        <RegisterForm registerForm={registerForm} {...props} />
      </div>
    </section>
  );
}

export default Register;

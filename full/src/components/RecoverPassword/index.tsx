import {
  customerStore,
  getRecoverPasswordForm,
  initRecoverPasswordForm,
} from "@ikas/bp-storefront";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";

import { Props } from "./types";
import RecoverPasswordForm from "./components/RecoverPasswordForm";
import PageLoader from "../../sub-components/PageLoader";

export function RecoverPassword(props: Props) {
  const recoverForm = getRecoverPasswordForm(customerStore);

  const isChecking = useRedirectIfLoggedIn(() => {
    initRecoverPasswordForm(recoverForm);
  });

  if (isChecking) return <PageLoader />;

  return (
    <section className="recover-password">
      <div className="recover-password__wrapper kombos-container">
        <RecoverPasswordForm recoverForm={recoverForm} {...props} />
      </div>
    </section>
  );
}

export default RecoverPassword;

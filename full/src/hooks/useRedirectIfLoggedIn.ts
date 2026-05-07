import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  Router,
} from "@ikas/bp-storefront";

/**
 * Redirects logged-in users to the account page.
 * Returns `true` while the check is in progress (use to hide content and prevent flash).
 * Calls `onGuest` only if the user is not logged in.
 */
export function useRedirectIfLoggedIn(onGuest: () => void): boolean {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    waitForCustomerStoreInit(customerStore).then(() => {
      if (!isMounted) return;
      if (customerStore.customer) {
        Router.navigateToPage("ACCOUNT");
        return;
      }
      onGuest();
      setIsChecking(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return isChecking;
}

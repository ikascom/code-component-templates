import { useState, useEffect } from "preact/hooks";
import {
  logout,
  customerStore,
  waitForCustomerStoreInit,
  Router,
  IkasThemePageType,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import AccountSidebar from "./components/AccountSidebar";
import PageLoader from "../../sub-components/PageLoader";
import type { NavItem } from "./components/AccountSidebar";

const PAGE_TYPE_MAP: Record<Exclude<NavItem, "logout">, IkasThemePageType> = {
  account: "ACCOUNT",
  orders: "ORDERS",
  addresses: "ADDRESSES",
  favorites: "FAVORITE_PRODUCTS",
};

function getActiveTabFromPath(): NavItem {
  const path = Router.getCurrentPath();
  if (path.includes("/orders")) return "orders";
  if (path.includes("/addresses")) return "addresses";
  if (path.includes("/favorite-products")) return "favorites";
  return "account";
}

export function AccountInfo(props: Props) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    waitForCustomerStoreInit(customerStore).then(() => {
      if (!customerStore.customer) {
        Router.navigateToPage("LOGIN");
      } else {
        setIsChecking(false);
      }
    });
  }, []);

  const {
    accountInfoLabel = "My Account",
    ordersLabel = "My Orders",
    addressesLabel = "My Addresses",
    favoritesLabel = "My Favorites",
    logoutLabel = "Sign Out",
    components,
  } = props;
  const activeTab = getActiveTabFromPath();

  const handleNavigate = async (item: NavItem) => {
    if (item === "logout") {
      await logout(customerStore);
      Router.navigateToPage("INDEX");
      return;
    }
    Router.navigateToPage(PAGE_TYPE_MAP[item]);
  };

  return (
    <section className="kombos-account-info">
      <div className="kombos-account-info__container kombos-container">
        <AccountSidebar
          activeItem={activeTab}
          onNavigate={handleNavigate}
          accountInfoLabel={accountInfoLabel}
          ordersLabel={ordersLabel}
          addressesLabel={addressesLabel}
          favoritesLabel={favoritesLabel}
          logoutLabel={logoutLabel}
        />

        <div className="kombos-account-info__content">
          {isChecking ? (
            <PageLoader />
          ) : (
            <IkasComponentRenderer
              id="account-info"
              components={components}
              parentProps={props}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default AccountInfo;

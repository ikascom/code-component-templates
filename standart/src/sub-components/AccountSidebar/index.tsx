import { observer } from "@ikas/component-utils";
import { withRoutePrefix } from "@ikas/bp-storefront";

export type AccountSidebarKey =
  | "profile"
  | "orders"
  | "addresses"
  | "favorites";

interface SidebarLink {
  key: AccountSidebarKey;
  label: string;
  href: string;
}

// Paths only — the routing prefix is added per render below, not here. This module is shared
// across requests on the server, so a value computed at import time would serve the first
// visitor's language to everyone after them.
const LINKS: SidebarLink[] = [
  { key: "profile", label: "Profilim", href: "/account" },
  { key: "orders", label: "Siparişlerim", href: "/account/orders" },
  { key: "favorites", label: "Favorilerim", href: "/account/favorite-products" },
  { key: "addresses", label: "Adreslerim", href: "/account/addresses" },
];

interface Props {
  activeKey?: AccountSidebarKey;
  heading?: string;
  navAriaLabel?: string;
}

const AccountSidebar = observer(function AccountSidebar({
  activeKey,
  heading = "Hesabım",
  navAriaLabel = "Hesap navigasyonu",
}: Props) {
  return (
    <aside class="account-sidebar">
      <nav class="account-sidebar__nav" aria-label={navAriaLabel}>
        <span class="account-sidebar__heading">{heading}</span>
        <ul class="account-sidebar__list">
          {LINKS.map((link) => {
            const isActive = activeKey === link.key;
            return (
              <li key={link.key}>
                <a
                  class={
                    "account-sidebar__link" +
                    (isActive ? " account-sidebar__link--active" : "")
                  }
                  href={withRoutePrefix(link.href)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
});

export default AccountSidebar;

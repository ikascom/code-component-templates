import { useState, useRef, useEffect } from "preact/hooks";
import type { FunctionComponent } from "preact";
import { cx } from "../../../../utils/cx";
import {
  User1SVG,
  Package1SVG,
  MapPin1SVG,
  Star1SVG,
  SignOut1SVG,
  CaretDownSVG,
  CheckSVG,
} from "../../../../sub-components/icons";

export type NavItem =
  | "account"
  | "orders"
  | "addresses"
  | "favorites"
  | "logout";

interface NavItemConfig {
  id: NavItem;
  labelKey: keyof Labels;
  icon: FunctionComponent<{ className?: string }>;
}

type Labels = Pick<
  Props,
  | "accountInfoLabel"
  | "ordersLabel"
  | "addressesLabel"
  | "favoritesLabel"
  | "logoutLabel"
>;

const NAV_ITEMS: NavItemConfig[] = [
  { id: "account", labelKey: "accountInfoLabel", icon: User1SVG },
  { id: "orders", labelKey: "ordersLabel", icon: Package1SVG },
  { id: "addresses", labelKey: "addressesLabel", icon: MapPin1SVG },
  { id: "favorites", labelKey: "favoritesLabel", icon: Star1SVG },
  { id: "logout", labelKey: "logoutLabel", icon: SignOut1SVG },
];

interface Props {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  accountInfoLabel: string;
  ordersLabel: string;
  addressesLabel: string;
  favoritesLabel: string;
  logoutLabel: string;
}

export default function AccountSidebar({
  activeItem,
  onNavigate,
  ...labels
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = NAV_ITEMS.find((item) => item.id === activeItem);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (id: NavItem) => {
    setDropdownOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="kombos-account-sidebar">
        <ul className="kombos-account-sidebar__list">
          {NAV_ITEMS.map(({ id, labelKey, icon: Icon }) => {
            const cls = cx(
              "kombos-account-sidebar__item text-sm-medium",
              id === activeItem && "kombos-account-sidebar__item--active",
              id === "logout" && "kombos-account-sidebar__item--logout",
            );

            return (
              <li key={id}>
                <button
                  className={cls}
                  onClick={() => handleItemClick(id)}
                >
                  <Icon className="kombos-account-sidebar__icon" />
                  {labels[labelKey]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile dropdown */}
      <div className="kombos-account-dropdown" ref={dropdownRef}>
        <div
          className={cx(
            "kombos-account-dropdown__box",
            dropdownOpen && "kombos-account-dropdown__box--open",
          )}
        >
          <button
            className={cx(
              "kombos-account-dropdown__trigger text-md-medium",
              dropdownOpen && "kombos-account-dropdown__trigger--open",
            )}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
          >
            <span className="kombos-account-dropdown__trigger-left">
              {activeConfig && (
                <activeConfig.icon className="kombos-account-icon" />
              )}
              <span>{activeConfig && labels[activeConfig.labelKey]}</span>
            </span>
            <CaretDownSVG
              className={cx(
                "kombos-account-icon kombos-account-dropdown__caret",
                dropdownOpen && "kombos-account-dropdown__caret--open",
              )}
            />
          </button>

          {dropdownOpen && (
            <ul className="kombos-account-dropdown__menu">
              {NAV_ITEMS.map(({ id, labelKey, icon: Icon }) => {
                const isActive = id === activeItem;

                return (
                  <li key={id}>
                    <button
                      className={cx(
                        "kombos-account-dropdown__menu-item",
                        isActive
                          ? "kombos-account-dropdown__menu-item--active text-sm-semibold"
                          : "text-sm-medium",
                        id === "logout" && "kombos-account-dropdown__menu-item--logout",
                      )}
                      onClick={() => handleItemClick(id)}
                    >
                      <span className="kombos-account-dropdown__menu-item-left">
                        <Icon className="kombos-account-icon" />
                        {labels[labelKey]}
                      </span>
                      {isActive && <CheckSVG className="kombos-account-icon" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

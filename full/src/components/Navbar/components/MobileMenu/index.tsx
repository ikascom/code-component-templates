import { useEffect, useState, useCallback, useRef } from "preact/hooks";
import { useScrollLock } from "../../../../hooks/useScrollLock";
import {
  IkasNavigationLink,
  customerStore,
  hasCustomer,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";
import { XSVG, ShoppingBag1SVG, CaretRightSVG, CaretLeftSVG } from "../../../../sub-components/icons";
import Button from "../../../../sub-components/Button";

interface LinkGroup {
  links: IkasNavigationLink[];
  color?: string;
}

interface Props {
  linkGroups: LinkGroup[];
  registerButtonText: string;
  loginButtonText: string;
  logoutButtonText: string;
  onClose: () => void;
  onCartOpen: () => void;
}

interface DrillDown {
  parentLabel: string;
  subLinks: IkasNavigationLink[];
}

const MobileMenu = observer(function MobileMenu({
  linkGroups,
  registerButtonText,
  loginButtonText,
  logoutButtonText,
  onClose,
  onCartOpen,
}: Props) {
  const [open, setOpen] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDown | null>(null);
  const isLoggedIn = hasCustomer(customerStore);
  const skipCleanupRef = useRef(false);

  useScrollLock(true, skipCleanupRef);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleLinkClick = useCallback(
    (link: IkasNavigationLink) => {
      if (link.href) {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleCartClick = useCallback(() => {
    skipCleanupRef.current = true;
    handleClose();
    onCartOpen();
  }, [handleClose, onCartOpen]);

  return (
    <div
      className={cx("kombos-mobile-overlay", open && "kombos-mobile-overlay--open")}
    >
      <div className="kombos-mobile-backdrop" onClick={handleClose} />
      <div className="kombos-mobile-menu">
        {/* Header */}
        <div className="kombos-mobile-menu__head">
          <button
            className="kombos-mobile-menu__icon-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <XSVG />
          </button>
          <button
            className="kombos-mobile-menu__icon-btn"
            onClick={handleCartClick}
            aria-label="Cart"
          >
            <ShoppingBag1SVG />
          </button>
        </div>

        {/* Content */}
        <div className="kombos-mobile-menu__body">
          {drillDown ? (
            <>
              {/* Back button */}
              <button
                className="kombos-mobile-menu__back"
                onClick={() => setDrillDown(null)}
              >
                <CaretLeftSVG />
                <span className="text-xs-medium">{drillDown.parentLabel}</span>
              </button>
              {/* Sub-links */}
              <nav className="kombos-mobile-menu__nav">
                {drillDown.subLinks.map(
                  (sub: IkasNavigationLink, j: number) => (
                    <a
                      key={j}
                      href={sub.href}
                      className="kombos-mobile-menu__link text-sm-medium"
                      onClick={() => handleLinkClick(sub)}
                    >
                      {sub.label}
                    </a>
                  ),
                )}
              </nav>
            </>
          ) : (
            <nav className="kombos-mobile-menu__nav">
              {linkGroups.map((group, gi) =>
                group.links.map((link: IkasNavigationLink, i: number) => {
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  return (
                    <div
                      key={`${gi}-${i}`}
                      className="kombos-mobile-menu__link-row"
                    >
                      <a
                        href={link.href}
                        className="kombos-mobile-menu__link text-sm-medium"
                        style={group.color ? { color: group.color } : undefined}
                        onClick={() => handleLinkClick(link)}
                      >
                        {link.label}
                      </a>
                      {hasSubLinks && (
                        <button
                          className="kombos-mobile-menu__drill-btn"
                          onClick={() =>
                            setDrillDown({
                              parentLabel: link.label,
                              subLinks: link.subLinks!,
                            })
                          }
                          aria-label={`${link.label} subcategories`}
                        >
                          <CaretRightSVG />
                        </button>
                      )}
                    </div>
                  );
                }),
              )}
            </nav>
          )}
        </div>

        {/* Footer */}
        <div className="kombos-mobile-menu__footer">
          {isLoggedIn ? (
            <Button
              variant="secondary"
              className="kombos-mobile-menu__footer-btn"
              onClick={() => Router.navigateToPage("ACCOUNT")}
            >
              {logoutButtonText}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                className="kombos-mobile-menu__footer-btn"
                onClick={() => Router.navigateToPage("REGISTER")}
              >
                {registerButtonText}
              </Button>
              <Button
                variant="primary"
                className="kombos-mobile-menu__footer-btn"
                onClick={() => Router.navigateToPage("LOGIN")}
              >
                {loginButtonText}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default MobileMenu;

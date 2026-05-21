import { observer } from "@ikas/component-utils";
import { useState, useEffect } from "preact/hooks";
import { IkasNavigationLink, Router, cartStore } from "@ikas/bp-storefront";

interface Props {
  open: boolean;
  links: IkasNavigationLink[];
  isLoggedIn: boolean;
  showSearch: boolean;
  showAccount: boolean;
  showCart: boolean;
  searchLabel: string;
  accountLabel: string;
  signInLabel: string;
  cartLabel: string;
  drawerAriaLabel: string;
  closeAriaLabel: string;
  onClose: () => void;
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

const MobileDrawer = observer(function MobileDrawer({
  open,
  links,
  isLoggedIn,
  showSearch,
  showAccount,
  showCart,
  searchLabel,
  accountLabel,
  signInLabel,
  cartLabel,
  drawerAriaLabel,
  closeAriaLabel,
  onClose,
  onSearchOpen,
  onCartOpen,
}: Props) {
  const cartCount = (cartStore.cart?.orderLineItems ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("mobile-drawer-overlay")) {
      onClose();
    }
  };

  return (
    <div
      class={`mobile-drawer-overlay${open ? " mobile-drawer-overlay--open" : ""}`}
      onClick={handleOverlayClick}
      aria-hidden={!open}
    >
      <nav
        class={`mobile-drawer${open ? " mobile-drawer--open" : ""}`}
        aria-label={drawerAriaLabel}
        aria-modal="true"
        role="dialog"
      >
        <div class="mobile-drawer-header">
          <button
            class="mobile-drawer-close"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {(showSearch || showCart) && (
          <div class="mobile-drawer-top-actions">
            {showSearch && (
              <button
                class="mobile-drawer-top-btn"
                onClick={() => { onClose(); onSearchOpen(); }}
                aria-label={searchLabel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span class="mobile-drawer-top-label">{searchLabel}</span>
              </button>
            )}
            {showCart && (
              <button
                class="mobile-drawer-top-btn"
                onClick={() => { onClose(); onCartOpen(); }}
                aria-label={cartCount > 0 ? `${cartLabel} (${cartCount})` : cartLabel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span class="mobile-drawer-top-label">
                  {cartLabel}
                  {cartCount > 0 ? <span class="mobile-drawer-top-count"> ({cartCount})</span> : null}
                </span>
              </button>
            )}
          </div>
        )}

        <ul class="mobile-drawer-list" role="list">
          {links.map((link, i) => {
            const hasChildren = link.subLinks?.length > 0;
            const key = `l1-${i}`;
            const isOpen = openAccordions[key];

            return (
              <li key={key} class="mobile-drawer-item">
                {hasChildren ? (
                  <>
                    <button
                      class={`mobile-drawer-accordion${isOpen ? " mobile-drawer-accordion--open" : ""}`}
                      onClick={() => toggleAccordion(key)}
                      aria-expanded={isOpen ? "true" : "false"}
                    >
                      {link.label}
                      <svg class="mobile-drawer-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <ul class="mobile-drawer-sub-list" role="list">
                        {link.subLinks.map((sub, j) => {
                          const hasSubChildren = sub.subLinks?.length > 0;
                          const subKey = `l2-${i}-${j}`;
                          const isSubOpen = openAccordions[subKey];

                          return (
                            <li key={subKey} class="mobile-drawer-sub-item">
                              {hasSubChildren ? (
                                <>
                                  <button
                                    class={`mobile-drawer-accordion mobile-drawer-accordion--sub${isSubOpen ? " mobile-drawer-accordion--open" : ""}`}
                                    onClick={() => toggleAccordion(subKey)}
                                    aria-expanded={isSubOpen ? "true" : "false"}
                                  >
                                    {sub.label}
                                    <svg class="mobile-drawer-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                  {isSubOpen && (
                                    <ul class="mobile-drawer-deep-list" role="list">
                                      {sub.subLinks.map((deep, k) => (
                                        <li key={`l3-${i}-${j}-${k}`} class="mobile-drawer-deep-item">
                                          <a
                                            href={deep.href}
                                            class="mobile-drawer-deep-link"
                                            target={deep.openInNewTab ? "_blank" : undefined}
                                            rel={deep.openInNewTab ? "noopener noreferrer" : undefined}
                                            onClick={onClose}
                                          >
                                            {deep.label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <a
                                  href={sub.href}
                                  class="mobile-drawer-sub-link"
                                  target={sub.openInNewTab ? "_blank" : undefined}
                                  rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                                  onClick={onClose}
                                >
                                  {sub.label}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    class="mobile-drawer-link"
                    target={link.openInNewTab ? "_blank" : undefined}
                    rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {showAccount && (
          <div class="mobile-drawer-footer">
            <button
              class="mobile-drawer-footer-btn"
              onClick={() => { onClose(); Router.navigateToPage(isLoggedIn ? "ACCOUNT" : "LOGIN"); }}
              aria-label={isLoggedIn ? accountLabel : signInLabel}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {isLoggedIn ? accountLabel : signInLabel}
            </button>
          </div>
        )}
      </nav>
    </div>
  );
});

export default MobileDrawer;

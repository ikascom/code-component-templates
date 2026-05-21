import { useState, useEffect, useRef } from "preact/hooks";
import {
  cartStore,
  customerStore,
  Router,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import NavDropdown from "../../sub-components/NavDropdown";
import MobileDrawer from "../../sub-components/MobileDrawer";
import SearchModal from "../../sub-components/SearchModal";
import CartDrawer from "../../sub-components/CartDrawer";
import AnnouncementBar from "../../sub-components/AnnouncementBar";

const DEMO_NAV = [
  {
    href: "/",
    label: "Skincare",
    type: "PAGE" as const,
    openInNewTab: false,
    subLinks: [
      {
        href: "/",
        label: "Moisturizers",
        type: "PAGE" as const,
        openInNewTab: false,
        subLinks: [
          { href: "/", label: "Day Cream", type: "PAGE" as const, openInNewTab: false, subLinks: [] },
          { href: "/", label: "Night Cream", type: "PAGE" as const, openInNewTab: false, subLinks: [] },
        ],
      },
      { href: "/", label: "Serums", type: "PAGE" as const, openInNewTab: false, subLinks: [] },
      { href: "/", label: "Cleansers", type: "PAGE" as const, openInNewTab: false, subLinks: [] },
    ],
  },
  {
    href: "/",
    label: "Wellness",
    type: "PAGE" as const,
    openInNewTab: false,
    subLinks: [],
  },
  {
    href: "/",
    label: "New In",
    type: "PAGE" as const,
    openInNewTab: false,
    subLinks: [],
  },
];

export function Header({
  logoText = "Congara",
  logoPosition = "left",
  logoImage,
  logoImageTransparent,
  navLinks,
  showSearch = true,
  showAccount = true,
  showCart = true,
  transparentOnHero = false,
  backgroundColor,
  searchPlaceholder = "Search products...",
  mobileSearchLabel = "Search",
  mobileAccountLabel = "My Account",
  mobileSignInLabel = "Sign In",
  mobileCartLabel = "Cart",
  popularTermsLabel = "Popular Searches",
  popularTerms = "moisturizer, vitamin c, sunscreen, retinol, lip oil, cleanser",
  popularProductsLabel = "Popular Products",
  popularProducts,
  noResultsText = "No results found",
  noResultsSubText = "Try a different keyword or browse our collections.",
  seeAllResultsText = "See all results for \"{query}\"",
  closeButtonAriaLabel = "Close search",
  searchModalAriaLabel = "Site search",
  clearInputAriaLabel = "Clear search input",
  variantCountLabel = "varyant",
  cartDrawerTitle = "Your Cart",
  cartDrawerAriaLabel = "Shopping cart",
  cartCloseButtonAriaLabel = "Close cart",
  cartRemoveItemAriaLabel = "Remove item",
  cartDecreaseQuantityAriaLabel = "Decrease quantity",
  cartIncreaseQuantityAriaLabel = "Increase quantity",
  cartEmptyTitle = "Your cart is empty",
  cartEmptySubText = "Add something beautiful to get started.",
  cartEmptyButton,
  cartSubtotalLabel = "Subtotal",
  cartTotalLabel = "Total",
  cartShippingNoteText = "Shipping calculated at checkout",
  cartShowShippingNote = true,
  cartCheckoutButtonText = "Proceed to Checkout",
  cartCheckoutButtonAriaLabel = "Proceed to checkout",
  cartContinueShoppingText = "Continue Shopping",
  cartRemoveOnZero = true,
  announcement1Text = "",
  announcement1Link,
  announcement1BackgroundColor = "#1C1917",
  announcement1TextColor = "#FFFFFF",
  announcement2Text = "",
  announcement2Link,
  announcement2BackgroundColor = "#1C1917",
  announcement2TextColor = "#FFFFFF",
  announcementAutoPlay = true,
  announcementAutoPlayInterval = 4000,
  announcementPrevAriaLabel = "Previous announcement",
  announcementNextAriaLabel = "Next announcement",
  announcementBarAriaLabel = "Announcements",
  siteActionsAriaLabel = "Site actions",
  openSearchAriaLabel = "Open search",
  accountAriaLabel = "My account",
  signInAriaLabel = "Sign in",
  cartIconAriaLabel = "Shopping cart",
  cartItemsSuffix = "items",
  mainNavAriaLabel = "Main navigation",
  mainNavLeftAriaLabel = "Main navigation left",
  mainNavRightAriaLabel = "Main navigation right",
  logoLinkAriaLabel = "Go to homepage",
  openMenuAriaLabel = "Open navigation menu",
  mobileDrawerAriaLabel = "Mobile navigation",
  mobileDrawerCloseAriaLabel = "Close navigation menu",
}: Props) {
  const [solid, setSolid] = useState(!transparentOnHero);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const apply = (h: number) => root.style.setProperty("--header-height", `${Math.round(h)}px`);
    apply(el.getBoundingClientRect().height);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.height);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--header-height");
    };
  }, []);

  const links = navLinks?.links?.length ? navLinks.links : DEMO_NAV;
  const cartCount = (cartStore.cart?.orderLineItems ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );
  const isLoggedIn = !!customerStore.customer;

  useEffect(() => {
    if (!transparentOnHero) {
      setSolid(true);
      return;
    }

    let cleanup = () => {};

    const init = () => {
      const hero = document.querySelector(".hero, .hero-slider") as HTMLElement | null;
      if (!hero) {
        setSolid(true);
        return;
      }
      const rect = hero.getBoundingClientRect();
      const heroOverlapsTop =
        rect.top + window.scrollY < 1 && rect.bottom + window.scrollY > 0;
      if (!heroOverlapsTop) {
        setSolid(true);
        return;
      }

      const onScroll = () => setSolid(window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    };

    const raf = requestAnimationFrame(init);
    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [transparentOnHero]);

  useEffect(() => {
    const lock = drawerOpen || searchOpen || cartOpen;
    if (lock) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [drawerOpen, searchOpen, cartOpen]);

  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("ikas:cart:open", handler);
    return () => window.removeEventListener("ikas:cart:open", handler);
  }, []);

  const handleCartIconClick = () => {
    const isConversion = !!(window as any).__ikasIsConversionPage;
    const isEmpty = cartCount === 0;
    if (isConversion || isEmpty) {
      setCartOpen(true);
    } else {
      Router.navigateToPage("CART");
    }
  };

  const openDropdown = (i: number) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(i);
  };

  const closeDropdown = () => {
    dropdownTimerRef.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const keepDropdown = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
  };

  const bgStyle = solid && backgroundColor ? { backgroundColor } : undefined;

  const activeLogoImage =
    !solid && logoImageTransparent?.id
      ? logoImageTransparent
      : logoImage?.id
        ? logoImage
        : null;

  const logoEl = activeLogoImage ? (
    <img
      src={getDefaultSrc(activeLogoImage)}
      srcSet={createMediaSrcset(activeLogoImage)}
      sizes="(max-width: 767px) 120px, 200px"
      alt={activeLogoImage.altText || logoText || "Logo"}
      class="header-logo-img"
      decoding="async"
    />
  ) : (
    <span class="header-logo-text">{logoText}</span>
  );

  const iconsEl = (
    <div class="header-icons" role="group" aria-label={siteActionsAriaLabel}>
      {showSearch && (
        <button
          class="header-icon-btn"
          onClick={() => setSearchOpen(true)}
          aria-label={openSearchAriaLabel}
          aria-expanded={searchOpen ? "true" : "false"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}
      {showAccount && (
        <button
          class="header-icon-btn"
          onClick={() => Router.navigateToPage(isLoggedIn ? "ACCOUNT" : "LOGIN")}
          aria-label={isLoggedIn ? accountAriaLabel : signInAriaLabel}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      )}
      {showCart && (
        <button
          class="header-icon-btn header-cart-btn"
          onClick={handleCartIconClick}
          aria-label={`${cartIconAriaLabel}${cartCount > 0 ? `, ${cartCount} ${cartItemsSuffix}` : ""}`}
          aria-expanded={cartOpen ? "true" : "false"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span class="header-cart-badge" aria-hidden="true">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      )}
    </div>
  );

  const renderNavItem = (link: typeof links[0], i: number) => {
    const hasChildren = link.subLinks?.length > 0;
    return (
      <li
        key={`${i}-${link.href}`}
        class="header-nav-item"
        onMouseEnter={() => hasChildren && openDropdown(i)}
        onMouseLeave={() => hasChildren && closeDropdown()}
      >
        <a
          href={link.href}
          class="header-nav-link"
          aria-expanded={hasChildren ? (activeDropdown === i ? "true" : "false") : undefined}
          aria-haspopup={hasChildren ? "true" : undefined}
          target={link.openInNewTab ? "_blank" : undefined}
          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {link.label}
        </a>
        {hasChildren && (
          <div onMouseEnter={keepDropdown} onMouseLeave={closeDropdown}>
            <NavDropdown links={link.subLinks} visible={activeDropdown === i} />
          </div>
        )}
      </li>
    );
  };

  const split = Math.ceil(links.length / 2);

  return (
    <>
      <header
        ref={headerRef}
        class={`header${solid ? " header--solid" : " header--transparent"}`}
        style={bgStyle}
        role="banner"
      >
        <AnnouncementBar
          announcement1Text={announcement1Text}
          announcement1Link={announcement1Link}
          announcement1BackgroundColor={announcement1BackgroundColor}
          announcement1TextColor={announcement1TextColor}
          announcement2Text={announcement2Text}
          announcement2Link={announcement2Link}
          announcement2BackgroundColor={announcement2BackgroundColor}
          announcement2TextColor={announcement2TextColor}
          autoPlay={announcementAutoPlay}
          autoPlayInterval={announcementAutoPlayInterval}
          prevAriaLabel={announcementPrevAriaLabel}
          nextAriaLabel={announcementNextAriaLabel}
          barAriaLabel={announcementBarAriaLabel}
        />
        <div class="header-inner">
          {logoPosition === "center" ? (
            <>
              <nav class="header-nav header-nav--split" aria-label={mainNavLeftAriaLabel}>
                <ul class="header-nav-list" role="list">
                  {links.slice(0, split).map((link, i) => renderNavItem(link, i))}
                </ul>
              </nav>

              <a href="/" class="header-logo header-logo--center" aria-label={logoLinkAriaLabel}>
                {logoEl}
              </a>

              <div class="header-right">
                <nav class="header-nav header-nav--split" aria-label={mainNavRightAriaLabel}>
                  <ul class="header-nav-list" role="list">
                    {links.slice(split).map((link, i) => renderNavItem(link, split + i))}
                  </ul>
                </nav>
                {iconsEl}
              </div>
            </>
          ) : (
            <>
              <a href="/" class="header-logo" aria-label={logoLinkAriaLabel}>
                {logoEl}
              </a>
              <nav class="header-nav" aria-label={mainNavAriaLabel}>
                <ul class="header-nav-list" role="list">
                  {links.map((link, i) => renderNavItem(link, i))}
                </ul>
              </nav>
              {iconsEl}
            </>
          )}

          <button
            class="header-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label={openMenuAriaLabel}
            aria-expanded={drawerOpen ? "true" : "false"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchPlaceholder={searchPlaceholder}
        popularTermsLabel={popularTermsLabel}
        popularTerms={popularTerms}
        popularProductsLabel={popularProductsLabel}
        popularProducts={popularProducts?.data ?? []}
        noResultsText={noResultsText}
        noResultsSubText={noResultsSubText}
        seeAllResultsText={seeAllResultsText}
        closeButtonAriaLabel={closeButtonAriaLabel}
        searchModalAriaLabel={searchModalAriaLabel}
        clearInputAriaLabel={clearInputAriaLabel}
        variantCountLabel={variantCountLabel}
      />

      <MobileDrawer
        open={drawerOpen}
        links={links}
        isLoggedIn={isLoggedIn}
        showSearch={showSearch}
        showAccount={showAccount}
        showCart={showCart}
        searchLabel={mobileSearchLabel}
        accountLabel={mobileAccountLabel}
        signInLabel={mobileSignInLabel}
        cartLabel={mobileCartLabel}
        drawerAriaLabel={mobileDrawerAriaLabel}
        closeAriaLabel={mobileDrawerCloseAriaLabel}
        onClose={() => setDrawerOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={handleCartIconClick}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        drawerTitle={cartDrawerTitle}
        closeButtonAriaLabel={cartCloseButtonAriaLabel}
        cartDrawerAriaLabel={cartDrawerAriaLabel}
        removeItemAriaLabel={cartRemoveItemAriaLabel}
        decreaseQuantityAriaLabel={cartDecreaseQuantityAriaLabel}
        increaseQuantityAriaLabel={cartIncreaseQuantityAriaLabel}
        emptyCartTitle={cartEmptyTitle}
        emptyCartSubText={cartEmptySubText}
        emptyCartButton={cartEmptyButton}
        subtotalLabel={cartSubtotalLabel}
        totalLabel={cartTotalLabel}
        shippingNoteText={cartShippingNoteText}
        showShippingNote={cartShowShippingNote}
        checkoutButtonText={cartCheckoutButtonText}
        checkoutButtonAriaLabel={cartCheckoutButtonAriaLabel}
        continueShoppingText={cartContinueShoppingText}
        removeOnZero={cartRemoveOnZero}
      />
    </>
  );
}

export default Header;

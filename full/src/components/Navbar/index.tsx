import { useState, useEffect } from "preact/hooks";
import {
  cartStore,
  customerStore,
  hasCustomer,
  getIkasOrderTotalItemCount,
  getDefaultSrc,
  getFormattedHeightSize,
  Router,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import CartSidebar from "./components/CartSidebar";
import MobileMenu from "./components/MobileMenu";
import SearchModal from "./components/SearchModal";
import NavItem from "./components/NavItem";
import { cx } from "../../utils/cx";
import {
  List1SVG,
  MagnifyingGlass1SVG,
  User1SVG,
  ShoppingBag1SVG,
} from "../../sub-components/icons";
export function Navbar(props: Props) {
  const {
    logo,
    navigationLinks,
    logoSizeDesktop: rawLogoSizeDesktop,
    logoSizeMobile: rawLogoSizeMobile,
    cartTitle = "My Cart",
    emptyCartText = "Your cart is empty",
    checkoutButtonText = "Proceed to Checkout",
    totalText = "Total",
    navigationLinkColor,
    coloredLinks,
    coloredLinkColor,
    registerButtonText = "Sign Up",
    loginButtonText = "Sign In",
    logoutButtonText = "Sign Out",
    freeShippingText = "Free shipping on orders over $150",
    emptyCartButtonText = "Start Shopping",
    searchPlaceholder = "What are you looking for?",
    searchingText = "Searching...",
    noResultsText = "No products found",
    resultCountText = "Result",
    addToCartText = "Add to Cart",
    addedToCartText = "Added to Cart",
    outOfStockText = "Sold Out",
    goToProductText = "View Product",
    viewAllText = "View All",
    viewCartButtonText = "View Cart",
    searchEmptyStateText = "Search for products...",
    searchProductList,
    hideAddToCartButton,
    imageAspectRatio,
    imageObjectFit,
    components,
    stickyEnabled,
    backgroundColor = "#ffffff",
    borderColor = "#ececed",
  } = props;

  const logoSizeDesktop = getFormattedHeightSize(rawLogoSizeDesktop) || "60px";
  const logoSizeMobile = getFormattedHeightSize(rawLogoSizeMobile) || "48px";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener("ikas:open-cart-sidebar", openCart);
    return () => window.removeEventListener("ikas:open-cart-sidebar", openCart);
  }, []);

  const cart = cartStore.cart;
  const itemCount = cart ? getIkasOrderTotalItemCount(cart) : 0;
  const isLoggedIn = hasCustomer(customerStore);

  const links = navigationLinks?.links ?? [];
  const coloredLinksList = coloredLinks?.links ?? [];

  return (
    <div
      className={cx("kombos-navbar", stickyEnabled && "kombos-navbar--sticky")}
      style={{
        "--logo-h-desktop": logoSizeDesktop,
        "--logo-h-mobile": logoSizeMobile,
        backgroundColor,
        borderColor,
      }}
    >
      <div className="kombos-navbar__inner kombos-container">
        {/* Hamburger - mobile only */}
        <button
          className="kombos-navbar__hamburger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menu"
        >
          <List1SVG />
        </button>

        {/* Logo */}
        {logo && (
          <a
            className="kombos-navbar__logo"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              Router.navigate("/");
            }}
            style={{
              "--logo-h-desktop": logoSizeDesktop,
              "--logo-h-mobile": logoSizeMobile,
            }}
          >
            <img
              src={getDefaultSrc(logo)}
              srcSet={createMediaSrcset(logo)}
              sizes="200px"
              alt={logo?.altText || "Logo"}
              className="kombos-navbar__logo-img"
              width={200}
              height={60}
              fetchpriority="high"
              loading="eager"
            />
          </a>
        )}

        {/* Desktop Navigation */}
        <nav
          className={`kombos-navbar__nav${!logo ? " kombos-navbar__nav--no-logo" : ""}`}
        >
          {links.map((link, i) => (
            <NavItem key={i} link={link} linkColor={navigationLinkColor} />
          ))}
          {coloredLinksList.map((link, i) => (
            <NavItem key={`cl-${i}`} link={link} linkColor={coloredLinkColor} />
          ))}
        </nav>

        {/* Action Icons */}
        <div className="kombos-navbar__actions">
          {/* Search */}
          <a
            className="kombos-navbar__icon-btn"
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchOpen(true);
            }}
            aria-label="Search"
          >
            <MagnifyingGlass1SVG />
          </a>

          {/* Account */}
          <a
            className="kombos-navbar__icon-btn"
            href={isLoggedIn ? "/account" : "/login"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Router.navigateToPage(isLoggedIn ? "ACCOUNT" : "LOGIN");
            }}
            aria-label="Account"
          >
            <User1SVG />
          </a>

          {/* Cart */}
          <a
            className="kombos-navbar__icon-btn kombos-navbar__cart-trigger"
            href="/cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCartOpen(true);
            }}
            aria-label="Cart"
          >
            <ShoppingBag1SVG />
            {itemCount > 0 && (
              <span className="kombos-navbar__badge">{itemCount}</span>
            )}
          </a>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <CartSidebar
          cartTitle={cartTitle}
          emptyCartText={emptyCartText}
          checkoutButtonText={checkoutButtonText}
          viewCartButtonText={viewCartButtonText}
          totalText={totalText}
          freeShippingText={freeShippingText}
          emptyCartButtonText={emptyCartButtonText}
          imageAspectRatio={imageAspectRatio}
          imageObjectFit={imageObjectFit}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Search Modal */}
      {searchOpen && (
        <SearchModal
          productList={searchProductList}
          logo={logo ?? undefined}
          logoSizeDesktop={logoSizeDesktop}
          logoSizeMobile={logoSizeMobile}
          searchPlaceholder={searchPlaceholder}
          searchingText={searchingText}
          noResultsText={noResultsText}
          resultCountText={resultCountText}
          addToCartText={addToCartText}
          addedToCartText={addedToCartText}
          outOfStockText={outOfStockText}
          goToProductText={goToProductText}
          viewAllText={viewAllText}
          emptyStateText={searchEmptyStateText}
          hideAddToCartButton={hideAddToCartButton}
          aspectRatio={imageAspectRatio}
          objectFit={imageObjectFit}
          onClose={() => setSearchOpen(false)}
          components={components}
          parentProps={props}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          linkGroups={[
            { links, color: navigationLinkColor },
            ...(coloredLinksList.length > 0
              ? [{ links: coloredLinksList, color: coloredLinkColor }]
              : []),
          ]}
          registerButtonText={registerButtonText}
          loginButtonText={loginButtonText}
          logoutButtonText={logoutButtonText}
          onClose={() => setMobileMenuOpen(false)}
          onCartOpen={() => setCartOpen(true)}
        />
      )}
    </div>
  );
}

export default Navbar;

// This file is auto-generated — do not edit manually.
import type { IkasImage, HeightStyleType, IkasNavigationLinkList, IkasProductList } from "@ikas/bp-storefront";
import type { AspectRatio, ObjectFit } from "../../global-types";

export interface Props {
  logo?: IkasImage | null;
  logoSizeDesktop?: HeightStyleType;
  logoSizeMobile?: HeightStyleType;
  navigationLinks?: IkasNavigationLinkList;
  navigationLinkColor?: string;
  coloredLinks?: IkasNavigationLinkList;
  coloredLinkColor?: string;
  cartTitle?: string;
  emptyCartText?: string;
  checkoutButtonText?: string;
  totalText?: string;
  freeShippingText?: string;
  emptyCartButtonText?: string;
  registerButtonText?: string;
  loginButtonText?: string;
  logoutButtonText?: string;
  searchProductList?: IkasProductList;
  hideAddToCartButton?: boolean;
  searchPlaceholder?: string;
  searchingText?: string;
  noResultsText?: string;
  resultCountText?: string;
  addToCartText?: string;
  addedToCartText?: string;
  outOfStockText?: string;
  goToProductText?: string;
  viewAllText?: string;
  components?: any;
  imageAspectRatio?: AspectRatio;
  imageObjectFit?: ObjectFit;
  viewCartButtonText?: string;
  /** When enabled, the navbar stays fixed at the top of the page and remains visible while scrolling */
  stickyEnabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  searchEmptyStateText?: string;
}

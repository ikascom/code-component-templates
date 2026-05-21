// This file is auto-generated — do not edit manually.
import type { IkasProduct } from "@ikas/bp-storefront";
import type { PdpGalleryPosition, PdpGalleryView, PdpThumbnailPosition, ProductTitleSize, SliderAspectRatio } from "../../global-types";

export interface Props {
  product?: IkasProduct | null;
  backgroundColor?: string;
  galleryPosition?: PdpGalleryPosition;
  showBreadcrumb?: boolean;
  showHomepageInBreadcrumb?: boolean;
  breadcrumbHomeText?: string;
  showThumbnails?: boolean;
  thumbnailPosition?: PdpThumbnailPosition;
  showBrandName?: boolean;
  showBadges?: boolean;
  showShortDescription?: boolean;
  showSku?: boolean;
  showBarcode?: boolean;
  showTags?: boolean;
  showFavoriteButton?: boolean;
  showQuantitySelector?: boolean;
  addToCartText?: string;
  addingToCartText?: string;
  buyNowText?: string;
  buyingNowText?: string;
  showBuyNowButton?: boolean;
  outOfStockText?: string;
  quantityLabel?: string;
  colorLabel?: string;
  sizeLabel?: string;
  skuLabel?: string;
  barcodeLabel?: string;
  newBadgeText?: string;
  discountBadgePrefix?: string;
  discountBadgeSuffix?: string;
  favoriteAriaLabel?: string;
  selectedLabel?: string;
  galleryStyle?: PdpGalleryView;
  imageAspectRatio?: SliderAspectRatio;
  descriptionTitle?: string;
  showAccordion1?: boolean;
  accordion1Title?: string;
  accordion1Body?: string;
  showAccordion2?: boolean;
  accordion2Title?: string;
  accordion2Body?: string;
  showVariantImage?: boolean;
  breadcrumbAriaLabel?: string;
  decreaseQuantityAriaLabel?: string;
  increaseQuantityAriaLabel?: string;
  showRating?: boolean;
  reviewCountLabel?: string;
  /** Uzun ürün adları için küçük önerilir */
  productNameSize?: ProductTitleSize;
  favoriteRemoveAriaLabel?: string;
}

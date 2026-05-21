// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLinkList, IkasProductList, IkasNavigationLink } from "@ikas/bp-storefront";
import type { LogoPosition } from "../../global-types";

export interface Props {
  /** Logo görseli yokken gösterilen metin */
  logoText?: string;
  /** Logo hizalaması */
  logoPosition?: LogoPosition;
  /** Logo görseli (metnin yerine geçer) */
  logoImage?: IkasImage | null;
  /** Ana menü bağlantıları (3 seviyeye kadar destekler) */
  navLinks?: IkasNavigationLinkList;
  /** Arama ikonunu göster */
  showSearch?: boolean;
  /** Hesap ikonunu göster */
  showAccount?: boolean;
  /** Sepet ikonunu göster */
  showCart?: boolean;
  /** Şeffaf başlar, kaydırınca dolu hale gelir */
  transparentOnHero?: boolean;
  /** Üst menü arka plan rengi (dolu durumda) */
  backgroundColor?: string;
  /** Arama kutusunun içinde gösterilen yer tutucu metin */
  searchPlaceholder?: string;
  /** Mobil çekmece alt kısmındaki arama butonu etiketi */
  mobileSearchLabel?: string;
  /** Müşteri giriş yaptığında hesap butonu etiketi */
  mobileAccountLabel?: string;
  /** Müşteri çıkış yapmışken hesap butonu etiketi */
  mobileSignInLabel?: string;
  /** Mobil çekmece alt kısmındaki sepet butonu etiketi */
  mobileCartLabel?: string;
  /** Üst menü hero üzerinde şeffafken kullanılacak isteğe bağlı logo (açık/ters tonlu sürüm kullanın). Boşsa ana logo görseline geçer. */
  logoImageTransparent?: IkasImage | null;
  /** Popüler arama terimleri üzerindeki etiket */
  popularTermsLabel?: string;
  /** Virgülle ayrılmış popüler arama terimleri listesi (~8'e kadar) */
  popularTerms?: string;
  /** Popüler ürün listesi üzerindeki etiket */
  popularProductsLabel?: string;
  /** Arama sorgusu boşken gösterilen ürünler */
  popularProducts?: IkasProductList;
  /** Arama sonuç döndürmediğinde gösterilen başlık */
  noResultsText?: string;
  /** Arama sonuç döndürmediğinde gösterilen alt metin */
  noResultsSubText?: string;
  /** Sonuç listesinin altında gösterilen bağlantı metni (arama terimi için yer tutucu olarak {query} kullanın) */
  seeAllResultsText?: string;
  /** Modal kapat butonu için erişilebilir etiket */
  closeButtonAriaLabel?: string;
  /** Arama penceresi için erişilebilir etiket */
  searchModalAriaLabel?: string;
  /** Giriş temizleme butonu için erişilebilir etiket */
  clearInputAriaLabel?: string;
  /** Ürün satırlarında varyant sayısının ardından gösterilen tekil sözcük (örn. '3 varyant') */
  variantCountLabel?: string;
  cartDrawerTitle?: string;
  cartDrawerAriaLabel?: string;
  cartCloseButtonAriaLabel?: string;
  cartRemoveItemAriaLabel?: string;
  cartDecreaseQuantityAriaLabel?: string;
  cartIncreaseQuantityAriaLabel?: string;
  cartEmptyTitle?: string;
  cartEmptySubText?: string;
  cartSubtotalLabel?: string;
  cartShippingNoteText?: string;
  cartShowShippingNote?: boolean;
  cartCheckoutButtonText?: string;
  cartCheckoutButtonAriaLabel?: string;
  cartContinueShoppingText?: string;
  cartRemoveOnZero?: boolean;
  cartEmptyButton?: IkasNavigationLink | null;
  cartTotalLabel?: string;
  announcement1Text?: string;
  announcement2Text?: string;
  announcementAutoPlay?: boolean;
  announcementAutoPlayInterval?: number;
  announcementPrevAriaLabel?: string;
  announcementNextAriaLabel?: string;
  announcementBarAriaLabel?: string;
  announcement1Link?: IkasNavigationLink | null;
  announcement1BackgroundColor?: string;
  announcement1TextColor?: string;
  announcement2Link?: IkasNavigationLink | null;
  announcement2BackgroundColor?: string;
  announcement2TextColor?: string;
  siteActionsAriaLabel?: string;
  openSearchAriaLabel?: string;
  accountAriaLabel?: string;
  signInAriaLabel?: string;
  cartIconAriaLabel?: string;
  cartItemsSuffix?: string;
  mainNavAriaLabel?: string;
  mainNavLeftAriaLabel?: string;
  mainNavRightAriaLabel?: string;
  logoLinkAriaLabel?: string;
  openMenuAriaLabel?: string;
  mobileDrawerAriaLabel?: string;
  mobileDrawerCloseAriaLabel?: string;
}

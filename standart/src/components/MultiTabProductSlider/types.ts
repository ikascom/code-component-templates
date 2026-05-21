// This file is auto-generated — do not edit manually.
import type { IkasProductList } from "@ikas/bp-storefront";
import type { SavingsBadgeStyle, SliderAspectRatio } from "../../global-types";

export interface Props {
  sectionTitle: string;
  tab1Label?: string;
  tab2Label?: string;
  tab3Label?: string;
  tab1Products: IkasProductList;
  tab2Products?: IkasProductList;
  tab3Products?: IkasProductList;
  backgroundColor?: string;
  textColor?: string;
  tabActiveColor?: string;
  tabInactiveColor?: string;
  accentColor?: string;
  cardAspectRatio?: SliderAspectRatio;
  productsPerView?: number;
  showProductName?: boolean;
  showPrice?: boolean;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  imageAltPrefix?: string;
  saleLabel?: string;
  soldOutLabel?: string;
  saleBadgeColor?: string;
  saleBadgeTextColor?: string;
  soldOutBadgeColor?: string;
  soldOutBadgeTextColor?: string;
  savingsBadgeColor?: string;
  savingsBadgeTextColor?: string;
  /** Tasarrufu tutar (örn. 100 TL İNDİRİM) veya yüzde (örn. %30) olarak göster */
  savingsBadgeStyle?: SavingsBadgeStyle;
  /** İki stilde de indirim değerinden sonra eklenen kelime (örn. '100 TL İNDİRİM' veya '%30 İNDİRİM'). Gizlemek için boş bırakın. */
  offLabel?: string;
  enableHoverImage?: boolean;
  showRating?: boolean;
  reviewCountLabel?: string;
  /** Sekme etiketi boş bırakıldığında ve ürün listesinden (kategori/marka/arama) bir ad türetilemediğinde kullanılır. */
  defaultTabLabel?: string;
}

// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasVideo, IkasNavigationLink } from "@ikas/bp-storefront";
import type { ContentAlignment, ContentPosition, MediaType, OverlayDirection, SectionHeight } from "../../global-types";

export interface Props {
  /** Bölümün temel rengi (medya yüklenmeden önce görünür, medya yoksa yedek) */
  backgroundColor?: string;
  /** Görsel veya video arka plan arasında seçim yapın */
  mediaType?: MediaType;
  /** Hero arka plan görseli (16/9 veya 21/9 oranı) */
  backgroundImage?: IkasImage | null;
  /** Karartı katmanı şiddeti (0–1) */
  overlayOpacity?: number;
  /** Kaplama için gradient yönü */
  overlayDirection?: OverlayDirection;
  /** Hero bölümü yüksekliği */
  sectionHeight?: SectionHeight;
  /** Yatay metin hizalaması */
  contentAlignment?: ContentAlignment;
  /** Dikey içerik konumu */
  contentPosition?: ContentPosition;
  /** Başlığın üstündeki küçük etiket (boşsa gizlenir) */
  eyebrowText?: string;
  /** Ana hero başlığı */
  heading: string;
  /** Destekleyici paragraf (boşsa gizlenir) */
  subtext?: string;
  /** Birincil CTA görünürlüğünü aç/kapat */
  showPrimaryButton?: boolean;
  /** İkincil CTA görünürlüğünü aç/kapat */
  showSecondaryButton?: boolean;
  /** Alttaki zıplayan ok (yalnızca masaüstü) */
  showScrollIndicator?: boolean;
  /** Hero arka plan videosu (poster videodan alınır) */
  backgroundVideo?: IkasVideo | null;
  primaryButtonLink?: IkasNavigationLink | null;
  secondaryButtonLink?: IkasNavigationLink | null;
  tuckUnderHeader?: boolean;
}

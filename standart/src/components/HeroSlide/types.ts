// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasVideo, IkasNavigationLink } from "@ikas/bp-storefront";
import type { ContentAlignment, ContentPosition, MediaType, OverlayDirection } from "../../global-types";

export interface Props {
  /** Görsel veya video arka plan */
  mediaType?: MediaType;
  /** Slayt görseli (16/9 veya 21/9 oranı) */
  backgroundImage?: IkasImage | null;
  /** Slayt videosu (poster videodan alınır) */
  backgroundVideo?: IkasVideo | null;
  /** Karartı katmanı şiddeti (0–1) */
  overlayOpacity?: number;
  /** Kaplama için gradient yönü */
  overlayDirection?: OverlayDirection;
  /** Yatay metin hizalaması */
  contentAlignment?: ContentAlignment;
  /** Dikey içerik konumu */
  contentPosition?: ContentPosition;
  /** Başlığın üstündeki küçük etiket (boşsa gizlenir) */
  eyebrowText?: string;
  /** Ana slayt başlığı */
  heading: string;
  /** Destekleyici paragraf (boşsa gizlenir) */
  subtext?: string;
  /** Birincil CTA görünürlüğünü aç/kapat */
  showPrimaryButton?: boolean;
  /** İkincil CTA görünürlüğünü aç/kapat */
  showSecondaryButton?: boolean;
  primaryButtonLink?: IkasNavigationLink | null;
  secondaryButtonLink?: IkasNavigationLink | null;
}

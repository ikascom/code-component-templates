// This file is auto-generated — do not edit manually.
import type { SectionHeight } from "../../global-types";

export interface Props {
  /** Bölümün temel rengi (slaytlar yüklenmeden önce görünür, medya yoksa yedek) */
  backgroundColor?: string;
  /** Hero bölümü yüksekliği */
  sectionHeight?: SectionHeight;
  /** Buraya Hero Slide bileşenlerini sürükleyin. Her slaytın kendi görseli/videosu, metni ve CTA'sı olabilir. */
  slides?: any;
  /** Slaytları otomatik geçir */
  autoplay?: boolean;
  /** Slaytlar arası saniye */
  autoplayInterval?: number;
  /** İmleç slider üzerindeyken otomatik oynatmayı duraklat */
  pauseOnHover?: boolean;
  /** Son slayttan sonra başa dön */
  loop?: boolean;
  /** Önceki / sonraki ok butonları */
  showArrows?: boolean;
  /** Alttaki sayfalama noktaları */
  showDots?: boolean;
  /** Alttaki zıplayan ok (yalnızca masaüstü) */
  showScrollIndicator?: boolean;
  /** Önceki slayt oku için aria-etiketi */
  prevButtonLabel?: string;
  /** Sonraki slayt oku için aria-etiketi */
  nextButtonLabel?: string;
  /** Sayfalama noktaları için aria-etiketi ön eki (örn. "Slayt 1'e git") */
  slideDotLabel?: string;
  tuckUnderHeader?: boolean;
}

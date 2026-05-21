// This file is auto-generated — do not edit manually.
import type { IkasProduct } from "@ikas/bp-storefront";

export interface Props {
  /** Yorumlar bölümünün üstünde gösterilen başlık metni */
  sectionTitle?: string;
  /** Bölüm başlığını göster veya gizle */
  showSectionTitle?: boolean;
  /** Doğrulanmış kullanıcı rozetinde gösterilen metin */
  verifiedBadgeLabel?: string;
  /** Değerlendirme sayısının yanında gösterilen metin (örn. 23 değerlendirme) */
  reviewCountLabel?: string;
  /** Daha fazla yorum yükleme butonunun metni */
  loadMoreButtonText?: string;
  /** Hiç yorum yokken gösterilen metin */
  emptyStateText?: string;
  /** Sayfa açıldığında gösterilen yorum sayısı */
  initialReviewCount?: number;
  /** Doğrulanmış kullanıcı rozetini göster veya gizle */
  showVerifiedBadge?: boolean;
  /** Bölümün arka plan rengi */
  backgroundColor?: string;
  /** Yorumları gösterilecek ürün */
  product?: IkasProduct | null;
}

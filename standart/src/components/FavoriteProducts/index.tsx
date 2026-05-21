import { useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  getFavoriteProducts,
  removeProductFromFavorites,
  Router,
  IkasProduct,
} from "@ikas/bp-storefront";
import FavoriteProductCard from "../../sub-components/FavoriteProductCard";
import { Props } from "./types";

type AuthState = "checking" | "authed" | "guest";

export function FavoriteProducts({
  backgroundColor = "#FAF8F5",
  pageTitle = "Favorilerim",
  showPageTitle = true,
  pageSubtitle = "Sevdiğiniz ürünleri burada toplayın",
  showPageSubtitle = false,
  itemCountSuffix = "ürün",
  emptyHeading = "Favori listeniz boş",
  emptyDescription = "Sevdiğiniz ürünleri kaydedin, hazır olduğunuzda burada bulun.",
  emptyCtaLabel = "Ürünleri Keşfet",
  emptyCtaUrl = "/collections",
  addToCartLabel = "Sepete Ekle",
  addingToCartLabel = "Ekleniyor...",
  addedToCartLabel = "Eklendi!",
  viewOptionsLabel = "Seçenekleri Gör",
  removeFavoriteAriaLabel = "Favorilerden çıkar",
  imageAltPrefix = "Favori ürün:",
  loginRequiredHeading = "Favorilerinizi görmek için giriş yapın",
  loginRequiredDescription = "Hesabınıza giriş yaptıktan sonra favori ürünlerinizi görebilirsiniz.",
  loginCtaLabel = "Giriş Yap",
  announcerAddedMessage = "Sepete eklendi",
  cardAspectRatio = "3/4",
}: Props) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [products, setProducts] = useState<IkasProduct[]>([]);
  const [removingIds, setRemovingIds] = useState<Record<string, true>>({});
  const [announcement, setAnnouncement] = useState("");
  const announceTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await waitForCustomerStoreInit(customerStore);
        if (cancelled) return;

        if (!customerStore.customer) {
          setAuthState("guest");
          setIsProductsLoading(false);
          return;
        }

        setAuthState("authed");

        const favs = await getFavoriteProducts(customerStore);
        if (cancelled) return;
        setProducts(Array.isArray(favs) ? favs : []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsProductsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (announceTimer.current) {
        window.clearTimeout(announceTimer.current);
      }
    };
  }, []);

  const handleRemove = async (productId: string) => {
    if (removingIds[productId]) return;
    const snapshot = products;
    setRemovingIds((m) => ({ ...m, [productId]: true }));
    // Let the fade-out animation play, then drop from the list
    window.setTimeout(() => {
      setProducts((list) => list.filter((p) => p.id !== productId));
    }, 280);

    try {
      const ok = await removeProductFromFavorites(customerStore, productId);
      if (!ok) {
        setProducts(snapshot);
      }
    } catch {
      setProducts(snapshot);
    } finally {
      setRemovingIds((m) => {
        const next = { ...m };
        delete next[productId];
        return next;
      });
    }
  };

  const handleAddedToCart = () => {
    setAnnouncement(announcerAddedMessage);
    if (announceTimer.current) window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => {
      setAnnouncement("");
      announceTimer.current = null;
    }, 2000);
  };

  const handleLoginClick = (e: Event) => {
    e.preventDefault();
    Router.navigateToPage("LOGIN", undefined, { redirect: "/account/favorite-products" });
  };

  const visibleCount = products.length;

  return (
    <section
      class="favorite-products"
      style={{
        ...(backgroundColor ? { backgroundColor } : null),
        "--fav-card-aspect": cardAspectRatio.replace("/", " / "),
      } as any}
      aria-busy={authState === "checking" || isProductsLoading ? "true" : undefined}
    >
      <div
        class="favorite-products__sr-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div class="favorite-products__container">
        {authState === "guest" ? (
          <div class="favorite-products__guest">
            <svg
              class="favorite-products__guest-icon"
              viewBox="0 0 64 64"
              width="64"
              height="64"
              aria-hidden="true"
            >
              <path
                d="M32 56s-22-12.5-22-28a12 12 0 0 1 22-7 12 12 0 0 1 22 7c0 15.5-22 28-22 28z"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linejoin="round"
              />
            </svg>
            <h1 class="favorite-products__guest-heading">{loginRequiredHeading}</h1>
            <p class="favorite-products__guest-description">
              {loginRequiredDescription}
            </p>
            <a
              class="favorite-products__guest-cta"
              href="/account/login"
              onClick={handleLoginClick}
            >
              {loginCtaLabel}
            </a>
          </div>
        ) : (
          <>
            {showPageTitle ? (
              <header class="favorite-products__heading">
                <div class="favorite-products__title-row">
                  <h1 class="favorite-products__title">{pageTitle}</h1>
                  {!isProductsLoading && visibleCount > 0 && (
                    <span class="favorite-products__count">
                      ({visibleCount} {itemCountSuffix})
                    </span>
                  )}
                </div>
                {showPageSubtitle && pageSubtitle ? (
                  <p class="favorite-products__subtitle">{pageSubtitle}</p>
                ) : null}
              </header>
            ) : null}

            {isProductsLoading ? (
              <ul class="favorite-products__grid" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <li key={`skeleton-${idx}`} class="favorite-products__grid-item">
                    <div class="favorite-products__skeleton">
                      <div class="favorite-products__skeleton-media" />
                      <div class="favorite-products__skeleton-line favorite-products__skeleton-line--name" />
                      <div class="favorite-products__skeleton-line favorite-products__skeleton-line--price" />
                      <div class="favorite-products__skeleton-line favorite-products__skeleton-line--btn" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : visibleCount === 0 ? (
              <div class="favorite-products__empty">
                <svg
                  class="favorite-products__empty-icon"
                  viewBox="0 0 64 64"
                  width="64"
                  height="64"
                  aria-hidden="true"
                >
                  <path
                    d="M32 56s-22-12.5-22-28a12 12 0 0 1 22-7 12 12 0 0 1 22 7c0 15.5-22 28-22 28z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                  />
                </svg>
                <h2 class="favorite-products__empty-heading">{emptyHeading}</h2>
                <p class="favorite-products__empty-description">{emptyDescription}</p>
                {emptyCtaLabel && emptyCtaUrl ? (
                  <a class="favorite-products__empty-cta" href={emptyCtaUrl}>
                    {emptyCtaLabel}
                  </a>
                ) : null}
              </div>
            ) : (
              <ul class="favorite-products__grid">
                {products.map((product, idx) => (
                  <li key={product.id} class="favorite-products__grid-item">
                    <FavoriteProductCard
                      product={product}
                      revealDelayMs={idx * 80}
                      isRemoving={!!removingIds[product.id]}
                      imageAltPrefix={imageAltPrefix}
                      addToCartLabel={addToCartLabel}
                      addingToCartLabel={addingToCartLabel}
                      addedToCartLabel={addedToCartLabel}
                      viewOptionsLabel={viewOptionsLabel}
                      removeAriaLabel={removeFavoriteAriaLabel}
                      onRemove={handleRemove}
                      onAddedToCart={handleAddedToCart}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default FavoriteProducts;

import { observer } from "@ikas/component-utils";
import { useState, useEffect, useRef, useMemo } from "preact/hooks";
import {
  IkasImage,
  IkasProduct,
  Router,
  apiSearchProducts,
  getDefaultSrc,
  getProductHref,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
  hasProductVariant,
} from "@ikas/bp-storefront";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  searchPlaceholder: string;
  popularTermsLabel: string;
  popularTerms: string;
  popularProductsLabel: string;
  popularProducts: IkasProduct[];
  noResultsText: string;
  noResultsSubText: string;
  seeAllResultsText: string;
  closeButtonAriaLabel: string;
  searchModalAriaLabel: string;
  clearInputAriaLabel: string;
  variantCountLabel: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SearchModal = observer(function SearchModal({
  isOpen,
  onClose,
  searchPlaceholder,
  popularTermsLabel,
  popularTerms,
  popularProductsLabel,
  popularProducts,
  noResultsText,
  noResultsSubText,
  seeAllResultsText,
  searchModalAriaLabel,
  clearInputAriaLabel,
  variantCountLabel,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IkasProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    if (mounted) {
      setVisible(false);
      const t = window.setTimeout(() => {
        setMounted(false);
        setQuery("");
        setResults([]);
        setLoading(false);
      }, 300);
      return () => window.clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && stackRef.current) {
        const focusables = Array.from(
          stackRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );
        if (!focusables.length) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  const trimmed = query.trim();

  useEffect(() => {
    if (!mounted) return;
    if (trimmed.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const reqId = ++reqIdRef.current;
    const t = window.setTimeout(async () => {
      try {
        const res = await apiSearchProducts({
          input: { query: trimmed, page: 1, perPage: 6 },
        } as any);
        if (reqId !== reqIdRef.current) return;
        const data = (res?.data?.data ?? []) as IkasProduct[];
        setResults(data);
      } catch {
        if (reqId !== reqIdRef.current) return;
        setResults([]);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [trimmed, mounted]);

  const terms = useMemo(
    () =>
      (popularTerms || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
    [popularTerms]
  );

  if (!mounted) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTermClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const goToProduct = (product: IkasProduct) => {
    const href = getProductHref(product);
    onClose();
    if (href) Router.navigate(href);
  };

  const goToSearch = () => {
    if (!trimmed) return;
    onClose();
    Router.navigateToPage("SEARCH", undefined, { q: trimmed });
  };

  const seeAllText = (seeAllResultsText || "").replace(/\{query\}/g, trimmed);

  const renderProductRow = (product: IkasProduct) => {
    let variant = getSelectedProductVariant(product);
    if (!variant && product.variants?.length) variant = product.variants[0];

    let image: IkasImage | null = null;
    if (variant) {
      const productImage = getProductVariantMainImage(variant);
      image = productImage?.image ?? null;
      if (!image && variant.images?.length) {
        const firstImg = variant.images.find((i) => !i.isVideo) ?? variant.images[0];
        image = firstImg?.image ?? null;
      }
    }
    const src = image ? getDefaultSrc(image) : null;

    const finalPrice = variant ? getProductVariantFormattedFinalPrice(variant) : "";
    const sellPrice = variant ? getProductVariantFormattedSellPrice(variant) : "";
    const onSale = variant ? hasProductVariantDiscount(variant) : false;
    const href = getProductHref(product);

    const hasMultipleVariants = hasProductVariant(product);
    const variantCount = hasMultipleVariants ? product.variants?.length ?? 0 : 0;

    return (
      <li
        role="listitem"
        key={product.id}
        class={`search-modal-row-li${hasMultipleVariants ? " has-variants" : ""}`}
      >
        <a
          class="search-modal-row"
          href={href}
          onClick={(e) => {
            e.preventDefault();
            goToProduct(product);
          }}
        >
          <span class="search-modal-row-thumb">
            {src ? (
              <img
                src={src}
                alt={image?.altText || product.name}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span class="search-modal-row-thumb-placeholder" aria-hidden="true" />
            )}
          </span>
          <span class="search-modal-row-meta">
            <span class="search-modal-row-name">{product.name}</span>
            {hasMultipleVariants && variantCount > 0 && (
              <span class="search-modal-row-variants">
                {variantCount} {variantCountLabel}
              </span>
            )}
          </span>
          <span class="search-modal-row-price">
            {onSale ? (
              <>
                <span class="search-modal-row-price-strike">{sellPrice}</span>
                <span class="search-modal-row-price-sale">{finalPrice}</span>
              </>
            ) : (
              <span>{finalPrice}</span>
            )}
          </span>
        </a>
      </li>
    );
  };

  const showResults = trimmed.length >= 1;
  const showNoResults = showResults && !loading && results.length === 0;
  const showResultsList = showResults && results.length > 0;
  const hasContent =
    showResults ||
    terms.length > 0 ||
    popularProducts.length > 0;

  return (
    <div
      class={`search-modal-backdrop${visible ? " is-open" : ""}`}
      onClick={handleBackdropClick}
      aria-hidden={!visible}
    >
      <div
        ref={stackRef}
        class={`search-modal-stack${visible ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={searchModalAriaLabel}
      >
        <form
          class="search-modal-bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            goToSearch();
          }}
        >
          <div class="search-modal-input-wrap">
            <input
              ref={inputRef}
              class="search-modal-input"
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              aria-label={searchModalAriaLabel}
              autoComplete="off"
              spellcheck={false}
            />
            {query && (
              <button
                type="button"
                class="search-modal-clear"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label={clearInputAriaLabel}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            class="search-modal-submit"
            aria-label={searchModalAriaLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {hasContent && (
          <div class="search-modal-card">
            {loading && <div class="search-modal-loading" aria-hidden="true" />}

            <div class="search-modal-body">
              {!showResults && (
                <>
                  {terms.length > 0 && (
                    <section class="search-modal-section" aria-label={popularTermsLabel}>
                      <h2 class="search-modal-section-label">{popularTermsLabel}</h2>
                      <ul class="search-modal-pills" role="list">
                        {terms.map((term) => (
                          <li key={term}>
                            <button
                              type="button"
                              class="search-modal-pill"
                              onClick={() => handleTermClick(term)}
                            >
                              {term}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {popularProducts.length > 0 && (
                    <section class="search-modal-section" aria-label={popularProductsLabel}>
                      <h2 class="search-modal-section-label">{popularProductsLabel}</h2>
                      <ul class="search-modal-rows" role="list">
                        {popularProducts.slice(0, 8).map(renderProductRow)}
                      </ul>
                    </section>
                  )}
                </>
              )}

              {showResultsList && (
                <section class="search-modal-section">
                  <ul class="search-modal-rows" role="list">
                    {results.map(renderProductRow)}
                  </ul>
                  <button
                    type="button"
                    class="search-modal-see-all"
                    onClick={goToSearch}
                  >
                    {seeAllText}
                  </button>
                </section>
              )}

              {showNoResults && (
                <div class="search-modal-empty">
                  <p class="search-modal-empty-title">{noResultsText}</p>
                  <p class="search-modal-empty-sub">{noResultsSubText}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchModal;

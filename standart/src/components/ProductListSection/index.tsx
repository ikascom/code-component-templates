import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  IkasProductListSortType,
  getProductListSortOptions,
  setSortType,
  hasProductListNextPage,
  getProductListNextPage,
  getProductListPage,
  hasProductListPrevPage,
  hasProductListAppliedFilters,
  clearProductListFilters,
  isProductListSearch,
  searchProductList,
  getProductListFilterCategories,
  isStockFilter,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import ProductListCard from "../../sub-components/ProductListCard";
import FilterPanel, {
  getActiveFilterChips,
} from "../../sub-components/FilterPanel";

export function ProductListSection({
  productList,
  backgroundColor = "#ffffff",
  textColor,
  columnsDesktop,
  columnsTablet,
  showFilterSidebar,
  filterPosition,
  filterLayout,
  paginationType,
  cardAspectRatio,
  showProductName,
  showPrice,
  showVariantCount,
  showRating,
  reviewCountLabel,
  enableHoverImage,
  saleLabel,
  soldOutLabel,
  offLabel,
  savingsBadgeStyle,
  showAddToCart,
  addToCartLabel,
  addingToCartLabel,
  viewOptionsLabel,
  accentColor,
  filterTitle,
  sortLabel,
  resultCountLabel,
  productCountSuffix,
  categoriesLabel,
  clearAllLabel,
  loadMoreLabel,
  emptyStateTitle,
  emptyStateDescription,
  variantCountSuffix,
  imageAltPrefix,
  applyFilterLabel,
  showAllLabel,
  filterButtonLabel,
  sortButtonLabel,
  closeLabel,
  activeFiltersAriaLabel,
  removeFilterAriaLabel,
  paginationAriaLabel,
  prevPageAriaLabel,
  nextPageAriaLabel,
  minPriceAriaPrefix,
  maxPriceAriaPrefix,
}: Props) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const prevFilterSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    (window as any).__ikasIsConversionPage = true;
    return () => { delete (window as any).__ikasIsConversionPage; };
  }, []);

  useEffect(() => {
    if (!productList) return;
    if (typeof window === "undefined") return;
    if (!isProductListSearch(productList)) return;
    const q = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (q && q !== productList.searchKeyword) {
      searchProductList(productList, q);
    }
  }, [productList]);

  if (!productList) return null;

  const products = productList.data ?? [];
  const sortOptions = getProductListSortOptions(productList);
  const selectedSort = sortOptions.find((o) => o.isSelected);

  const activeChips = useMemo(
    () => getActiveFilterChips(productList),
    [
      productList?.filters,
      productList?.filterCategories,
      productList?.searchKeyword,
    ],
  );

  const hasApplied = hasProductListAppliedFilters(productList);

  const filterSignature = useMemo(
    () => activeChips.map((c) => c.valueId).join("|"),
    [activeChips],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = prevFilterSignatureRef.current;
    prevFilterSignatureRef.current = filterSignature;
    if (prev === null) return;
    if (prev === filterSignature) return;
    const el = sectionRef.current;
    if (!el) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filterSignature]);

  const handleSort = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLSelectElement).value;
      setSortType(productList, value as IkasProductListSortType);
      setMobileSortOpen(false);
    },
    [productList],
  );

  const totalPages = Math.max(
    1,
    Math.ceil((productList.count ?? 0) / (productList.limit || 20)),
  );
  const currentPage = productList.page ?? 1;

  const sectionStyle = {
    backgroundColor,
    "--list-text-color": textColor,
    "--list-accent": accentColor,
    "--list-columns-desktop": String(columnsDesktop ?? "3"),
    "--list-columns-tablet": String(columnsTablet ?? "2"),
  } as any;

  const hasFilterContent = useMemo(() => {
    const fs = (productList.filters ?? []).filter((f) => !isStockFilter(f));
    const cats = getProductListFilterCategories(productList);
    return fs.length > 0 || cats.length > 0;
  }, [productList?.filters, productList?.filterCategories]);

  const userEnabledFilters = showFilterSidebar !== false;
  const showFilters = userEnabledFilters && hasFilterContent;
  const sidePosition = filterPosition === "right" ? "right" : "left";
  const isInlineLayout = userEnabledFilters && filterLayout === "inline";

  return (
    <section
      ref={sectionRef}
      class={`product-list-section is-filter-${sidePosition}${
        isInlineLayout ? " is-layout-inline" : ""
      }`}
      style={sectionStyle}
    >
      <div class="product-list-container">
        <div class="product-list-controls">
          <div class="product-list-result-count">
            {(() => {
              const count = productList.count ?? 0;
              const isSearch = isProductListSearch(productList);
              const pageName =
                productList.category?.name ?? productList.brand?.name ?? "";
              if (!isSearch && pageName) {
                return (
                  <>
                    <span class="product-list-result-count-title">
                      {pageName}
                    </span>{" "}
                    <span class="product-list-result-count-meta">
                      {count} {productCountSuffix}
                    </span>
                  </>
                );
              }
              return (
                <>
                  <span class="product-list-result-count-number">{count}</span>{" "}
                  <span class="product-list-result-count-label">
                    {resultCountLabel}
                  </span>
                </>
              );
            })()}
          </div>
          <div class="product-list-sort">
            <label class="product-list-sort-label" for="product-list-sort">
              {sortLabel}
            </label>
            <select
              id="product-list-sort"
              class="product-list-sort-select"
              value={selectedSort?.value ?? ""}
              onChange={handleSort}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <div class="product-list-mobile-bar">
            <button
              type="button"
              class="product-list-mobile-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <span class="product-list-mobile-icon" aria-hidden="true">
                ☰
              </span>
              {filterButtonLabel}
              {activeChips.length > 0 && (
                <span class="product-list-mobile-badge">
                  {activeChips.length}
                </span>
              )}
            </button>
            <span class="product-list-mobile-divider" aria-hidden="true" />
            <button
              type="button"
              class="product-list-mobile-btn"
              onClick={() => setMobileSortOpen((v) => !v)}
            >
              <span class="product-list-mobile-icon" aria-hidden="true">
                ⇅
              </span>
              {sortButtonLabel}
            </button>
          </div>
        )}

        {mobileSortOpen && (
          <div
            class="product-list-mobile-sort-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={sortLabel}
          >
            <div class="product-list-mobile-sort-header">
              <span class="product-list-mobile-sort-title">{sortLabel}</span>
              <button
                type="button"
                class="product-list-mobile-sort-close"
                aria-label={closeLabel}
                onClick={() => setMobileSortOpen(false)}
              >
                ×
              </button>
            </div>
            <div class="product-list-mobile-sort-options">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  class={`product-list-mobile-sort-option ${
                    opt.isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    setSortType(productList, opt.value as IkasProductListSortType);
                    setMobileSortOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div class="product-list-main">
          {showFilters && (
            <div class="product-list-sidebar">
              <FilterPanel
                productList={productList}
                filterTitle={filterTitle ?? "Filtrele"}
                clearAllLabel={clearAllLabel ?? "Tümünü Temizle"}
                showAllLabel={showAllLabel ?? "Tümünü Göster"}
                applyFilterLabel={applyFilterLabel ?? "Uygula"}
                closeLabel={closeLabel ?? "Kapat"}
                categoriesLabel={categoriesLabel ?? "Kategoriler"}
                minPriceAriaPrefix={minPriceAriaPrefix ?? "Min"}
                maxPriceAriaPrefix={maxPriceAriaPrefix ?? "Max"}
                isMobileOpen={false}
                onCloseMobile={() => {}}
                variant="desktop"
              />
            </div>
          )}

          <div class="product-list-content">
            {activeChips.length > 0 && (
              <div
                class="product-list-active-chips"
                aria-label={activeFiltersAriaLabel ?? "Active filters"}
              >
                {activeChips.map((chip) => (
                  <span key={chip.valueId} class="product-list-chip">
                    <span class="product-list-chip-label">
                      {chip.filterName}: {chip.valueName}
                    </span>
                    <button
                      type="button"
                      class="product-list-chip-remove"
                      aria-label={`${removeFilterAriaLabel ?? "Filtreyi kaldır"}: ${chip.filterName} ${chip.valueName}`}
                      onClick={chip.remove}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {hasApplied && (
                  <button
                    type="button"
                    class="product-list-chip-clear"
                    onClick={() => clearProductListFilters(productList)}
                  >
                    {clearAllLabel}
                  </button>
                )}
              </div>
            )}

            {products.length === 0 ? (
              <div class="product-list-empty">
                <h2 class="product-list-empty-title">{emptyStateTitle}</h2>
                <p class="product-list-empty-description">
                  {emptyStateDescription}
                </p>
                {hasApplied && (
                  <button
                    type="button"
                    class="product-list-empty-action"
                    onClick={() => clearProductListFilters(productList)}
                  >
                    {clearAllLabel}
                  </button>
                )}
              </div>
            ) : (
              <div
                class="product-grid"
                aria-busy={productList.isLoading ? "true" : "false"}
              >
                {products.map((product, idx) => (
                  <div
                    class="product-grid-item"
                    key={product.id}
                    style={{ "--reveal-index": idx } as any}
                  >
                    <ProductListCard
                      product={product}
                      cardAspectRatio={cardAspectRatio ?? "3/4"}
                      showProductName={showProductName !== false}
                      showPrice={showPrice !== false}
                      showVariantCount={showVariantCount !== false}
                      showRating={showRating !== false}
                      reviewCountLabel={reviewCountLabel ?? "değerlendirme"}
                      enableHoverImage={enableHoverImage === true}
                      variantCountSuffix={variantCountSuffix ?? "seçenek"}
                      imageAltPrefix={imageAltPrefix ?? ""}
                      saleLabel={saleLabel ?? "İndirim"}
                      soldOutLabel={soldOutLabel ?? "Tükendi"}
                      offLabel={offLabel ?? "İndirim"}
                      savingsBadgeStyle={savingsBadgeStyle ?? "percent"}
                      showAddToCart={showAddToCart === true}
                      addToCartLabel={addToCartLabel ?? "Sepete Ekle"}
                      addingToCartLabel={addingToCartLabel ?? "Ekleniyor"}
                      viewOptionsLabel={viewOptionsLabel ?? "Seçenekleri Gör"}
                    />
                  </div>
                ))}
              </div>
            )}

            {products.length > 0 && paginationType === "load-more" &&
              hasProductListNextPage(productList) && (
                <div class="product-list-pagination">
                  <button
                    type="button"
                    class="product-list-load-more"
                    disabled={productList.isLoading}
                    onClick={() => getProductListNextPage(productList)}
                  >
                    {productList.isLoading ? "…" : loadMoreLabel}
                  </button>
                </div>
              )}

            {products.length > 0 && paginationType === "numbered" &&
              totalPages > 1 && (
                <nav
                  class="product-list-pagination"
                  aria-label={paginationAriaLabel ?? "Pagination"}
                >
                  <ul class="product-list-pagination-list">
                    <li>
                      <button
                        type="button"
                        class="product-list-pagination-arrow"
                        disabled={!hasProductListPrevPage(productList)}
                        onClick={() =>
                          getProductListPage(productList, currentPage - 1)
                        }
                        aria-label={prevPageAriaLabel ?? "Previous page"}
                      >
                        ←
                      </button>
                    </li>
                    {buildPageList(currentPage, totalPages).map((p, i) =>
                      p === "…" ? (
                        <li key={`ellipsis-${i}`} aria-hidden="true">
                          <span class="product-list-pagination-ellipsis">
                            …
                          </span>
                        </li>
                      ) : (
                        <li key={p}>
                          <button
                            type="button"
                            class={`product-list-pagination-page ${
                              p === currentPage ? "is-current" : ""
                            }`}
                            aria-current={
                              p === currentPage ? "page" : undefined
                            }
                            onClick={() =>
                              getProductListPage(productList, p as number)
                            }
                          >
                            {p}
                          </button>
                        </li>
                      ),
                    )}
                    <li>
                      <button
                        type="button"
                        class="product-list-pagination-arrow"
                        disabled={!hasProductListNextPage(productList)}
                        onClick={() =>
                          getProductListPage(productList, currentPage + 1)
                        }
                        aria-label={nextPageAriaLabel ?? "Next page"}
                      >
                        →
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
          </div>
        </div>
      </div>

      {showFilters && (
        <FilterPanel
          productList={productList}
          filterTitle={filterTitle ?? "Filtrele"}
          clearAllLabel={clearAllLabel ?? "Tümünü Temizle"}
          showAllLabel={showAllLabel ?? "Tümünü Göster"}
          applyFilterLabel={applyFilterLabel ?? "Uygula"}
          closeLabel={closeLabel ?? "Kapat"}
          categoriesLabel={categoriesLabel ?? "Kategoriler"}
          minPriceAriaPrefix={minPriceAriaPrefix ?? "Min"}
          maxPriceAriaPrefix={maxPriceAriaPrefix ?? "Max"}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          variant="mobile"
        />
      )}
    </section>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export default ProductListSection;

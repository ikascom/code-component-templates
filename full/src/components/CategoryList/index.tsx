import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import {
  IkasProductListSortType,
  getProductListSortOptions,
  hasProductListNextPage,
  setSortType,
  getCategoryPath,
  getIkasCategoryHref,
  getFilterDisplayedValues,
  isStockFilter,
  hasProductListPrevPage,
  getProductListPrevPage,
  getProductListPage,
  setProductListVisiblePage,
  searchProductList,
  getProductOptionSet,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import ProductCard from "../../sub-components/ProductCard";
import Breadcrumb from "../../sub-components/Breadcrumb";
import type { BreadcrumbItem } from "../../sub-components/Breadcrumb";
import Button from "../../sub-components/Button";
import SpinnerIcon from "../../sub-components/SpinnerIcon";
import CategoryListControls from "./components/CategoryListControls";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterModal from "./components/MobileFilterModal";
import Pagination from "../../sub-components/Pagination";
import { useColumnPreference } from "../../hooks/useColumnPreference";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { usePageTracking } from "../../hooks/usePageTracking";

export function CategoryList(props: Props) {
  const {
    productList,
    emptyMessage = "No products found.",
    searchPlaceholder = "Search",
    clearFiltersText = "Clear Filters",
    addToCartText = "Add to Cart",
    addedToCartText = "Added",
    outOfStockText = "Sold Out",
    showProductsText = "VIEW PRODUCT",
    filtersText = "Filters",
    columnText = "Column",
    badgeText,
    homepageText = "Home",
    showFilters = false,
    showSearch = false,
    aspectRatio,
    objectFit,
    isInfinity = false,
    loadPrevPageText = "Load previous page",
    pageTitle: pageTitleProp,
    productCountText = "product",
    hideAddToCartButton,
    hideBreadcrumb = false,
    isBrandPage = false,
    components,
  } = props;

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { columns, toggleColumns } = useColumnPreference();
  const products = productList?.data ?? [];

  const { sentinelRef } = useInfiniteScroll({
    isEnabled: isInfinity,
    productList,
  });

  const { gridRef } = usePageTracking({
    isEnabled: isInfinity,
    productList,
    productCount: products.length,
  });

  useEffect(() => {
    if (!productList) return;
    const items = productList.data ?? [];
    items.forEach((p) => {
      if (!p.productOptionSet) getProductOptionSet(p);
    });
  }, [productList?.data?.length]);

  const scrollToTop = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleLoadPrevPage = useCallback(() => {
    getProductListPrevPage(productList);
    setProductListVisiblePage(productList, (productList.minPage ?? 1) - 1);
    scrollToTop();
  }, [productList, scrollToTop]);

  const openFilterModal = useCallback(() => setFilterModalOpen(true), []);
  const closeFilterModal = useCallback(() => setFilterModalOpen(false), []);

  const handleSearch = useCallback(
    (e: Event) => {
      searchProductList(productList, (e.target as HTMLInputElement).value);
    },
    [productList],
  );

  const handleSort = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLSelectElement).value;
      setSortType(productList, value as IkasProductListSortType);
    },
    [productList],
  );

  const sortSelectOptions = useMemo(
    () =>
      getProductListSortOptions(productList).map((o) => ({
        label: o.label,
        value: o.value,
      })),
    [productList],
  );

  const hasVisibleFilters = useMemo(() => {
    if (!showFilters) return false;
    const hasFilterValues = productList?.filters?.some((filter) => {
      const values = getFilterDisplayedValues(filter);
      return values.length > 0 && !isStockFilter(filter);
    });
    const hasCategoryFilters =
      productList?.filterCategories && productList.filterCategories.length > 0;
    return hasFilterValues || hasCategoryFilters;
  }, [showFilters, productList?.filters, productList?.filterCategories]);

  const selectedFiltersCount = useMemo(() => {
    const selectedCategories =
      productList?.filterCategories?.filter((c) => c.isSelected).length ?? 0;
    return (
      ((productList?.filters &&
        productList.filters
          .map((filter) => {
            if (filter.numberRangeListOptions) {
              return filter.numberRangeListOptions.filter((v) => v.isSelected)
                .length;
            }
            const displayedValues = getFilterDisplayedValues(filter);
            return displayedValues.filter((v) => v.isSelected).length;
          })
          .reduce((a, b) => a + b, 0)) ||
        0) + selectedCategories
    );
  }, [productList?.filters, productList?.filterCategories]);

  if (!productList) return null;

  const category = productList.category;
  const brand = productList.brand;
  const selectedSort = getProductListSortOptions(productList).find(
    (o) => o.isSelected,
  );
  const pageTitle = pageTitleProp || category?.name || brand?.name || "";

  const breadcrumbItems = useMemo(() => {
    if (!category) return [];
    const path = getCategoryPath(category);
    if (path.length === 0) return [];
    return [
      { label: homepageText, href: "/" } as BreadcrumbItem,
      ...path.map(
        (cat: any) =>
          ({
            label: cat.name,
            href: getIkasCategoryHref(cat),
          }) as BreadcrumbItem,
      ),
    ];
  }, [category, homepageText]);

  const startPage = productList.minPage ?? productList.page ?? 1;
  const limit = productList.limit || products.length;

  return (
    <section ref={sectionRef} className="kombos-category-list">
      <div className="kombos-container">
        {!hideBreadcrumb && breadcrumbItems.length > 0 && (
          <div className="kombos-category-list__top">
            <Breadcrumb
              items={breadcrumbItems}
              className="kombos-category-list__breadcrumb"
            />
          </div>
        )}

        <CategoryListControls
          pageTitle={pageTitle}
          productCount={productList.count}
          productCountText={productCountText}
          sortOptions={sortSelectOptions}
          selectedSortValue={selectedSort?.value ?? ""}
          onSort={handleSort}
          columns={columns}
          onToggleColumns={toggleColumns}
          columnText={columnText}
          hasVisibleFilters={!!hasVisibleFilters}
          selectedFiltersCount={selectedFiltersCount}
          filtersText={filtersText}
          onOpenFilterModal={openFilterModal}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          searchKeyword={productList.searchKeyword ?? ""}
          onSearch={handleSearch}
        />

        <div className="kombos-category-list__main">
          {hasVisibleFilters && (
            <div className="kombos-category-list__sidebar">
              <FilterSidebar
                productList={productList}
                searchPlaceholder={searchPlaceholder}
                clearFiltersText={clearFiltersText}
                showSearch={showSearch}
                onFilterChange={isInfinity ? undefined : scrollToTop}
                isBrandPage={isBrandPage}
              />
            </div>
          )}

          <div className="kombos-category-list__grid-area">
            {hasProductListPrevPage(productList) && isInfinity && (
              <div className="kombos-category-list__prev-wrap">
                <Button
                  size="xs"
                  disabled={productList.isLoading}
                  onClick={handleLoadPrevPage}
                  icon={productList.isLoading ? <SpinnerIcon /> : undefined}
                >
                  {loadPrevPageText}
                </Button>
              </div>
            )}

            {products.length === 0 ? (
              <p className="kombos-category-list__empty text-md-semibold">
                {emptyMessage}
              </p>
            ) : (
              <div
                ref={gridRef}
                className={`kombos-category-list__grid kombos-category-list__grid--cols-${columns}`}
              >
                {products.map((product, index) => {
                  const isPageStart = isInfinity && index % limit === 0;
                  const pageNum = startPage + Math.floor(index / limit);

                  return (
                    <div
                      key={product.id}
                      className="kombos-category-list__card"
                    >
                      <ProductCard
                        product={product}
                        addToCartText={addToCartText}
                        addedToCartText={addedToCartText}
                        outOfStockText={outOfStockText}
                        badgeText={badgeText}
                        aspectRatio={aspectRatio}
                        objectFit={objectFit}
                        dataPage={isPageStart ? pageNum : undefined}
                        sizes={`(max-width: 767px) calc((100vw - 48px) / 2), (max-width: 1023px) calc((100vw - 88px) / 2), calc((100vw - ${columns === 3 ? 464 : 488}px) / ${columns})`}
                        hideAddToCartButton={hideAddToCartButton}
                        priority={index < 4}
                      />
                      <IkasComponentRenderer
                        id={`category-list-product-${product.id}`}
                        components={components}
                        parentProps={props}
                        map={{ product }}
                        className="kombos-category-list__card-content"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {isInfinity && hasProductListNextPage(productList) && (
              <div
                ref={sentinelRef}
                className="kombos-category-list__sentinel"
              />
            )}

            {!isInfinity && (
              <div className="kombos-category-list__pagination">
                <Pagination
                  currentPage={productList.page ?? 1}
                  totalPages={Math.ceil(
                    (productList.count ?? 0) / (productList.limit || 20),
                  )}
                  hasPrev={hasProductListPrevPage(productList)}
                  hasNext={hasProductListNextPage(productList)}
                  onPageChange={(page) => {
                    getProductListPage(productList, page);
                    scrollToTop();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {hasVisibleFilters && (
        <MobileFilterModal
          productList={productList}
          isOpen={filterModalOpen}
          onClose={closeFilterModal}
          clearFiltersText={clearFiltersText}
          showProductsText={showProductsText}
          filtersText={filtersText}
          isBrandPage={isBrandPage}
        />
      )}
    </section>
  );
}

export default CategoryList;

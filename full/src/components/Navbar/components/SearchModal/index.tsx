import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import { useScrollLock } from "../../../../hooks/useScrollLock";
import {
  IkasProductList,
  IkasImage,
  searchProductList,
  apiSearchProducts,
  getDefaultSrc,
  isEmpty,
  Router,
  createMediaSrcset,
  getProductOptionSet,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import type { IkasProduct } from "@ikas/bp-storefront";
import { cx } from "../../../../utils/cx";
import { MagnifyingGlass1SVG, XSVG } from "../../../../sub-components/icons";
import SpinnerIcon from "../../../../sub-components/SpinnerIcon";
import ProductCard from "../../../../sub-components/ProductCard";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

const DEBOUNCE_MS = 300;

interface Props {
  productList?: IkasProductList;
  logo?: IkasImage;

  logoSizeDesktop: string;
  logoSizeMobile: string;
  searchPlaceholder: string;
  searchingText: string;
  noResultsText: string;
  resultCountText: string;
  addToCartText: string;
  addedToCartText: string;
  outOfStockText: string;
  goToProductText: string;
  viewAllText: string;
  emptyStateText: string;
  hideAddToCartButton?: boolean;
  components?: any;
  parentProps?: Record<string, any>;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  onClose: () => void;
}

const SearchModal = observer(function SearchModal({
  productList,
  logo,
  logoSizeDesktop,
  logoSizeMobile,
  searchPlaceholder,
  searchingText,
  noResultsText,
  resultCountText,
  addToCartText,
  addedToCartText,
  outOfStockText,
  goToProductText,
  viewAllText,
  emptyStateText,
  hideAddToCartButton,
  aspectRatio,
  objectFit,
  onClose,
  components,
  parentProps,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pendingSearch, setPendingSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fallback state — used when productList is not provided
  const [localProducts, setLocalProducts] = useState<IkasProduct[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localTotalCount, setLocalTotalCount] = useState(0);

  const hasProductList = !!productList;

  // Derive products, loading, totalCount from the right source
  const products = hasProductList ? (productList.data ?? []) : localProducts;
  const isLoading = hasProductList ? productList.isLoading : localLoading;
  const totalCount = hasProductList
    ? (productList.count ?? 0)
    : localTotalCount;

  useEffect(() => {
    products.forEach((p) => {
      if (!p.productOptionSet) getProductOptionSet(p);
    });
  }, [products.length]);

  useEffect(() => {
    if (!isLoading) setPendingSearch(false);
  }, [isLoading]);

  // Fallback: debounced apiSearchProducts when no productList
  useEffect(() => {
    if (hasProductList) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setLocalProducts([]);
      setLocalLoading(false);
      setLocalTotalCount(0);
      return;
    }

    setLocalLoading(true);
    setPendingSearch(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await apiSearchProducts({
          input: { query: query.trim(), perPage: 12 },
        });
        const data = response?.data?.data ?? [];
        const count = response?.data?.totalCount ?? data.length;
        setLocalProducts(data);
        setLocalTotalCount(count);
      } catch {
        setLocalProducts([]);
        setLocalTotalCount(0);
      }
      setLocalLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, hasProductList]);

  useScrollLock();

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleInput = useCallback(
    (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      setQuery(value);
      setPendingSearch(true);
      if (hasProductList) {
        searchProductList(productList!, value);
      }
      // Fallback mode triggers via the useEffect above
    },
    [productList, hasProductList],
  );

  // Show initial products from productList when query is empty
  const showInitialProducts =
    hasProductList && !query.trim() && !isEmpty(products);
  const showResults =
    !isLoading &&
    !isEmpty(products) &&
    (query.trim().length > 0 || showInitialProducts);
  const showNoResults =
    !isLoading && isEmpty(products) && query.trim().length > 0;

  return (
    <div
      className={cx(
        "kombos-search-overlay",
        open && "kombos-search-overlay--open",
      )}
      onClick={handleClose}
    >
      {/* Panel */}
      <div
        className="kombos-search__panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="kombos-search__header">
          {/* Logo */}
          <div className="kombos-search__logo-area">
            {logo && (
              <a
                href="/"
                className="kombos-search__logo"
                style={{
                  "--search-logo-h-desktop": logoSizeDesktop,
                  "--search-logo-h-mobile": logoSizeMobile,
                }}
              >
                <img
                  src={getDefaultSrc(logo)}
                  srcSet={createMediaSrcset(logo)}
                  sizes="120px"
                  alt={logo?.altText || "Logo"}
                  className="kombos-search__logo-img"
                />
              </a>
            )}
          </div>

          {/* Search Input */}
          <Input
            className="kombos-search__input-wrap"
            leftIcon={<MagnifyingGlass1SVG />}
            inputRef={inputRef}
            placeholder={searchPlaceholder}
            value={query}
            onInput={handleInput}
          />

          {/* Close */}
          <div className="kombos-search__close-area">
            <button
              className="kombos-search__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <XSVG />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="kombos-search__body">
          {/* Empty state — no productList and no query */}
          {!hasProductList && !query.trim() && (
            <div className="kombos-search__status kombos-search__empty-state">
              <MagnifyingGlass1SVG className="kombos-search__empty-icon" />
              <span className="text-xl-medium md:display-xs-medium">
                {emptyStateText}
              </span>
            </div>
          )}

          {/* Searching */}
          {isLoading && (
            <div className="kombos-search__status">
              <SpinnerIcon className="kombos-search__spinner" />
              <span className="text-xl-medium md:display-xs-medium">
                {searchingText}
              </span>
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="kombos-search__status">
              <span className="text-xl-medium md:display-xs-medium">
                {noResultsText}
              </span>
            </div>
          )}

          {/* Result Count */}
          {!isLoading &&
            !pendingSearch &&
            query.trim().length > 0 &&
            !isEmpty(products) && (
              <div className="kombos-search__result-count">
                <span className="text-xl-medium md:display-xs-medium">
                  {totalCount} {resultCountText}
                </span>
              </div>
            )}

          {/* Results */}
          {showResults && (
            <>
              <div className="kombos-search__grid">
                {products.map((product) => (
                  <div key={product.id} className="kombos-search__card">
                    <ProductCard
                      product={product}
                      addToCartText={addToCartText}
                      addedToCartText={addedToCartText}
                      outOfStockText={outOfStockText}
                      goToProductText={goToProductText}
                      hideAddToCartButton={hideAddToCartButton}
                      openCartOnAdd={false}
                      aspectRatio={aspectRatio}
                      objectFit={objectFit}
                      sizes="(max-width: 767px) calc((100vw - 44px) / 2), (max-width: 1023px) calc((100vw - 48px) / 2), calc((100vw - 240px) / 5)"
                    />
                    <IkasComponentRenderer
                      id={`search-modal-product-${product.id}`}
                      components={components}
                      parentProps={parentProps}
                      map={{
                        product,
                      }}
                      className="kombos-search__card-content"
                    />
                  </div>
                ))}
              </div>
              {query.trim().length > 0 && (
                <div className="kombos-search__view-all">
                  <Button
                    variant="primary"
                    className="kombos-search__view-all-btn"
                    onClick={() => {
                      Router.navigateToPage("SEARCH", undefined, {
                        q: query.trim(),
                      });
                      handleClose();
                    }}
                  >
                    {viewAllText}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default SearchModal;

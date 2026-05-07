import { useState, useEffect, useCallback } from "preact/hooks";
import { useScrollLock } from "../../../../hooks/useScrollLock";
import {
  IkasProductList,
  getProductListFilterCategories,
  clearProductListFilters,
  hasProductListAppliedFilters,
  getSelectedFilterValues,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";
import { XSVG } from "../../../../sub-components/icons";
import CollapsibleGroup from "../../../../sub-components/CollapsibleGroup";
import FilterCategoryList from "../FilterCategoryList";
import FilterGroupValues from "../FilterGroupValues";

interface Props {
  productList: IkasProductList;
  isOpen: boolean;
  onClose: () => void;
  clearFiltersText: string;
  showProductsText: string;
  filtersText: string;
  isBrandPage?: boolean;
}

const MobileFilterModal = observer(function MobileFilterModal({
  productList,
  isOpen,
  onClose,
  clearFiltersText,
  showProductsText,
  filtersText,
  isBrandPage = false,
}: Props) {
  const [open, setOpen] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => setOpen(true));
    return () => setOpen(false);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const filters = productList.filters ?? [];
  const filterCategories = getProductListFilterCategories(productList);
  const hasApplied = hasProductListAppliedFilters(productList);
  const selectedValues = getSelectedFilterValues(productList);
  const activeFilterCount = selectedValues?.length ?? 0;
  const totalProducts = productList.count ?? 0;

  const handleClear = () => {
    clearProductListFilters(productList);
  };

  const isLoading = productList.isLoading;

  if (!isOpen) return null;

  return (
    <div
      className={cx(
        "kombos-mobile-filter",
        open && "kombos-mobile-filter--open",
      )}
    >
      <div className="kombos-mobile-filter__backdrop" onClick={handleClose} />
      <div className="kombos-mobile-filter__panel">
        {/* Header */}
        <div className="kombos-mobile-filter__header">
          <span className="kombos-mobile-filter__title text-md-medium">
            {filtersText}
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </span>
          <button
            type="button"
            className="kombos-mobile-filter__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <XSVG />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="kombos-mobile-filter__content">
          {filterCategories.length > 0 && (
            <CollapsibleGroup
              title={productList.category?.name ?? ""}
              defaultOpen
            >
              <FilterCategoryList
                productList={productList}
                categories={filterCategories}
                isBrandPage={isBrandPage}
              />
            </CollapsibleGroup>
          )}

          {filters.map((filter) => (
            <FilterGroupValues
              key={filter.id}
              productList={productList}
              filter={filter}
            />
          ))}
        </div>

        {/* Sticky footer */}
        <div className="kombos-mobile-filter__footer">
          {hasApplied && (
            <div className="kombos-mobile-filter__clear-row">
              <button
                type="button"
                className="kombos-mobile-filter__clear-btn text-xs-semibold"
                onClick={handleClear}
              >
                {clearFiltersText}
              </button>
            </div>
          )}
          <button
            type="button"
            className="kombos-mobile-filter__show-btn text-sm-semibold"
            onClick={handleClose}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="kombos-mobile-filter__spinner" />
            ) : (
              `${totalProducts} ${showProductsText}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default MobileFilterModal;

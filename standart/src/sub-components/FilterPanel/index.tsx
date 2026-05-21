import { observer } from "@ikas/component-utils";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  IkasProductList,
  IkasProductFilter,
  IkasApplicableProductFilterValue,
  IkasFilterCategory,
  getFilterDisplayedValues,
  getProductListFilterCategories,
  getProductListCurrencySymbol,
  handleFilterValueClick,
  hasProductListAppliedFilters,
  clearProductListFilters,
  onFilterCategoryClick,
  onNumberRangeFilterChange,
  isStockFilter,
} from "@ikas/bp-storefront";

interface Props {
  productList: IkasProductList;
  filterTitle: string;
  clearAllLabel: string;
  showAllLabel: string;
  applyFilterLabel: string;
  closeLabel: string;
  categoriesLabel: string;
  minPriceAriaPrefix?: string;
  maxPriceAriaPrefix?: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  variant: "desktop" | "mobile";
}

const FilterPanel = observer(function FilterPanel({
  productList,
  filterTitle,
  clearAllLabel,
  showAllLabel,
  applyFilterLabel,
  closeLabel,
  categoriesLabel,
  minPriceAriaPrefix = "Min",
  maxPriceAriaPrefix = "Max",
  isMobileOpen,
  onCloseMobile,
  variant,
}: Props) {
  const filters = (productList?.filters ?? []).filter(
    (f) => !isStockFilter(f),
  );
  const filterCategories = getProductListFilterCategories(productList);
  const hasApplied = hasProductListAppliedFilters(productList);

  const isMobile = variant === "mobile";

  if (isMobile && !isMobileOpen) return null;

  return (
    <aside
      class={`filter-panel filter-panel--${variant} ${
        isMobile && isMobileOpen ? "is-open" : ""
      }`}
      aria-modal={isMobile ? "true" : undefined}
      role={isMobile ? "dialog" : undefined}
      aria-label={isMobile ? filterTitle : undefined}
    >
      <div class="filter-panel-header">
        <span class="filter-panel-title">{filterTitle}</span>
        {isMobile && (
          <button
            type="button"
            class="filter-panel-close"
            aria-label={closeLabel}
            onClick={onCloseMobile}
          >
            ×
          </button>
        )}
      </div>

      <div class="filter-panel-scroll">
        {filterCategories.length > 0 && (
          <FilterCategoryGroup
            productList={productList}
            categories={filterCategories}
            title={
              productList?.category?.name?.trim() || categoriesLabel
            }
          />
        )}

        {filters.map((filter) => (
          <FilterAccordion
            key={filter.id}
            productList={productList}
            filter={filter}
            showAllLabel={showAllLabel}
            minPriceAriaPrefix={minPriceAriaPrefix}
            maxPriceAriaPrefix={maxPriceAriaPrefix}
          />
        ))}
      </div>

      <div class="filter-panel-footer">
        {hasApplied && (
          <button
            type="button"
            class="filter-panel-clear"
            onClick={() => clearProductListFilters(productList)}
          >
            {clearAllLabel}
          </button>
        )}
        {isMobile && (
          <button
            type="button"
            class="filter-panel-apply"
            onClick={onCloseMobile}
          >
            {applyFilterLabel}
          </button>
        )}
      </div>
    </aside>
  );
});

interface CategoryGroupProps {
  productList: IkasProductList;
  categories: IkasFilterCategory[];
  title: string;
}

const FilterCategoryGroup = observer(function FilterCategoryGroup({
  productList,
  categories,
  title,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(true);
  return (
    <div class={`filter-accordion ${open ? "is-open" : ""}`}>
      <button
        type="button"
        class="filter-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span class="filter-accordion-icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div class="filter-accordion-content">
        <div class="filter-category-list">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              class={`filter-category-link ${cat.isSelected ? "is-selected" : ""}`}
              onClick={() => onFilterCategoryClick(productList, cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

interface AccordionProps {
  productList: IkasProductList;
  filter: IkasProductFilter;
  showAllLabel: string;
  minPriceAriaPrefix: string;
  maxPriceAriaPrefix: string;
}

const VISIBLE_LIMIT = 5;

const FilterAccordion = observer(function FilterAccordion({
  productList,
  filter,
  showAllLabel,
  minPriceAriaPrefix,
  maxPriceAriaPrefix,
}: AccordionProps) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const values = getFilterDisplayedValues(filter);
  const isRange = filter.displayType === "NUMBER_RANGE";

  if (values.length === 0 && !isRange) return null;

  const visibleValues = showAll ? values : values.slice(0, VISIBLE_LIMIT);
  const hasMore = values.length > VISIBLE_LIMIT;

  return (
    <div class={`filter-accordion ${open ? "is-open" : ""}`}>
      <button
        type="button"
        class="filter-accordion-trigger"
        aria-expanded={open}
        aria-controls={`filter-${filter.id}`}
        onClick={() => setOpen(!open)}
      >
        <span>{filter.name}</span>
        <span class="filter-accordion-icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={`filter-${filter.id}`} class="filter-accordion-content">
        {isRange ? (
          <PriceRangeControl
            productList={productList}
            filter={filter}
            minPriceAriaPrefix={minPriceAriaPrefix}
            maxPriceAriaPrefix={maxPriceAriaPrefix}
          />
        ) : (
          <>
            <div class="filter-option-list">
              {visibleValues.map((fv) => (
                <FilterOption
                  key={fv.id}
                  productList={productList}
                  filter={filter}
                  value={fv}
                />
              ))}
            </div>
            {hasMore && !showAll && (
              <button
                type="button"
                class="filter-show-all"
                onClick={() => setShowAll(true)}
              >
                {showAllLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

interface OptionProps {
  productList: IkasProductList;
  filter: IkasProductFilter;
  value: IkasApplicableProductFilterValue;
}

const FilterOption = observer(function FilterOption({
  productList,
  filter,
  value,
}: OptionProps) {
  const isSelected = value.isSelected === true;
  return (
    <label class={`filter-option ${isSelected ? "is-selected" : ""}`}>
      <input
        type="checkbox"
        class="filter-option-checkbox"
        checked={isSelected}
        aria-label={value.name}
        onChange={() => handleFilterValueClick(productList, filter, value)}
      />
      <span class="filter-option-mark" aria-hidden="true" />
      <span class="filter-option-label">{value.name}</span>
      {value.resultCount != null && (
        <span class="filter-option-count">({value.resultCount})</span>
      )}
    </label>
  );
});

interface RangeProps {
  productList: IkasProductList;
  filter: IkasProductFilter;
  minPriceAriaPrefix: string;
  maxPriceAriaPrefix: string;
}

const PriceRangeControl = observer(function PriceRangeControl({
  productList,
  filter,
  minPriceAriaPrefix,
  maxPriceAriaPrefix,
}: RangeProps) {
  const limit = filter.numberRangeLimit;
  const range = filter.numberRange;
  const minBound = limit?.from ?? 0;
  const maxBound = limit?.to ?? 0;

  const [from, setFrom] = useState(range?.from ?? minBound);
  const [to, setTo] = useState(range?.to ?? maxBound);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setFrom(range?.from ?? minBound);
    setTo(range?.to ?? maxBound);
  }, [range?.from, range?.to, minBound, maxBound]);

  const symbol = getProductListCurrencySymbol(productList);

  const queueApply = (nextFrom: number, nextTo: number) => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      onNumberRangeFilterChange(filter, { from: nextFrom, to: nextTo });
    }, 400);
  };

  if (minBound === maxBound) return null;

  return (
    <div class="filter-range">
      <div class="filter-range-inputs">
        <div class="filter-range-field">
          <label class="filter-range-label">
            <span aria-hidden="true">{symbol}</span>
            <input
              type="number"
              class="filter-range-input"
              min={minBound}
              max={to}
              value={from}
              aria-label={`${minPriceAriaPrefix} ${filter.name}`}
              onInput={(e) => {
                const v = Number((e.target as HTMLInputElement).value);
                if (Number.isFinite(v)) {
                  setFrom(v);
                  queueApply(v, to);
                }
              }}
            />
          </label>
        </div>
        <span class="filter-range-divider" aria-hidden="true">
          –
        </span>
        <div class="filter-range-field">
          <label class="filter-range-label">
            <span aria-hidden="true">{symbol}</span>
            <input
              type="number"
              class="filter-range-input"
              min={from}
              max={maxBound}
              value={to}
              aria-label={`${maxPriceAriaPrefix} ${filter.name}`}
              onInput={(e) => {
                const v = Number((e.target as HTMLInputElement).value);
                if (Number.isFinite(v)) {
                  setTo(v);
                  queueApply(from, v);
                }
              }}
            />
          </label>
        </div>
      </div>
      <div class="filter-range-bounds">
        <span>
          {minBound} {symbol}
        </span>
        <span>
          {maxBound} {symbol}
        </span>
      </div>
    </div>
  );
});

export default FilterPanel;

interface ActiveFilterChip {
  filterId: string;
  filterName: string;
  valueId: string;
  valueName: string;
  remove: () => void;
}

export function getActiveFilterChips(
  productList: IkasProductList,
): ActiveFilterChip[] {
  const out: ActiveFilterChip[] = [];
  const filters = productList?.filters ?? [];
  filters.forEach((filter) => {
    if (isStockFilter(filter)) return;
    const values = getFilterDisplayedValues(filter);
    values.forEach((v) => {
      if (v.isSelected) {
        out.push({
          filterId: filter.id,
          filterName: filter.name,
          valueId: v.id,
          valueName: v.name,
          remove: () => handleFilterValueClick(productList, filter, v),
        });
      }
    });
    if (filter.displayType === "NUMBER_RANGE" && filter.numberRange) {
      const { from, to } = filter.numberRange;
      const limit = filter.numberRangeLimit;
      const isFromBound = limit && from === limit.from;
      const isToBound = limit && to === limit.to;
      if (!(isFromBound && isToBound)) {
        out.push({
          filterId: filter.id,
          filterName: filter.name,
          valueId: `${filter.id}-range`,
          valueName: `${from} – ${to}`,
          remove: () => onNumberRangeFilterChange(filter, null),
        });
      }
    }
  });
  return out;
}

export function useFilterChipsCount(productList: IkasProductList): number {
  return useMemo(
    () => getActiveFilterChips(productList).length,
    [productList?.filters, productList?.filterCategories],
  );
}

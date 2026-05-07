import {
  IkasProductList,
  getProductListFilterCategories,
  searchProductList,
  clearProductListFilters,
  hasProductListAppliedFilters,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Input from "../../../../sub-components/Input";
import { MagnifyingGlass1SVG } from "../../../../sub-components/icons";
import CollapsibleGroup from "../../../../sub-components/CollapsibleGroup";
import FilterCategoryList from "../FilterCategoryList";
import FilterGroupValues from "../FilterGroupValues";

interface Props {
  productList: IkasProductList;
  searchPlaceholder: string;
  clearFiltersText: string;
  showSearch?: boolean;
  onFilterChange?: () => void;
  isBrandPage?: boolean;
}

const FilterSidebar = observer(function FilterSidebar({
  productList,
  searchPlaceholder,
  clearFiltersText,
  showSearch = true,
  onFilterChange,
  isBrandPage = false,
}: Props) {
  const filters = productList.filters ?? [];
  const filterCategories = getProductListFilterCategories(productList);
  const hasApplied = hasProductListAppliedFilters(productList);

  const handleSearch = (keyword: string) => {
    searchProductList(productList, keyword);
  };

  const handleClear = () => {
    clearProductListFilters(productList);
    onFilterChange?.();
  };

  return (
    <aside className="kombos-filter-sidebar">
      {showSearch && (
        <div className="kombos-filter-sidebar__search">
          <Input
            leftIcon={<MagnifyingGlass1SVG />}
            placeholder={searchPlaceholder}
            value={productList.searchKeyword ?? ""}
            onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
            size="xs"
          />
        </div>
      )}

      {filterCategories.length > 0 && (
        <CollapsibleGroup title={productList.category?.name ?? ""} defaultOpen>
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
          showResultCount
          onFilterChange={onFilterChange}
        />
      ))}

      {hasApplied && (
        <button
          type="button"
          className="kombos-filter-sidebar__clear text-sm-medium"
          onClick={handleClear}
        >
          {clearFiltersText}
        </button>
      )}
    </aside>
  );
});

export default FilterSidebar;

import { observer } from "@ikas/component-utils";
import Select from "../../../../sub-components/Select";
import Button from "../../../../sub-components/Button";
import Input from "../../../../sub-components/Input";
import {
  SlidersHorizontalSVG,
  Column3SVG,
  Column4SVG,
  MagnifyingGlass1SVG,
} from "../../../../sub-components/icons";

interface Props {
  pageTitle: string;
  productCount: number;
  productCountText: string;
  sortOptions: { label: string; value: string }[];
  selectedSortValue: string;
  onSort: (e: Event) => void;
  columns: 3 | 4;
  onToggleColumns: () => void;
  columnText: string;
  hasVisibleFilters: boolean;
  selectedFiltersCount: number;
  filtersText: string;
  onOpenFilterModal: () => void;
  showSearch: boolean;
  searchPlaceholder: string;
  searchKeyword: string;
  onSearch: (e: Event) => void;
}

const CategoryListControls = observer(function CategoryListControls({
  pageTitle,
  productCount,
  productCountText,
  sortOptions,
  selectedSortValue,
  onSort,
  columns,
  onToggleColumns,
  columnText,
  hasVisibleFilters,
  selectedFiltersCount,
  filtersText,
  onOpenFilterModal,
  showSearch,
  searchPlaceholder,
  searchKeyword,
  onSearch,
}: Props) {
  return (
    <div className="kombos-category-list-controls">
      {pageTitle && (
        <h1 className="kombos-category-list-controls__title display-xs-medium md:display-sm-medium">
          {pageTitle}
          {productCount > 0 && (
            <span className="kombos-category-list-controls__count text-md-regular">
              ({productCount} {productCountText})
            </span>
          )}
        </h1>
      )}

      {sortOptions.length > 0 && (
        <div className="kombos-category-list-controls__sort-wrap">
          <Select
            size="xs"
            options={sortOptions}
            value={selectedSortValue}
            onChange={onSort}
            aria-label="Sort by"
          />
        </div>
      )}

      <Button
        variant="secondary"
        size="xs"
        className="kombos-category-list-controls__col-btn"
        onClick={onToggleColumns}
        aria-label={`${columns === 4 ? 3 : 4} columns`}
        icon={columns === 3 ? <Column3SVG /> : <Column4SVG />}
      >
        {columnText}
      </Button>

      <div className="kombos-category-list-controls__mobile-controls">
        {sortOptions.length > 0 && (
          <div className="kombos-category-list-controls__mobile-sort-wrap">
            <Select
              size="xs"
              className="kombos-category-list-controls__mobile-sort-select"
              options={sortOptions}
              value={selectedSortValue}
              onChange={onSort}
              aria-label="Sort by"
            />
          </div>
        )}
        {hasVisibleFilters && (
          <Button
            variant="secondary"
            size="xs"
            className="kombos-category-list-controls__filter-btn"
            onClick={onOpenFilterModal}
            icon={<SlidersHorizontalSVG />}
          >
            {filtersText}
            {selectedFiltersCount > 0 && ` (${selectedFiltersCount})`}
          </Button>
        )}
      </div>

      {showSearch && (
        <div className="kombos-category-list-controls__mobile-search">
          <Input
            leftIcon={<MagnifyingGlass1SVG />}
            placeholder={searchPlaceholder}
            value={searchKeyword}
            onInput={onSearch}
            size="xs"
          />
        </div>
      )}
    </div>
  );
});

export default CategoryListControls;

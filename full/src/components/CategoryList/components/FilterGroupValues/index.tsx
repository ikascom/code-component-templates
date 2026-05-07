import { useMemo } from "preact/hooks";
import {
  IkasProductList,
  IkasProductFilter,
  getFilterDisplayedValues,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import CollapsibleGroup from "../../../../sub-components/CollapsibleGroup";
import FilterBoxValues from "../FilterBoxValues";
import FilterSwatchValues from "../FilterSwatchValues";
import FilterListValues from "../FilterListValues";
import FilterRangeListValues from "../FilterRangeListValues";
import FilterRangeValues from "../FilterRangeValues";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  showResultCount?: boolean;
  className?: string;
  onFilterChange?: () => void;
}

const FilterGroupValues = observer(function FilterGroupValues({
  productList,
  filter,
  showResultCount = false,
  className,
  onFilterChange,
}: Props) {
  const defaultOpen = useMemo(() => {
    const settings = filter.settings;
    if (!settings) return true;
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;
    return isDesktop
      ? !settings.showCollapsedOnDesktop
      : !settings.showCollapsedOnMobile;
  }, [filter.id]);

  const values = getFilterDisplayedValues(filter);
  const hasRangeOptions = !!filter.numberRangeListOptions?.length;
  const { displayType } = filter;

  if (
    values.length === 0 &&
    !hasRangeOptions &&
    displayType !== "NUMBER_RANGE"
  ) {
    return null;
  }

  const renderFilterContent = () => {
    switch (displayType) {
      case "BOX":
        return (
          <FilterBoxValues
            productList={productList}
            filter={filter}
            values={values}
            onFilterChange={onFilterChange}
          />
        );
      case "SWATCH":
        return (
          <FilterSwatchValues
            productList={productList}
            filter={filter}
            values={values}
            onFilterChange={onFilterChange}
          />
        );
      case "NUMBER_RANGE_LIST":
        return (
          <FilterRangeListValues
            productList={productList}
            filter={filter}
            onFilterChange={onFilterChange}
          />
        );
      case "NUMBER_RANGE":
        return (
          <FilterRangeValues
            productList={productList}
            filter={filter}
            onFilterChange={onFilterChange}
          />
        );
      case "LIST":
        return (
          <FilterListValues
            productList={productList}
            filter={filter}
            values={values}
            showResultCount={showResultCount}
            onFilterChange={onFilterChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CollapsibleGroup
      title={filter.name}
      defaultOpen={defaultOpen}
      className={className}
    >
      {renderFilterContent()}
    </CollapsibleGroup>
  );
});

export default FilterGroupValues;

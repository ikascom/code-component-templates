import {
  IkasProductList,
  IkasProductFilter,
  handleNumberRangeOptionClick,
  getProductListCurrencySymbol,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  onFilterChange?: () => void;
}

const FilterRangeListValues = observer(function FilterRangeListValues({
  productList,
  filter,
  onFilterChange,
}: Props) {
  const options = filter.numberRangeListOptions;
  if (!options?.length) return null;

  const suffix =
    filter.type === "PRICE"
      ? getProductListCurrencySymbol(productList)
      : undefined;

  return (
    <div className="kombos-filter-range-list-values">
      {options.map((option) => (
        <button
          key={`${option.from}-${option.to}`}
          type="button"
          className={cx("kombos-filter-range-list-values__item", "text-sm-regular", option.isSelected && "kombos-filter-range-list-values__item--active")}
          onClick={() => {
            handleNumberRangeOptionClick(productList, filter, option);
            onFilterChange?.();
          }}
        >
          {option.to
            ? `${option.from} - ${option.to}${suffix ? ` ${suffix}` : ""}`
            : `+ ${option.from}${suffix ? ` ${suffix}` : ""}`}
        </button>
      ))}
    </div>
  );
});

export default FilterRangeListValues;

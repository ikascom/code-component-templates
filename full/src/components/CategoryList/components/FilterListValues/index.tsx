import {
  IkasProductList,
  IkasProductFilter,
  IkasApplicableProductFilterValue,
  handleFilterValueClick,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Checkbox from "../../../../sub-components/Checkbox";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  values: IkasApplicableProductFilterValue[];
  showResultCount?: boolean;
  onFilterChange?: () => void;
}

const FilterListValues = observer(function FilterListValues({
  productList,
  filter,
  values,
  showResultCount = false,
  onFilterChange,
}: Props) {
  return (
    <div className="kombos-filter-list-values">
      {values.map((fv) => (
        <div
          key={fv.name}
          className="kombos-filter-list-values__item"
          onClick={() => {
            handleFilterValueClick(productList, filter, fv);
            onFilterChange?.();
          }}
        >
          <Checkbox
            checked={fv.isSelected === true}
            aria-label={fv.name}
          />
          <span className="kombos-filter-list-values__label text-sm-regular">
            {fv.name}
          </span>
          {showResultCount && fv.resultCount != null && (
            <span className="kombos-filter-list-values__count text-xs-regular">
              ({fv.resultCount})
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

export default FilterListValues;

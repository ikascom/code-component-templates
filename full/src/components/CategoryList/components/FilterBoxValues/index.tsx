import {
  IkasProductList,
  IkasProductFilter,
  IkasApplicableProductFilterValue,
  handleFilterValueClick,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  values: IkasApplicableProductFilterValue[];
  onFilterChange?: () => void;
}

const FilterBoxValues = observer(function FilterBoxValues({
  productList,
  filter,
  values,
  onFilterChange,
}: Props) {
  return (
    <div className="kombos-filter-box-values">
      {values.map((fv) => (
        <button
          key={fv.name}
          type="button"
          className={cx("kombos-filter-box-values__item", "text-md-medium", fv.isSelected === true && "kombos-filter-box-values__item--active")}
          onClick={() => {
            handleFilterValueClick(productList, filter, fv);
            onFilterChange?.();
          }}
        >
          {fv.name}
        </button>
      ))}
    </div>
  );
});

export default FilterBoxValues;

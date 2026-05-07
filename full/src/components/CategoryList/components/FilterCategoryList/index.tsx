import {
  IkasProductList,
  IkasFilterCategory,
  onFilterCategoryClick,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";

interface Props {
  productList: IkasProductList;
  categories: IkasFilterCategory[];
  className?: string;
  onFilterChange?: () => void;
  isBrandPage?: boolean;
}

const FilterCategoryList = observer(function FilterCategoryList({
  productList,
  categories,
  className,
  onFilterChange,
  isBrandPage = false,
}: Props) {
  return (
    <div className={cx("kombos-filter-category-list", className)}>
      {categories.map((cat) => (
        <button
          key={cat.name}
          type="button"
          className="kombos-filter-category-list__link text-sm-medium"
          onClick={() => {
            onFilterCategoryClick(productList, cat, isBrandPage);
            onFilterChange?.();
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
});

export default FilterCategoryList;

import {
  IkasProductList,
  IkasProductFilter,
  IkasApplicableProductFilterValue,
  handleFilterValueClick,
  getIkasFilterThumbnailImage,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../utils/cx";

interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  values: IkasApplicableProductFilterValue[];
  onFilterChange?: () => void;
}

const FilterSwatchValues = observer(function FilterSwatchValues({
  productList,
  filter,
  values,
  onFilterChange,
}: Props) {
  return (
    <div className="kombos-filter-swatch-values">
      {values.map((fv) => {
        const thumbnail = getIkasFilterThumbnailImage(fv);
        return (
          <button
            key={fv.name}
            type="button"
            className={cx("kombos-filter-swatch-values__item", "text-md-medium", fv.isSelected === true && "kombos-filter-swatch-values__item--active")}
            onClick={() => {
              handleFilterValueClick(productList, filter, fv);
              onFilterChange?.();
            }}
            title={fv.name}
          >
            {thumbnail ? (
              <img
                src={getDefaultSrc(thumbnail)}
                srcSet={createMediaSrcset(thumbnail)}
                sizes="(max-width: 1024px) 100vw, 100px"
                alt=""
                className="kombos-filter-swatch-values__img"
              />
            ) : fv.colorCode ? (
              <span
                className="kombos-filter-swatch-values__color"
                style={{ backgroundColor: fv.colorCode }}
              />
            ) : null}
            <span>{fv.name}</span>
          </button>
        );
      })}
    </div>
  );
});

export default FilterSwatchValues;

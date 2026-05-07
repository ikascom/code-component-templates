import { useState } from "preact/hooks";
import {
  IkasBundleProduct,
  IkasBundleSettings,
  getDisplayedProductVariantTypes,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import type { AspectRatio, ObjectFit } from "../../../../global-types";
import { cx } from "../../../../utils/cx";
import BundleFurnitureRow from "../BundleFurnitureRow";

interface Texts {
  productContentTitle: string;
  partsLabel: string;
  unitPriceLabel: string;
  quantityLabel: string;
  featuresLabel: string;
  totalPriceLabel: string;
  outOfStockText: string;
  addProductItemText: string;
}

interface Props {
  bundleSettings: IkasBundleSettings;
  isLoading: boolean;
  texts: Texts;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

function hasAnyVariants(products: IkasBundleProduct[]): boolean {
  return products.some((bp) => {
    if (!bp.product) return false;
    return getDisplayedProductVariantTypes(bp.product).length > 0;
  });
}

const COLUMN_HEADER_CLASS = "kombos-bundle-furniture__th text-sm-semibold";

const BundleFurnitureSection = observer(function BundleFurnitureSection({
  bundleSettings,
  isLoading,
  texts,
  aspectRatio,
  objectFit,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sortedProducts = [...bundleSettings.products].sort(
    (a, b) => a.order - b.order,
  );
  const showFeatures = hasAnyVariants(sortedProducts);

  return (
    <div className="kombos-bundle-furniture" id="bundle-furniture-section">
      {/* Collapsible header */}
      <button
        type="button"
        className="kombos-bundle-furniture__toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span className="kombos-bundle-furniture__toggle-text text-sm-semibold">
          {texts.productContentTitle}
        </span>
        <span
          className={cx(
            "kombos-bundle-furniture__toggle-icon",
            isExpanded && "kombos-bundle-furniture__toggle-icon--open",
          )}
        />
      </button>

      {/* Table content */}
      {isExpanded && (
        <div className="kombos-bundle-furniture__body">
          {isLoading ? (
            <div className="kombos-bundle-furniture__loading">
              <div className="kombos-bundle-furniture__spinner" />
            </div>
          ) : (
            <div className="kombos-bundle-furniture__table-wrap">
              <table className="kombos-bundle-furniture__table">
                <colgroup>
                  <col style={{ width: showFeatures ? "33.33%" : "40%" }} />
                  <col style={{ width: showFeatures ? "16.67%" : "20%" }} />
                  <col style={{ width: showFeatures ? "16.67%" : "20%" }} />
                  {showFeatures && <col style={{ width: "16.67%" }} />}
                  <col style={{ width: showFeatures ? "16.67%" : "20%" }} />
                </colgroup>
                <thead>
                  <tr className="kombos-bundle-furniture__head-row">
                    <th className={COLUMN_HEADER_CLASS}>{texts.partsLabel}</th>
                    <th className={COLUMN_HEADER_CLASS}>
                      {texts.unitPriceLabel}
                    </th>
                    <th className={COLUMN_HEADER_CLASS}>
                      {texts.quantityLabel}
                    </th>
                    {showFeatures && (
                      <th className={COLUMN_HEADER_CLASS}>
                        {texts.featuresLabel}
                      </th>
                    )}
                    <th
                      className={COLUMN_HEADER_CLASS}
                      style={{ textAlign: "right" }}
                    >
                      {texts.totalPriceLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((bp) => (
                    <BundleFurnitureRow
                      key={bp.id}
                      bundleProduct={bp}
                      texts={texts}
                      showFeatures={showFeatures}
                      aspectRatio={aspectRatio}
                      objectFit={objectFit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default BundleFurnitureSection;

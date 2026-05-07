import { IkasBundleProduct } from "@ikas/bp-storefront";
import BundleSkeletonLoading from "../BundleSkeletonLoading";
import FurnitureRow from "../FurnitureRow";

interface Props {
  marginStyles: Record<string, string>;
  isLoading: boolean;
  skeletonCount: number;
  sortedProducts: IkasBundleProduct[];
  productContentTitle: string;
  bundleProductWithoutLink?: boolean;
  quantityLabel: string;
}

export default function FurnitureView({
  marginStyles,
  isLoading,
  skeletonCount,
  sortedProducts,
  productContentTitle,
  bundleProductWithoutLink,
  quantityLabel,
}: Props) {
  return (
    <div
      className="kombos-bundle"
      style={{ ...marginStyles, "--kombos-bundle-table-border": "var(--kombos-gray-900)" }}
    >
      {isLoading ? (
        <BundleSkeletonLoading count={skeletonCount} variant="table" />
      ) : (
        <div className="kombos-bundle-table">
          <div className="kombos-bundle-table__header">
            <span className="kombos-bundle-table__title text-md-semibold">
              {productContentTitle}
            </span>
          </div>
          <table className="kombos-bundle-table__table">
            <tbody>
              {sortedProducts.map((bp) => (
                <FurnitureRow
                  key={bp.id}
                  bundleProduct={bp}
                  withoutLink={bundleProductWithoutLink}
                  quantityLabel={quantityLabel}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

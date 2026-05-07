import { IkasOrderLineItem, editOrderLineItem } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

import BundleProductItem from "../BundleProductItem";
import { PencilSVG } from "../../../icons";

interface Props {
  item: IkasOrderLineItem;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  editButtonText?: string;
}

const BundleProducts = observer(function BundleProducts({
  item,
  aspectRatio,
  objectFit,
  editButtonText = "Edit",
}: Props) {
  const bundleProducts = (item.variant?.bundleProducts ?? []).filter(
    (bp) => bp.quantity > 0,
  );

  if (bundleProducts.length === 0) return null;

  const handleEdit = () => {
    editOrderLineItem(item);
  };

  return (
    <div className="kombos-cart-item__bundles">
      <div className="kombos-cart-item__bundles-header">
        <button
          type="button"
          className="kombos-cart-item__bundle-edit-btn text-xs-medium"
          onClick={handleEdit}
        >
          <PencilSVG />
          {editButtonText}
        </button>
      </div>
      {bundleProducts.map((bp) => (
        <BundleProductItem
          key={bp.id}
          bundleProduct={bp}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
        />
      ))}
    </div>
  );
});

export default BundleProducts;

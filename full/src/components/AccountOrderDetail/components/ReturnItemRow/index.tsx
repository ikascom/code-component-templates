import { IkasOrderLineItem } from "@ikas/bp-storefront";
import Checkbox from "../../../../sub-components/Checkbox";
import { MinusSVG, PlusSVG } from "../../../../sub-components/icons";
import OrderLineItemDisplay from "../OrderLineItemDisplay";

interface Props {
  item: IkasOrderLineItem;
  refundQty: number;
  onToggle: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function ReturnItemRow({
  item,
  refundQty,
  onToggle,
  onDecrease,
  onIncrease,
}: Props) {
  const selected = refundQty > 0;

  return (
    <div className="kombos-order-detail-return__item">
      <div className="kombos-order-detail-return__item-row">
        <Checkbox checked={selected} onChange={onToggle} />
        <OrderLineItemDisplay item={item} />
        {selected && item.quantity > 1 && (
          <div className="kombos-order-detail-return__qty">
            <button
              type="button"
              className="kombos-order-detail-return__qty-btn"
              onClick={onDecrease}
              disabled={refundQty <= 1}
              aria-label="Decrease refund quantity"
            >
              <MinusSVG />
            </button>
            <span className="kombos-order-detail-return__qty-value text-md-medium">
              {refundQty}
            </span>
            <button
              type="button"
              className="kombos-order-detail-return__qty-btn kombos-order-detail-return__qty-btn--plus"
              onClick={onIncrease}
              disabled={refundQty >= item.quantity}
              aria-label="Increase refund quantity"
            >
              <PlusSVG />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

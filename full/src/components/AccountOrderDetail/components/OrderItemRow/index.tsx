import { IkasOrderLineItem } from "@ikas/bp-storefront";
import OrderLineItemDisplay from "../OrderLineItemDisplay";

interface Props {
  item: IkasOrderLineItem;
  quantityLabel: string;
}

export default function OrderItemRow({ item, quantityLabel }: Props) {
  return (
    <div className="kombos-order-detail-item">
      <div className="kombos-order-detail-item__row">
        <OrderLineItemDisplay item={item} />
        <span className="kombos-order-detail-item__qty text-sm-regular">
          {item.quantity} {quantityLabel}
        </span>
      </div>
    </div>
  );
}

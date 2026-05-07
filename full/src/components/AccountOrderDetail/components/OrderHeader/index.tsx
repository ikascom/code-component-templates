import {
  IkasOrder,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderPackageStatusTranslation,
} from "@ikas/bp-storefront";
import { CopySVG } from "../../../../sub-components/icons";
import { getStatusColor } from "../../../../utils/orderStatus";
import { showToast } from "../../../../utils/toast";

interface Props {
  order: IkasOrder;
  orderNoLabel: string;
  orderStatusLabel: string;
  orderDateLabel: string;
  copiedText: string;
}

export default function OrderHeader({
  order,
  orderNoLabel,
  orderStatusLabel,
  orderDateLabel,
  copiedText,
}: Props) {
  const statusLabel = getIkasOrderPackageStatusTranslation(order);
  const statusColor = getStatusColor(order);
  const date = getIkasOrderFormattedOrderedAt(order);

  const handleCopy = async () => {
    if (order.orderNumber) {
      try {
        await navigator.clipboard.writeText(order.orderNumber);
        showToast(copiedText, "success");
      } catch {
        // Clipboard API may fail on non-HTTPS or without permissions
      }
    }
  };

  return (
    <div className="kombos-order-detail-header">
      <div className="kombos-order-detail-header__info">
        {order.orderNumber && (
          <div className="kombos-order-detail-header__row">
            <span className="text-sm-regular kombos-order-detail-header__label">
              {orderNoLabel}{" "}
              <span className="text-sm-medium">{order.orderNumber}</span>
            </span>
            <button
              type="button"
              className="kombos-order-detail-header__copy"
              onClick={handleCopy}
              aria-label="Copy order number"
            >
              <CopySVG />
            </button>
          </div>
        )}
        {statusLabel && (
          <p className="text-sm-regular kombos-order-detail-header__label">
            {orderStatusLabel}{" "}
            <span
              className="text-sm-medium"
              style={statusColor ? { color: statusColor } : undefined}
            >
              {statusLabel}
            </span>
          </p>
        )}
        {date && (
          <p className="text-sm-regular kombos-order-detail-header__label">
            {orderDateLabel} {date}
          </p>
        )}
      </div>
    </div>
  );
}

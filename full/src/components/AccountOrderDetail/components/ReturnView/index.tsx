import { useState } from "preact/hooks";
import {
  IkasOrder,
  IkasOrderLineItem,
  customerStore,
  refundOrder,
  Router,
  getIkasOrderRefundableItems,
  setOrderLineItemRefundQuantity,
  isIkasOrderRefundable,
} from "@ikas/bp-storefront";
import Breadcrumb from "../../../../sub-components/Breadcrumb";
import Button from "../../../../sub-components/Button";
import { showToast } from "../../../../utils/toast";
import OrderHeader from "../OrderHeader";
import ReturnItemRow from "../ReturnItemRow";

interface Props {
  order: IkasOrder;
  breadcrumbOrdersLabel: string;
  breadcrumbOrderLabel: string;
  orderNoLabel: string;
  orderStatusLabel: string;
  orderDateLabel: string;
  returnRequestTitle: string;
  returnSubmitText: string;
  returningButtonText: string;
  returnSuccessText: string;
  returnErrorText: string;
  copiedText: string;
  onBack: () => void;
  onSuccess: () => void;
}

function ReturnView({
  order,
  breadcrumbOrdersLabel,
  breadcrumbOrderLabel,
  orderNoLabel,
  orderStatusLabel,
  orderDateLabel,
  returnRequestTitle,
  returnSubmitText,
  returningButtonText,
  returnSuccessText,
  returnErrorText,
  copiedText,
  onBack,
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const refundableItems = getIkasOrderRefundableItems(order);

  const orderRefundable = isIkasOrderRefundable(order);

  const disabled = !orderRefundable || submitting;

  const updateQuantity = (item: IkasOrderLineItem, next: number) => {
    const current = quantities[item.id] ?? 0;
    if (next === current) return;
    setOrderLineItemRefundQuantity(next || null, item);
    if (next <= 0) {
      const { [item.id]: _, ...rest } = quantities;
      setQuantities(rest);
    } else {
      setQuantities({ ...quantities, [item.id]: next });
    }
  };

  const handleToggle = (item: IkasOrderLineItem) => {
    const current = quantities[item.id] ?? 0;
    updateQuantity(item, current > 0 ? 0 : 1);
  };

  const handleDecrease = (item: IkasOrderLineItem) => {
    const current = quantities[item.id] ?? 0;
    updateQuantity(item, Math.max(0, current - 1));
  };

  const handleIncrease = (item: IkasOrderLineItem) => {
    const current = quantities[item.id] ?? 0;
    updateQuantity(item, Math.min(item.quantity, current + 1));
  };

  const handleSubmit = async () => {
    if (disabled) return;
    setSubmitting(true);
    try {
      const success = await refundOrder(customerStore, order);
      if (success) {
        showToast(returnSuccessText, "success");
        onSuccess();
      } else {
        showToast(returnErrorText, "error");
      }
    } catch {
      showToast(returnErrorText, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kombos-order-detail-return">
      <Breadcrumb
        items={[
          {
            label: breadcrumbOrdersLabel,
            onClick: () => Router.navigateToPage("ORDERS"),
          },
          {
            label: `${order.orderNumber} ${breadcrumbOrderLabel}`,
            onClick: onBack,
          },
          { label: returnRequestTitle },
        ]}
      />

      <div className="kombos-order-detail-return__content">
        <OrderHeader
          order={order}
          orderNoLabel={orderNoLabel}
          orderStatusLabel={orderStatusLabel}
          orderDateLabel={orderDateLabel}
          copiedText={copiedText}
        />

        <div className="kombos-order-detail-return__items">
          {refundableItems.map((item) => (
            <ReturnItemRow
              key={item.id}
              item={item}
              refundQty={quantities[item.id] ?? 0}
              onToggle={() => handleToggle(item)}
              onDecrease={() => handleDecrease(item)}
              onIncrease={() => handleIncrease(item)}
            />
          ))}
        </div>

        <div className="kombos-order-detail-return__footer">
          <Button
            variant="primary"
            size="s"
            onClick={handleSubmit}
            loading={submitting}
            disabled={disabled}
            className="kombos-order-detail-return__submit-btn"
          >
            {submitting ? returningButtonText : returnSubmitText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReturnView;

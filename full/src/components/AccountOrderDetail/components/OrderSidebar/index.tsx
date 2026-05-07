import {
  IkasOrder,
  IkasOrderAddress,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderFormattedTotalPrice,
  getIkasOrderFormattedShippingTotal,
  getOrderTransactionFormattedAmount,
  getOrderTransactionPaymentMethodTranslation,
  getIkasOrderDisplayedAdjustments,
  getOrderAdjustmentFormattedAmount,
  getOrderAdjustmentDisplayName,
  getOrderAddressText,
} from "@ikas/bp-storefront";
import { getFullName } from "../../../../utils/fullName";

interface Props {
  order: IkasOrder;
  deliveryAddressLabel: string;
  billingAddressLabel: string;
  paymentInfoLabel: string;
  summaryLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  totalLabel: string;
  taxIncludedText: string;
  installmentText: string;
  singlePaymentText: string;
}

function AddressBlock({
  label,
  address,
}: {
  label: string;
  address: IkasOrderAddress | null;
}) {
  if (!address) return null;
  const fullName = getFullName(address.firstName, address.lastName);
  const addressText = getOrderAddressText(address);

  return (
    <div className="kombos-order-detail-sidebar__section">
      <p className="kombos-order-detail-sidebar__section-title text-sm-medium">
        {label}
      </p>
      <div className="kombos-order-detail-sidebar__address">
        {fullName && (
          <p className="kombos-order-detail-sidebar__address-line text-sm-regular">
            {fullName}
          </p>
        )}
        {addressText && (
          <p className="kombos-order-detail-sidebar__address-line text-sm-regular">
            {addressText}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OrderSidebar({
  order,
  deliveryAddressLabel,
  billingAddressLabel,
  paymentInfoLabel,
  summaryLabel,
  subtotalLabel,
  shippingLabel,
  totalLabel,
  taxIncludedText,
  installmentText,
  singlePaymentText,
}: Props) {
  const transactions = order.transactions ?? [];
  const totalFinalPrice = getIkasOrderFormattedTotalFinalPrice(order);
  const totalPrice = getIkasOrderFormattedTotalPrice(order);
  const shippingTotal = getIkasOrderFormattedShippingTotal(order);
  const adjustments = getIkasOrderDisplayedAdjustments(order);

  return (
    <div className="kombos-order-detail-sidebar">
      <AddressBlock
        label={deliveryAddressLabel}
        address={order.shippingAddress}
      />

      <div className="kombos-order-detail-sidebar__divider" />

      <AddressBlock
        label={billingAddressLabel}
        address={order.billingAddress}
      />

      <div className="kombos-order-detail-sidebar__divider" />

      {transactions.length > 0 && (
        <>
          <div className="kombos-order-detail-sidebar__section">
            <p className="kombos-order-detail-sidebar__section-title text-sm-medium">
              {paymentInfoLabel}
            </p>
            <div className="kombos-order-detail-sidebar__payment">
              {transactions.map((t) => {
                const methodLabel =
                  getOrderTransactionPaymentMethodTranslation(t);
                const amount = getOrderTransactionFormattedAmount(t);
                const detail = t.paymentMethodDetail;
                const lastFour = detail?.lastFourDigits ?? "";
                const cardInfo = detail
                  ? `${detail.cardAssociation ?? ""} **** **** ****${lastFour}`.trim()
                  : null;
                const installmentInfo = detail?.installment?.installmentCount
                  ? detail.installment.installmentCount > 1
                    ? `${detail.installment.installmentCount} ${installmentText}`
                    : singlePaymentText
                  : null;

                return (
                  <div
                    key={t.id}
                    className="kombos-order-detail-sidebar__payment-block"
                  >
                    <div className="kombos-order-detail-sidebar__payment-row">
                      <span className="text-sm-regular">{methodLabel}</span>
                      <span className="text-sm-regular">{amount}</span>
                    </div>
                    {(installmentInfo || cardInfo) && (
                      <div className="kombos-order-detail-sidebar__payment-row">
                        {installmentInfo && (
                          <span className="text-sm-regular">
                            {installmentInfo}
                          </span>
                        )}
                        {cardInfo && (
                          <span className="text-sm-regular">{cardInfo}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="kombos-order-detail-sidebar__divider" />
        </>
      )}

      <div className="kombos-order-detail-sidebar__section">
        <p className="kombos-order-detail-sidebar__section-title text-sm-medium">
          {summaryLabel}
        </p>
        <div className="kombos-order-detail-sidebar__summary">
          <div className="kombos-order-detail-sidebar__summary-row">
            <span className="kombos-order-detail-sidebar__summary-label text-sm-regular">
              {subtotalLabel}
            </span>
            <span className="kombos-order-detail-sidebar__summary-value text-sm-regular">
              {totalPrice}
            </span>
          </div>
          <div className="kombos-order-detail-sidebar__summary-row">
            <span className="kombos-order-detail-sidebar__summary-label text-sm-regular">
              {shippingLabel}
            </span>
            <span className="kombos-order-detail-sidebar__summary-value text-sm-regular">
              {shippingTotal}
            </span>
          </div>
          {adjustments?.map((adj, idx) => (
            <div key={idx} className="kombos-order-detail-sidebar__summary-row">
              <span className="kombos-order-detail-sidebar__summary-label text-sm-regular">
                {getOrderAdjustmentDisplayName(adj)}
              </span>
              <span className="kombos-order-detail-sidebar__summary-value text-sm-regular">
                {getOrderAdjustmentFormattedAmount(adj)}
              </span>
            </div>
          ))}
          <div className="kombos-order-detail-sidebar__summary-row kombos-order-detail-sidebar__summary-row--total">
            <div className="kombos-order-detail-sidebar__total-label">
              <span className="text-sm-medium">{totalLabel}</span>
              <span className="kombos-order-detail-sidebar__tax-note text-sm-medium">
                {taxIncludedText}
              </span>
            </div>
            <span className="kombos-order-detail-sidebar__summary-value text-sm-medium">
              {totalFinalPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { IkasOrder, IkasOrderPackageStatus } from "@ikas/bp-storefront";

const STATUS_COLORS: Record<IkasOrderPackageStatus, string> = {
  UNFULFILLED: "var(--kombos-warning)",
  PARTIALLY_FULFILLED: "var(--kombos-warning)",
  PARTIALLY_READY_FOR_SHIPMENT: "var(--kombos-warning)",
  PARTIALLY_DELIVERED: "var(--kombos-warning)",
  PARTIALLY_CANCELLED: "var(--kombos-warning)",
  FULFILLED: "var(--kombos-success)",
  DELIVERED: "var(--kombos-success)",
  READY_FOR_PICK_UP: "var(--kombos-success)",
  READY_FOR_SHIPMENT: "var(--kombos-success)",
  CANCELLED: "var(--kombos-error)",
  REFUNDED: "var(--kombos-error)",
  UNABLE_TO_DELIVER: "var(--kombos-error)",
  REFUND_REJECTED: "var(--kombos-error)",
  CANCEL_REJECTED: "var(--kombos-error)",
  CANCEL_REQUESTED: "var(--kombos-info)",
  REFUND_REQUESTED: "var(--kombos-info)",
  REFUND_REQUEST_ACCEPTED: "var(--kombos-info)",
  PARTIALLY_REFUNDED: "var(--kombos-info)",
  RETURN_PARCEL_WAITING: "var(--kombos-info)",
  RETURN_IN_TRANSIT: "var(--kombos-info)",
  RETURN_DELIVERED: "var(--kombos-success)",
  RETURN_REJECTED: "var(--kombos-error)",
};

export function getStatusColor(order: IkasOrder): string | undefined {
  const status = order.orderPackageStatus;
  if (!status) return undefined;
  return STATUS_COLORS[status] ?? undefined;
}

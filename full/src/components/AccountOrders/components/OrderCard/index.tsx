import {
  IkasOrder,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderDistinctItemCount,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderPackageStatusTranslation,
  getIkasOrderHref,
  getIkasOrderLineVariantMainImage,
  getThumbnailSrc,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import Button from "../../../../sub-components/Button";
import { NoProductSVG } from "../../../../sub-components/icons";
import { getStatusColor } from "../../../../utils/orderStatus";

const MAX_THUMBS = 4;

interface Props {
  order: IkasOrder;
  detailButtonText: string;
  orderNoText: string;
  itemsText: string;
}

export default function OrderCard({
  order,
  detailButtonText,
  orderNoText,
  itemsText,
}: Props) {
  const date = getIkasOrderFormattedOrderedAt(order);
  const statusLabel = getIkasOrderPackageStatusTranslation(order);
  const statusColor = getStatusColor(order);
  const itemCount = getIkasOrderDistinctItemCount(order);
  const totalPrice = getIkasOrderFormattedTotalFinalPrice(order);
  const href = getIkasOrderHref(order);

  const thumbs = (order.orderLineItems ?? [])
    .map((item) => {
      const image = getIkasOrderLineVariantMainImage(item.variant);
      return {
        id: item.id,
        src: image && !image.isVideo ? getThumbnailSrc(image) : null,
        videoSrc: image?.isVideo ? getDefaultSrc(image) : null,
        isVideo: image?.isVideo ?? false,
        alt: item.variant?.name ?? "",
      };
    })
    .slice(0, MAX_THUMBS);

  return (
    <div className="kombos-account-orders__card">
      <div className="kombos-account-orders__card-info">
        <div className="kombos-account-orders__card-meta">
          {date && (
            <span className="kombos-account-orders__card-date text-sm-regular">
              {date}
            </span>
          )}
          {statusLabel && (
            <span
              className="kombos-account-orders__card-status text-sm-medium"
              style={statusColor ? { color: statusColor } : undefined}
            >
              {statusLabel}
            </span>
          )}
          {order.orderNumber && (
            <span className="kombos-account-orders__card-order-no text-sm-regular">
              {orderNoText}{" "}
              <span className="text-sm-medium">{order.orderNumber}</span>
            </span>
          )}
          <span className="kombos-account-orders__card-summary text-sm-regular">
            <span className="text-sm-medium">{itemCount}</span> {itemsText}
            {" - "}
            <span className="text-sm-medium">{totalPrice}</span>
          </span>
        </div>

        {thumbs.length > 0 && (
          <div className="kombos-account-orders__card-thumbs">
            {thumbs.map((t) => (
              <div key={t.id} className="kombos-account-orders__thumb">
                {t.videoSrc ? (
                  <video
                    src={t.videoSrc}
                    className="kombos-account-orders__thumb-video"
                    muted
                    loop
                    autoPlay
                    playsInline
                  >
                    <track kind="captions" />
                  </video>
                ) : t.src ? (
                  <img src={t.src} alt={t.alt} loading="lazy" />
                ) : (
                  <div className="kombos-account-orders__thumb-placeholder">
                    <NoProductSVG />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="kombos-account-orders__card-action">
        <a
          href={href}
          className="kombos-account-orders__detail-link"
          aria-label={`${detailButtonText} - ${orderNoText} ${order.orderNumber}`}
        >
          <Button variant="secondary" size="s" tabIndex={-1} aria-hidden="true">
            {detailButtonText}
          </Button>
        </a>
      </div>
    </div>
  );
}

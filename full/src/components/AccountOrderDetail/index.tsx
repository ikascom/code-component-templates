import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  IkasOrder,
  IkasProductFile,
  IkasOrderTransaction,
  getOrderDetailsOfPage,
  getIkasOrderDisplayedPackages,
  isIkasOrderRefundable,
  getIkasOrderProductFiles,
  getOrderProductFiles,
  getOrderTransactions,
  getDigitalProductFileDownloadUrl,
  Router,
  getIkasOrderRefundableItems,
} from "@ikas/bp-storefront";
import PageLoader from "../../sub-components/PageLoader";
import Button from "../../sub-components/Button";
import Breadcrumb from "../../sub-components/Breadcrumb";
import { DownloadSVG } from "../../sub-components/icons";
import OrderHeader from "./components/OrderHeader";
import PackageGroup from "./components/PackageGroup";
import OrderSidebar from "./components/OrderSidebar";
import ReturnView from "./components/ReturnView";
import { Props } from "./types";

export function AccountOrderDetail({
  breadcrumbOrdersLabel = "My Orders",
  breadcrumbOrderLabel = "Order",
  orderNoLabel = "Order No:",
  orderStatusLabel = "Order Status:",
  orderDateLabel = "Order Date:",
  returnButtonText = "Return",
  returningButtonText = "Submitting return request...",
  returnRequestTitle = "Return Request",
  returnSubmitText = "Return",
  deliveryAddressLabel = "Delivery Address",
  billingAddressLabel = "Billing Address",
  paymentInfoLabel = "Payment Information",
  summaryLabel = "Summary",
  subtotalLabel = "Subtotal",
  shippingLabel = "Shipping",
  totalLabel = "Total",
  taxIncludedText = "*taxes included",
  installmentText = "Installment",
  singlePaymentText = "Single Payment",
  cargoCompanyLabel = "Shipping Company:",
  trackingNumberLabel = "Tracking Number:",
  quantityLabel = "items",
  errorText = "Order not found.",
  backToOrdersText = "Back to Orders",
  returnSuccessText = "Your return request has been successfully created.",
  returnErrorText = "An error occurred while creating the return request.",
  copiedText = "Copied!",
  downloadSectionTitle = "Downloadable Files",
  downloadButtonText = "Download",
}: Props) {
  const [order, setOrder] = useState<IkasOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"detail" | "return">("detail");
  const [files, setFiles] = useState<IkasProductFile[]>([]);
  const [transactions, setTransactions] = useState<IkasOrderTransaction[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getOrderDetailsOfPage(customerStore);
        if (!cancelled && result) {
          setOrder(result);
          const fileIds = getIkasOrderProductFiles(result);
          if (fileIds.length > 0) {
            const [productFiles, txns] = await Promise.all([
              getOrderProductFiles(customerStore, fileIds),
              getOrderTransactions(customerStore, { orderId: result.id }),
            ]);
            if (!cancelled) {
              setFiles(productFiles);
              setTransactions(txns);
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!order) {
    return (
      <div className="kombos-order-detail">
        <div className="kombos-order-detail__empty">
          <p className="kombos-order-detail__empty-text text-sm-regular">
            {errorText}
          </p>
          <Button
            variant="secondary"
            size="s"
            onClick={() => Router.navigateToPage("ORDERS")}
          >
            {backToOrdersText}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "return") {
    return (
      <div className="kombos-order-detail">
        <ReturnView
          order={order}
          breadcrumbOrdersLabel={breadcrumbOrdersLabel}
          breadcrumbOrderLabel={breadcrumbOrderLabel}
          orderNoLabel={orderNoLabel}
          orderStatusLabel={orderStatusLabel}
          orderDateLabel={orderDateLabel}
          returnRequestTitle={returnRequestTitle}
          returnSubmitText={returnSubmitText}
          returningButtonText={returningButtonText}
          returnSuccessText={returnSuccessText}
          returnErrorText={returnErrorText}
          copiedText={copiedText}
          onBack={() => setView("detail")}
          onSuccess={() => setView("detail")}
        />
      </div>
    );
  }

  const packages = getIkasOrderDisplayedPackages(order);
  const canRefund = getIkasOrderRefundableItems(order).length > 0;
  // const canRefund = isIkasOrderRefundable(order);
  const isDownloadable =
    transactions.length > 0 &&
    transactions.every((t) => t.status === "SUCCESS");

  return (
    <div className="kombos-order-detail">
      <Breadcrumb
        items={[
          {
            label: breadcrumbOrdersLabel,
            onClick: () => Router.navigateToPage("ORDERS"),
          },
          { label: `${order.orderNumber} ${breadcrumbOrderLabel}` },
        ]}
      />

      <div className="kombos-order-detail__content">
        <div className="kombos-order-detail__header-row">
          <OrderHeader
            order={order}
            orderNoLabel={orderNoLabel}
            orderStatusLabel={orderStatusLabel}
            orderDateLabel={orderDateLabel}
            copiedText={copiedText}
          />
          {canRefund && (
            <Button
              variant="secondary"
              size="s"
              onClick={() => setView("return")}
              className="kombos-order-detail__return-btn"
            >
              {returnButtonText}
            </Button>
          )}
        </div>

        <div className="kombos-order-detail__body">
          <div className="kombos-order-detail__packages">
            {files.length > 0 && (
              <div className="kombos-order-detail__downloads">
                <h3 className="kombos-order-detail__downloads-title text-md-semibold">
                  {downloadSectionTitle}
                </h3>
                <div className="kombos-order-detail__downloads-list">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="kombos-order-detail__download-item"
                    >
                      <span className="kombos-order-detail__download-name text-sm-regular">
                        {file.name}
                      </span>
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={<DownloadSVG />}
                        className="kombos-order-detail__download-btn"
                        disabled={!isDownloadable}
                        onClick={() =>
                          getDigitalProductFileDownloadUrl(
                            customerStore,
                            order,
                            file,
                          )
                        }
                      >
                        {downloadButtonText}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {packages.map((pkg) => (
              <PackageGroup
                key={pkg.id}
                pkg={pkg}
                quantityLabel={quantityLabel}
                cargoCompanyLabel={cargoCompanyLabel}
                trackingNumberLabel={trackingNumberLabel}
              />
            ))}
          </div>

          <OrderSidebar
            order={order}
            deliveryAddressLabel={deliveryAddressLabel}
            billingAddressLabel={billingAddressLabel}
            paymentInfoLabel={paymentInfoLabel}
            summaryLabel={summaryLabel}
            subtotalLabel={subtotalLabel}
            shippingLabel={shippingLabel}
            totalLabel={totalLabel}
            taxIncludedText={taxIncludedText}
            installmentText={installmentText}
            singlePaymentText={singlePaymentText}
          />
        </div>
      </div>
    </div>
  );
}

export default AccountOrderDetail;

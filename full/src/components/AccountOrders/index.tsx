import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  getOrders,
  IkasOrder,
  Router,
} from "@ikas/bp-storefront";
import Button from "../../sub-components/Button";
import PageLoader from "../../sub-components/PageLoader";
import OrderCard from "./components/OrderCard";
import { Props } from "./types";

export function AccountOrders({
  ordersLabel = "My Orders",
  emptyText = "You don't have any orders yet.",
  detailButtonText = "View Details",
  orderNoText = "Order No:",
  itemsText = "Product",
  shopButtonText = "Start Shopping",
  errorText = "An error occurred while loading orders.",
  retryButtonText = "Try Again",
}: Props) {
  const [orders, setOrders] = useState<IkasOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchOrders = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(false);

    (async () => {
      try {
        const result = await getOrders(customerStore);
        if (signal.aborted) return;
        setOrders(result);
      } catch {
        if (signal.aborted) return;
        setError(true);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchOrders();
    return () => controllerRef.current?.abort();
  }, [fetchOrders]);

  const hasOrders = orders.length > 0;

  return (
    <div className="kombos-account-orders">
      <h1 className="kombos-account-orders__title text-md-medium">
        {`${ordersLabel}${hasOrders ? ` (${orders.length})` : ""}`}
      </h1>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <div className="kombos-account-orders__error">
          <p className="kombos-account-orders__error-text text-sm-regular">
            {errorText}
          </p>
          <Button variant="primary" size="s" onClick={fetchOrders}>
            {retryButtonText}
          </Button>
        </div>
      ) : !hasOrders ? (
        <div className="kombos-account-orders__empty">
          <p className="kombos-account-orders__empty-text text-sm-regular">
            {emptyText}
          </p>
          <Button
            variant="primary"
            size="s"
            onClick={() => Router.navigate("/")}
          >
            {shopButtonText}
          </Button>
        </div>
      ) : (
        <div className="kombos-account-orders__list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              detailButtonText={detailButtonText}
              orderNoText={orderNoText}
              itemsText={itemsText}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AccountOrders;

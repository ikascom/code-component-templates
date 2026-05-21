import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  getOrders,
  getIkasOrderHref,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderPackageStatusTranslation,
  getIkasOrderTotalItemCount,
  IkasOrder,
} from "@ikas/bp-storefront";
import AccountSidebar from "../../sub-components/AccountSidebar";
import { Props } from "./types";

export function AccountOrders({
  backgroundColor = "#FAF8F5",
  pageTitle = "Siparişlerim",
  emptyStateText = "Henüz siparişiniz bulunmuyor",
  emptyStateSubtext = "Verdiğiniz siparişler burada görünecektir",
  emptyStateButtonText = "Alışverişe Başla",
  emptyStateButtonUrl = "/",
  orderNumberLabel = "Sipariş No",
  orderDateLabel = "Tarih",
  orderStatusLabel = "Durum",
  orderTotalLabel = "Toplam",
  orderItemCountLabel = "Ürün",
  viewOrderText = "Görüntüle",
  ordersPerPage = 10,
  loadMoreText = "Daha Fazla Göster",
  loadingMoreText = "Yükleniyor...",
  sidebarNavAriaLabel = "Hesap navigasyonu",
}: Props) {
  const [allOrders, setAllOrders] = useState<IkasOrder[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(ordersPerPage);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await waitForCustomerStoreInit(customerStore);
        if (cancelled || !customerStore.customer) {
          if (!cancelled) setIsInitialized(true);
          return;
        }
        const orders = await getOrders(customerStore);
        if (cancelled) return;
        const sorted = [...(orders ?? [])].sort((a, b) => {
          const aTime = a.orderedAt ?? a.createdAt ?? 0;
          const bTime = b.orderedAt ?? b.createdAt ?? 0;
          return bTime - aTime;
        });
        setAllOrders(sorted);
      } catch {
        if (!cancelled) setAllOrders([]);
      } finally {
        if (!cancelled) setIsInitialized(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // getOrders returns the full list in this SDK; "load more" is local pagination
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + ordersPerPage, allOrders.length));
      setIsLoadingMore(false);
    }, 0);
  };

  const visibleOrders = allOrders.slice(0, visibleCount);
  const hasMore = visibleCount < allOrders.length;

  return (
    <section
      class="account-orders"
      // Inline `visibility: hidden` prevents the cold-load FOUC; the
      // component's CSS flips it back via !important once the chunk loads.
      // `minHeight: 100vh` reserves space so the footer doesn't jump.
      style={{
        visibility: "hidden",
        minHeight: "100vh",
        ...(backgroundColor ? { backgroundColor } : null),
      }}
    >
      <div class="account-orders__container">
        <div class="account-orders__layout">
          <AccountSidebar activeKey="orders" navAriaLabel={sidebarNavAriaLabel} />

          <div class="account-orders__main">
            <h1 class="account-orders__title">{pageTitle}</h1>
            <hr class="account-orders__divider" />

            {!isInitialized ? (
              <ul
                class="account-orders__list account-orders__list--skeleton"
                aria-hidden="true"
              >
                {[0, 1, 2].map((i) => (
                  <li key={i} class="account-orders__card account-orders__card--skeleton">
                    <div class="account-orders__cell">
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--label" />
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--value" />
                    </div>
                    <div class="account-orders__cell">
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--label" />
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--value" />
                    </div>
                    <div class="account-orders__cell">
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--label" />
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--badge" />
                    </div>
                    <div class="account-orders__cell">
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--label" />
                      <span class="account-orders__skeleton-bar account-orders__skeleton-bar--value" />
                    </div>
                    <span class="account-orders__skeleton-bar account-orders__skeleton-bar--button" />
                  </li>
                ))}
              </ul>
            ) : allOrders.length === 0 ? (
              <div class="account-orders__empty">
                <p class="account-orders__empty-text">{emptyStateText}</p>
                <p class="account-orders__empty-subtext">
                  {emptyStateSubtext}
                </p>
                <a
                  class="account-orders__empty-cta"
                  href={emptyStateButtonUrl}
                >
                  {emptyStateButtonText}
                </a>
              </div>
            ) : (
              <>
                <ul class="account-orders__list">
                  {visibleOrders.map((order) => {
                    const href = getIkasOrderHref(order);
                    const date = getIkasOrderFormattedOrderedAt(order);
                    const total = getIkasOrderFormattedTotalFinalPrice(order);
                    const status = order.orderPackageStatus
                      ? getIkasOrderPackageStatusTranslation(order)
                      : "";
                    const itemCount = getIkasOrderTotalItemCount(order);
                    return (
                      <li key={order.id} class="account-orders__card">
                        <div class="account-orders__cell">
                          <span class="account-orders__cell-label">
                            {orderNumberLabel}
                          </span>
                          <span class="account-orders__cell-value account-orders__cell-value--display">
                            #{order.orderNumber ?? "-"}
                          </span>
                        </div>
                        <div class="account-orders__cell">
                          <span class="account-orders__cell-label">
                            {orderDateLabel}
                          </span>
                          <span class="account-orders__cell-value">
                            {date ?? "-"}
                          </span>
                        </div>
                        <div class="account-orders__cell">
                          <span class="account-orders__cell-label">
                            {orderStatusLabel}
                          </span>
                          <span class="account-orders__cell-value">
                            {status ? (
                              <span class="account-orders__badge">
                                {status}
                              </span>
                            ) : (
                              "-"
                            )}
                          </span>
                        </div>
                        <div class="account-orders__cell">
                          <span class="account-orders__cell-label">
                            {orderTotalLabel}
                          </span>
                          <span class="account-orders__cell-value">
                            {total || "-"}
                            <span class="account-orders__item-count">
                              {" "}
                              · {itemCount} {orderItemCountLabel}
                            </span>
                          </span>
                        </div>
                        <a class="account-orders__view-btn" href={href}>
                          {viewOrderText}
                        </a>
                      </li>
                    );
                  })}
                </ul>

                {hasMore ? (
                  <div class="account-orders__load-more-wrap">
                    <button
                      type="button"
                      class="account-orders__load-more"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      aria-busy={isLoadingMore ? "true" : undefined}
                    >
                      {isLoadingMore ? loadingMoreText : loadMoreText}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountOrders;

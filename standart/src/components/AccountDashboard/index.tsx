import { useEffect, useMemo, useState } from "preact/hooks";
import {
  customerStore,
  getOrders,
  getIkasOrderHref,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderPackageStatusTranslation,
  logout,
  Router,
  IkasOrder,
} from "@ikas/bp-storefront";
import ProfileEditModal from "../../sub-components/ProfileEditModal";
import { Props } from "./types";

const stripTrailingPunctuation = (text: string) =>
  text.replace(/[\s,.;:!]+$/u, "");

export function AccountDashboard({
  backgroundColor = "#FAF8F5",
  greeting = "Merhaba,",
  showSubtext = true,
  subtext = "Hesabınızı buradan yönetebilirsiniz",
  ordersCardTitle = "Siparişlerim",
  ordersCardDescription = "Siparişlerinizi görüntüleyin ve takip edin",
  addressesCardTitle = "Adreslerim",
  addressesCardDescription = "Kayıtlı adreslerinizi yönetin",
  favoritesCardTitle = "Favorilerim",
  favoritesCardDescription = "Beğendiğiniz ürünleri buradan görüntüleyin",
  noOrderInlineText = "Henüz siparişiniz bulunmuyor",
  noOrderInlineCta = "Alışverişe başla",
  lastOrderLabel = "Son Sipariş",
  modalTitle = "Bilgilerimi Düzenle",
  modalFirstNameLabel = "Ad",
  modalLastNameLabel = "Soyad",
  modalPhoneLabel = "Telefon",
  modalMarketingLabel = "Kampanya ve fırsatlardan e-posta ile haberdar olmak istiyorum",
  modalSaveText = "Kaydet",
  modalSavingText = "Kaydediliyor...",
  modalCancelText = "İptal",
  modalCloseAriaLabel = "Kapat",
  logoutText = "Çıkış Yap",
  loggingOutText = "Çıkış yapılıyor...",
  editInfoText = "Bilgilerimi Düzenle",
  dashboardNavAriaLabel = "Hesap menüsü",
}: Props) {
  // `null` = still loading, `[]` = loaded but empty.
  const [orders, setOrders] = useState<IkasOrder[] | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout(customerStore);
      Router.navigateToPage("INDEX");
    } catch {
      setIsLoggingOut(false);
    }
  };

  // Root sections are auto-reactive — reading directly from the store means
  // the greeting flips to "Merhaba, Mustafa" as soon as hydration lands.
  const firstName = customerStore.customer?.firstName?.trim() || null;

  useEffect(() => {
    let cancelled = false;
    getOrders(customerStore)
      .then((result) => {
        if (!cancelled) setOrders(result ?? []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isOrderLoaded = orders !== null;
  const lastOrder = useMemo<IkasOrder | null>(() => {
    if (!orders?.length) return null;
    return [...orders].sort((a, b) => {
      const aTime = a.orderedAt ?? a.createdAt ?? 0;
      const bTime = b.orderedAt ?? b.createdAt ?? 0;
      return bTime - aTime;
    })[0];
  }, [orders]);

  const ordersListHref = "/account/orders";
  const lastOrderHref = lastOrder ? getIkasOrderHref(lastOrder) : ordersListHref;
  const lastOrderDate = lastOrder ? getIkasOrderFormattedOrderedAt(lastOrder) : null;
  const lastOrderTotal = lastOrder
    ? getIkasOrderFormattedTotalFinalPrice(lastOrder)
    : "";
  const lastOrderStatus = lastOrder
    ? getIkasOrderPackageStatusTranslation(lastOrder)
    : "";

  return (
    <section
      class="account-dashboard"
      // Inline `visibility: hidden` hides the section during the cold-load
      // window when the scoped CSS chunk hasn't arrived yet — otherwise the
      // dashboard flashes as unstyled HTML. The component's own CSS flips it
      // back to `visible` (via !important to beat the inline rule) once the
      // chunk loads. `minHeight: 100vh` reserves vertical space during that
      // window so the footer doesn't jump up and then back down.
      style={{
        visibility: "hidden",
        minHeight: "100vh",
        ...(backgroundColor ? { backgroundColor } : null),
      }}
    >
      <div class="account-dashboard__inner">
        <header class="account-dashboard__welcome">
          <h1 class="account-dashboard__greeting">
            {firstName ? (
              <>
                {greeting}{" "}
                <span class="account-dashboard__name">{firstName}</span>
              </>
            ) : (
              stripTrailingPunctuation(greeting)
            )}
          </h1>
          {showSubtext && subtext ? (
            <p class="account-dashboard__subtext">{subtext}</p>
          ) : null}
          <hr class="account-dashboard__divider" />
        </header>

        <nav class="account-dashboard__nav" aria-label={dashboardNavAriaLabel}>
          <ul class="account-dashboard__cards">
            {/* Card 1 — Orders (spans 2 columns) */}
            <li
              class={`account-dashboard__card-item account-dashboard__card-item--wide${
                isOrderLoaded && lastOrder
                  ? " account-dashboard__card-item--split"
                  : ""
              }`}
              style={{ "--reveal-delay": `0ms` } as any}
            >
              <a
                class="account-dashboard__card account-dashboard__card--orders account-dashboard__orders-main"
                href={ordersListHref}
              >
                <h2 class="account-dashboard__card-title">{ordersCardTitle}</h2>

                {!isOrderLoaded ? (
                  <p class="account-dashboard__card-description">
                    {ordersCardDescription}
                  </p>
                ) : !lastOrder ? (
                  <>
                    <p class="account-dashboard__card-description">
                      {noOrderInlineText}
                    </p>
                    <span class="account-dashboard__order-subline">
                      {noOrderInlineCta}
                    </span>
                  </>
                ) : (
                  <p class="account-dashboard__card-description">
                    {ordersCardDescription}
                  </p>
                )}

                <span
                  class="account-dashboard__card-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>

              {isOrderLoaded && lastOrder ? (
                <a
                  class="account-dashboard__card account-dashboard__orders-aside"
                  href={lastOrderHref}
                >
                  <span class="account-dashboard__order-eyebrow">
                    <span
                      class="account-dashboard__order-eyebrow-dot"
                      aria-hidden="true"
                    />
                    {lastOrderLabel}
                  </span>
                  <div class="account-dashboard__order-summary">
                    <div class="account-dashboard__order-headline">
                      <span class="account-dashboard__order-number">
                        #{lastOrder.orderNumber ?? "-"}
                      </span>
                      {lastOrderStatus ? (
                        <span class="account-dashboard__order-badge">
                          {lastOrderStatus}
                        </span>
                      ) : null}
                    </div>
                    {(lastOrderDate || lastOrderTotal) ? (
                      <span class="account-dashboard__order-meta">
                        {[lastOrderDate, lastOrderTotal]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ) : null}
                  </div>
                  <span
                    class="account-dashboard__card-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              ) : null}
            </li>

            {/* Card 2 — Addresses */}
            <li
              class="account-dashboard__card-item"
              style={{ "--reveal-delay": `80ms` } as any}
            >
              <a
                class="account-dashboard__card"
                href="/account/addresses"
              >
                <h2 class="account-dashboard__card-title">
                  {addressesCardTitle}
                </h2>
                <p class="account-dashboard__card-description">
                  {addressesCardDescription}
                </p>
                <span
                  class="account-dashboard__card-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </li>

            {/* Card 3 — Favorilerim */}
            <li
              class="account-dashboard__card-item"
              style={{ "--reveal-delay": `160ms` } as any}
            >
              <a
                class="account-dashboard__card"
                href="/account/favorite-products"
              >
                <h2 class="account-dashboard__card-title">
                  {favoritesCardTitle}
                </h2>
                <p class="account-dashboard__card-description">
                  {favoritesCardDescription}
                </p>
                <span
                  class="account-dashboard__card-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="account-dashboard__footer">
          <button
            type="button"
            class="account-dashboard__action account-dashboard__action--secondary"
            onClick={() => setIsProfileModalOpen(true)}
          >
            {editInfoText}
          </button>
          <button
            type="button"
            class="account-dashboard__action account-dashboard__logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? loggingOutText : logoutText}
          </button>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={modalTitle}
        firstNameLabel={modalFirstNameLabel}
        lastNameLabel={modalLastNameLabel}
        phoneLabel={modalPhoneLabel}
        marketingLabel={modalMarketingLabel}
        saveText={modalSaveText}
        savingText={modalSavingText}
        cancelText={modalCancelText}
        closeAriaLabel={modalCloseAriaLabel}
      />
    </section>
  );
}

export default AccountDashboard;

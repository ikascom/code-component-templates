import { useState } from "preact/hooks";
import type { IkasProductList } from "@ikas/bp-storefront";
import { Props } from "./types";
import ProductSliderTrack from "../../sub-components/ProductSliderTrack";

function resolveTabLabel(
  label: string | undefined,
  list: IkasProductList | undefined,
  fallback: string
): string {
  const trimmed = label?.trim();
  if (trimmed) return trimmed;
  if (!list) return fallback;
  if (list.category?.name) return list.category.name;
  if (list.brand?.name) return list.brand.name;
  if (list.searchKeyword) return list.searchKeyword;
  return fallback;
}

export function MultiTabProductSlider(props: Props) {
  const {
    sectionTitle,
    tab1Label,
    tab2Label,
    tab3Label,
    tab1Products,
    tab2Products,
    tab3Products,
    defaultTabLabel,
    backgroundColor,
    textColor,
    tabActiveColor,
    tabInactiveColor,
    accentColor,
    cardAspectRatio,
    productsPerView,
    showProductName,
    showPrice,
    showRating,
    enableHoverImage,
    reviewCountLabel = "değerlendirme",
    prevAriaLabel = "Previous products",
    nextAriaLabel = "Next products",
    imageAltPrefix = "Product image:",
    saleLabel = "İNDİRİM",
    soldOutLabel = "TÜKENDİ",
    offLabel = "İNDİRİM",
    savingsBadgeStyle = "amount",
    saleBadgeColor,
    saleBadgeTextColor,
    soldOutBadgeColor,
    soldOutBadgeTextColor,
    savingsBadgeColor,
    savingsBadgeTextColor,
  } = props;

  const fallbackLabel = defaultTabLabel?.trim() || "Tüm Ürünler";

  const allTabs = [
    { label: resolveTabLabel(tab1Label, tab1Products, fallbackLabel), list: tab1Products },
    { label: resolveTabLabel(tab2Label, tab2Products, fallbackLabel), list: tab2Products },
    { label: resolveTabLabel(tab3Label, tab3Products, fallbackLabel), list: tab3Products },
  ];

  const tabs = allTabs.filter(
    (t) => t.list && t.list.data && t.list.data.length > 0
  );

  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  const safeIndex = Math.min(activeTab, tabs.length - 1);
  const current = tabs[safeIndex];
  const showTabBar = tabs.length >= 2;

  const sectionStyle = {
    backgroundColor: backgroundColor || undefined,
    "--slider-text-color": textColor || "var(--color-text-primary)",
    "--slider-tab-active": tabActiveColor || "var(--color-text-primary)",
    "--slider-tab-inactive": tabInactiveColor || "var(--color-text-muted)",
    "--slider-accent": accentColor || "var(--color-accent)",
    "--slider-sale-bg": saleBadgeColor || "var(--color-accent)",
    "--slider-sale-fg": saleBadgeTextColor || "#FFFFFF",
    "--slider-soldout-bg": soldOutBadgeColor || "#9B1B1B",
    "--slider-soldout-fg": soldOutBadgeTextColor || "#FFFFFF",
    "--slider-savings-bg": savingsBadgeColor || "var(--color-accent-light)",
    "--slider-savings-fg": savingsBadgeTextColor || "var(--color-text-primary)",
  } as Record<string, string>;

  return (
    <section class="multi-tab-product-slider" style={sectionStyle}>
      <div class="multi-tab-product-slider-inner">
        <div
          class={`mtps-header ${showTabBar ? "has-tabs" : "no-tabs"}`}
        >
          <h2 class="mtps-title">{sectionTitle}</h2>

          {showTabBar && (
            <nav class="mtps-tabs" role="tablist" aria-label={sectionTitle}>
              {tabs.map((tab, i) => {
                const isActive = i === safeIndex;
                return (
                  <span class="mtps-tab-item" key={i}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive ? "true" : "false"}
                      class={`mtps-tab ${isActive ? "is-active" : ""}`}
                      onClick={() => setActiveTab(i)}
                    >
                      {isActive && <span class="mtps-tab-bullet" aria-hidden="true">•</span>}
                      <span class="mtps-tab-label">{tab.label}</span>
                    </button>
                    {i < tabs.length - 1 && (
                      <span class="mtps-tab-sep" aria-hidden="true">/</span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}
        </div>

        <div class="mtps-track-area">
          <ProductSliderTrack
            key={safeIndex}
            products={current.list!.data}
            aspectRatio={cardAspectRatio || "3/4"}
            productsPerView={productsPerView ?? 4}
            showProductName={showProductName ?? true}
            showPrice={showPrice ?? true}
            showRating={showRating ?? true}
            reviewCountLabel={reviewCountLabel}
            enableHoverImage={enableHoverImage ?? true}
            prevAriaLabel={prevAriaLabel}
            nextAriaLabel={nextAriaLabel}
            imageAltPrefix={imageAltPrefix}
            saleLabel={saleLabel}
            soldOutLabel={soldOutLabel}
            offLabel={offLabel}
            savingsBadgeStyle={
              String(savingsBadgeStyle ?? "").toLowerCase() === "percent"
                ? "percent"
                : "amount"
            }
          />
        </div>
      </div>
    </section>
  );
}

export default MultiTabProductSlider;

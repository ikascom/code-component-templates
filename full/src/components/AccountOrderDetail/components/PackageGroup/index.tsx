import { useState, useMemo } from "preact/hooks";
import { IkasDisplayedPackage, IkasOrderLineItem } from "@ikas/bp-storefront";
import { CaretUpSVG, CaretDownSVG } from "../../../../sub-components/icons";
import OrderItemRow from "../OrderItemRow";

type GroupedEntry =
  | {
      isBundleOrder: true;
      bundleLineId: string;
      bundleName?: string | null;
      items: IkasOrderLineItem[];
    }
  | { isBundleOrder: false; items: IkasOrderLineItem[] };

function groupOrderLineItems(items: IkasOrderLineItem[]): GroupedEntry[] {
  const groups: GroupedEntry[] = [];

  items.forEach((item) => {
    const settings = item.bundleProductSettings;

    if (settings) {
      const existing = groups.find(
        (g): g is Extract<GroupedEntry, { isBundleOrder: true }> =>
          g.isBundleOrder && g.bundleLineId === settings.bundleLineId,
      );
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({
          isBundleOrder: true,
          bundleLineId: settings.bundleLineId,
          bundleName: settings.name,
          items: [item],
        });
      }
    } else {
      groups.push({ isBundleOrder: false, items: [item] });
    }
  });

  return groups;
}

interface Props {
  pkg: IkasDisplayedPackage;
  quantityLabel: string;
  cargoCompanyLabel: string;
  trackingNumberLabel: string;
}

export default function PackageGroup({
  pkg,
  quantityLabel,
  cargoCompanyLabel,
  trackingNumberLabel,
}: Props) {
  const [open, setOpen] = useState(true);
  const itemCount = pkg.orderLineItems?.length ?? 0;
  const grouped = useMemo(
    () => groupOrderLineItems(pkg.orderLineItems ?? []),
    [pkg.orderLineItems],
  );

  return (
    <div className="kombos-order-detail-pkg">
      <button
        type="button"
        className="kombos-order-detail-pkg__header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="kombos-order-detail-pkg__header-left">
          <span className="kombos-order-detail-pkg__status text-sm-medium">
            {pkg.statusTranslation}
          </span>
          <span className="kombos-order-detail-pkg__count text-sm-medium">
            ({itemCount})
          </span>
        </div>
        <span className="kombos-order-detail-pkg__caret">
          {open ? <CaretUpSVG /> : <CaretDownSVG />}
        </span>
      </button>

      {open && (
        <div className="kombos-order-detail-pkg__body">
          <div className="kombos-order-detail-pkg__items">
            {grouped.map((group, idx) =>
              group.isBundleOrder ? (
                <div
                  key={group.bundleLineId}
                  className="kombos-order-detail-pkg__bundle"
                >
                  {group.bundleName && (
                    <span className="kombos-order-detail-pkg__bundle-name text-sm-medium">
                      {group.bundleName}
                    </span>
                  )}
                  <div className="kombos-order-detail-pkg__bundle-items">
                    {group.items.map((item) => (
                      <OrderItemRow
                        key={item.id}
                        item={item}
                        quantityLabel={quantityLabel}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                group.items.map((item) => (
                  <OrderItemRow
                    key={item.id}
                    item={item}
                    quantityLabel={quantityLabel}
                  />
                ))
              ),
            )}
          </div>

          {pkg.trackingInfo && (
            <div className="kombos-order-detail-pkg__tracking">
              {pkg.trackingInfo.cargoCompany && (
                <p className="kombos-order-detail-pkg__tracking-line text-sm-regular">
                  <span>{cargoCompanyLabel} </span>
                  <span className="text-sm-medium">
                    {pkg.trackingInfo.cargoCompany}
                  </span>
                </p>
              )}
              {pkg.trackingInfo.trackingNumber && (
                <p className="kombos-order-detail-pkg__tracking-line text-sm-regular">
                  <span>{trackingNumberLabel} </span>
                  {pkg.trackingInfo.trackingLink ? (
                    <a
                      href={pkg.trackingInfo.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kombos-order-detail-pkg__tracking-link text-sm-medium"
                    >
                      {pkg.trackingInfo.trackingNumber}
                    </a>
                  ) : (
                    <span className="text-sm-medium">
                      {pkg.trackingInfo.trackingNumber}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { cx } from "../../utils/cx";
import { CaretRightSVG } from "../icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  items: BreadcrumbItem[];
  size?: "sm" | "xs";
  className?: string;
}

export default function Breadcrumb({ items, size = "sm", className }: Props) {
  if (items.length === 0) return null;

  const typographyClass = size === "xs" ? "text-xs-medium" : "text-sm-medium";

  return (
    <nav className={cx("kombos-breadcrumb", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.href ?? item.label} className="kombos-breadcrumb__item">
            {item.href ? (
              <a
                href={item.href}
                className={cx("kombos-breadcrumb__link", typographyClass, isLast && "kombos-breadcrumb__link--active")}
              >
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className={cx("kombos-breadcrumb__link", "kombos-breadcrumb__link-btn", typographyClass)}
              >
                {item.label}
              </button>
            ) : (
              <span className={cx("kombos-breadcrumb__current", typographyClass)}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className={cx("kombos-breadcrumb__sep", size === "xs" && "kombos-breadcrumb__sep--xs")}>
                <CaretRightSVG />
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

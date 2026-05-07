import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { cx } from "../../utils/cx";
import { MinusSVG, PlusSVG } from "../icons";

interface Props {
  title?: string;
  defaultOpen?: boolean;
  children: ComponentChildren;
  className?: string;
}

export default function CollapsibleGroup({
  title,
  defaultOpen = false,
  children,
  className,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);

  return (
    <div className={cx("kombos-collapsible-group", className)}>
      <button
        type="button"
        className="kombos-collapsible-group__header"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        {title && (
          <span className="kombos-collapsible-group__title text-sm-semibold">
            {title}
          </span>
        )}
        <span
          className={cx(
            "kombos-collapsible-group__toggle-icon",
            isCollapsed && "kombos-collapsible-group__toggle-icon--collapsed",
          )}
        >
          {isCollapsed ? <PlusSVG /> : <MinusSVG />}
        </span>
      </button>
      <div
        className={cx(
          "kombos-collapsible-group__body",
          isCollapsed && "kombos-collapsible-group__body--collapsed",
        )}
      >
        <div className="kombos-collapsible-group__content">{children}</div>
      </div>
    </div>
  );
}

import {
  IkasOrderLineItem,
  IkasOrderLineItemOption,
  IkasOrderLineItemOptionValue,
  getOrderLineItemOptionValueFormattedPrice,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

interface Props {
  item: IkasOrderLineItem;
  option: IkasOrderLineItemOption;
  value: IkasOrderLineItemOptionValue;
}

function getFileName(value: string): string {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/");
    return decodeURIComponent(segments[segments.length - 1] || "File");
  } catch {
    return value || "File";
  }
}

const OptionValueDisplay = observer(function OptionValueDisplay({
  item,
  option,
  value,
}: Props) {
  const price =
    (value?.price ?? 0) > 0
      ? getOrderLineItemOptionValueFormattedPrice(item, value)
      : "";

  const priceStr = price ? ` (+${price})` : null;
  const type = option.type as string;

  if (type === "COLOR_PICKER") {
    return (
      <span className="kombos-cart-item__option text-xs-regular">
        {option.name}:
        <span
          className="kombos-cart-item__option-color"
          style={{ backgroundColor: value.value }}
        />
        {priceStr}
      </span>
    );
  }

  if (type === "FILE") {
    return (
      <span className="kombos-cart-item__option text-xs-regular">
        {option.name}:{" "}
        <a
          href={value.value}
          target="_blank"
          rel="noopener noreferrer"
          className="kombos-cart-item__option-file text-xs-regular"
        >
          {getFileName(value.value)}
        </a>
        {priceStr}
      </span>
    );
  }

  const displayValue = type === "CHECKBOX" ? null : value.name || value.value;

  return (
    <span className="kombos-cart-item__option text-xs-regular">
      {option.name}
      {displayValue ? `: ${displayValue}` : ""}
      {priceStr}
    </span>
  );
});

export default OptionValueDisplay;

import { IkasOrderLineItem } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import OptionValueDisplay from "../OptionValueDisplay";

interface Props {
  item: IkasOrderLineItem;
}

const ItemOptions = observer(function ItemOptions({ item }: Props) {
  const options = item.options ?? [];

  if (options.length === 0) return null;

  return (
    <div className="kombos-cart-item__options">
      {options.map((option, optIdx) =>
        option.values.map((value, valIdx) => (
          <OptionValueDisplay
            key={`${optIdx}-${valIdx}`}
            item={item}
            option={option}
            value={value}
          />
        )),
      )}
    </div>
  );
});

export default ItemOptions;

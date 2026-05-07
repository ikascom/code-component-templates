import {
  IkasProductOption,
  selectValue,
  isProductOptionSelectValueSelected,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../../../utils/cx";
import FormItem from "../../../../../../sub-components/FormItem";
import { getSelectValuePrice } from "../../../../../../utils/optionPrice";

interface Props {
  option: IkasProductOption;
  errored: boolean;
  requiredErrorText: string;
  constraintText?: string;
}

const ChoiceBox = observer(function ChoiceBox({
  option,
  errored,
  requiredErrorText,
  constraintText,
}: Props) {
  const settings = option.selectSettings!;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={errored ? requiredErrorText : constraintText}
    >
      <div className="kombos-option-choice__grid">
        {settings.values.map((val) => {
          const isSelected = isProductOptionSelectValueSelected(option, val);
          const price = getSelectValuePrice(option, val);

          return (
            <button
              key={val.id}
              type="button"
              className={cx("kombos-option-choice__box", "text-sm-medium", isSelected && "kombos-option-choice__box--selected")}
              onClick={() => selectValue(option, val)}
            >
              <span>{val.value}</span>
              {price && (
                <span className="kombos-option-choice__box-price text-xs-regular">
                  {price}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </FormItem>
  );
});

export default ChoiceBox;

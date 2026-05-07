import {
  IkasProductOption,
  selectValue,
  clearValues,
  isProductOptionSelectValueSelected,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../../../utils/cx";
import Select from "../../../../../../sub-components/Select";
import FormItem from "../../../../../../sub-components/FormItem";
import Checkbox from "../../../../../../sub-components/Checkbox";
import { getSelectValuePrice } from "../../../../../../utils/optionPrice";

interface Props {
  option: IkasProductOption;
  errored: boolean;
  requiredErrorText: string;
  placeholderText: string;
  constraintText?: string;
}

const ChoiceSelect = observer(function ChoiceSelect({
  option,
  errored,
  requiredErrorText,
  placeholderText,
  constraintText,
}: Props) {
  const settings = option.selectSettings!;
  const selectedId = option.values?.[0] ?? "";
  const selectOptions = settings.values.map((v) => ({
    label: `${v.value} (${getSelectValuePrice(option, v)})`,
    value: v.id,
  }));

  const isMulti = (settings.maxSelect ?? 0) > 1;
  const selectId = !isMulti ? `option-choice-${option.id}` : undefined;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      htmlFor={selectId}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={errored ? requiredErrorText : constraintText}
    >
      {isMulti ? (
        <div
          className={cx(
            "kombos-option-choice__checklist",
            errored && "kombos-option-choice__checklist--error",
          )}
        >
          {settings.values.map((val) => {
            const isSelected = isProductOptionSelectValueSelected(option, val);
            const price = getSelectValuePrice(option, val);

            return (
              <div
                key={val.id}
                className="kombos-option-choice__checklist-row"
                onClick={() => selectValue(option, val)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => selectValue(option, val)}
                />
                <span className="text-sm-medium">{val.value}</span>
                {price && (
                  <span className="kombos-option-choice__checklist-price text-xs-regular">
                    {price}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Select
          id={selectId}
          allowClear
          options={[{ label: placeholderText, value: "" }, ...selectOptions]}
          value={selectedId}
          onChange={(e: Event) => {
            const id = (e.target as HTMLSelectElement).value;
            if (!id) {
              clearValues(option, true);
              return;
            }
            const val = settings.values.find((v) => v.id === id);
            if (val) selectValue(option, val);
          }}
          onClear={() => clearValues(option, true)}
          size="xs"
        />
      )}
    </FormItem>
  );
});

export default ChoiceSelect;

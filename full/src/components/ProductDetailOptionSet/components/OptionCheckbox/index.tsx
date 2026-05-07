import {
  IkasProductOption,
  isChecked as isOptionChecked,
  setCheckboxValue,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Checkbox from "../../../../sub-components/Checkbox";
import FormItem from "../../../../sub-components/FormItem";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
}

const OptionCheckbox = observer(function OptionCheckbox({
  option,
  showError,
  requiredErrorText,
}: Props) {
  const checked = isOptionChecked(option);
  const errored = showError && hasOptionError(option);
  const label = getProductOptionFormattedLabel(option);

  return (
    <FormItem
      status={errored ? "error" : "default"}
      helper={errored ? requiredErrorText : undefined}
    >
      <div className="kombos-option-checkbox__row">
        <Checkbox
          checked={checked}
          onChange={(val) => setCheckboxValue(option, val)}
        />
        <div className="kombos-option-checkbox__text">
          <span className="kombos-option-checkbox__label text-sm-medium">
            {label}
          </span>
          {option.optionalText && (
            <span className="kombos-option-checkbox__desc text-xs-regular">
              {option.optionalText}
            </span>
          )}
        </div>
      </div>
    </FormItem>
  );
});

export default OptionCheckbox;

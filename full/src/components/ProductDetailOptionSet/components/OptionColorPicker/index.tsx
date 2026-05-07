import {
  IkasProductOption,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import FormItem from "../../../../sub-components/FormItem";
import ColorInput from "../../../../sub-components/ColorInput";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
}

const OptionColorPicker = observer(function OptionColorPicker({
  option,
  showError,
  requiredErrorText,
}: Props) {
  const errored = showError && hasOptionError(option);
  const hasValue = option.values && option.values.length > 0;
  const currentColor = option.values?.[0] ?? "#FFFFFF";

  const handleChange = (e: Event) => {
    const hex = (e.target as HTMLInputElement).value;
    option.values = [hex];
  };

  const handleClear = () => {
    option.values = [];
  };

  const inputId = `option-color-${option.id}`;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      htmlFor={inputId}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={errored ? requiredErrorText : undefined}
    >
      <ColorInput
        id={inputId}
        value={currentColor}
        onInput={handleChange}
        onClear={hasValue ? handleClear : undefined}
      />
    </FormItem>
  );
});

export default OptionColorPicker;

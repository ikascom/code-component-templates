import {
  IkasProductOption,
  getTextValue,
  setTextValue,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Input from "../../../../sub-components/Input";
import FormItem from "../../../../sub-components/FormItem";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
  minLabelText: string;
  maxLabelText: string;
}

const OptionText = observer(function OptionText({
  option,
  showError,
  requiredErrorText,
  minLabelText,
  maxLabelText,
}: Props) {
  const value = getTextValue(option);
  const errored = showError && hasOptionError(option);
  const settings = option.textSettings;

  const helperParts: string[] = [];
  if (settings?.min != null) helperParts.push(`${minLabelText}${settings.min}`);
  if (settings?.max != null) helperParts.push(`${maxLabelText}${settings.max}`);
  const helperText =
    helperParts.length > 0 ? helperParts.join(" / ") : undefined;

  const inputId = `option-text-${option.id}`;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      htmlFor={inputId}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={errored ? requiredErrorText : helperText}
    >
      <Input
        id={inputId}
        value={value}
        onInput={(e: Event) =>
          setTextValue(option, (e.target as HTMLInputElement).value)
        }
        maxLength={settings?.max ?? undefined}
        size="xs"
      />
    </FormItem>
  );
});

export default OptionText;

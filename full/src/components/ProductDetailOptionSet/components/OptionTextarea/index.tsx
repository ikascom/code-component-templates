import {
  IkasProductOption,
  getTextValue,
  setTextValue,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Textarea from "../../../../sub-components/Textarea";
import FormItem from "../../../../sub-components/FormItem";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
  minLabelText: string;
  maxLabelText: string;
}

const OptionTextarea = observer(function OptionTextarea({
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

  const textareaId = `option-textarea-${option.id}`;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      htmlFor={textareaId}
      status={errored ? "error" : "default"}
      helper={
        errored ? (
          requiredErrorText
        ) : (
          <div className="kombos-option-textarea__footer">
            {helperText ? helperText : <span />}
            {settings?.max != null && (
              <span className="kombos-option-textarea__counter">
                {(value ?? "").length} / {settings.max}
              </span>
            )}
          </div>
        )
      }
      description={option.optionalText}
    >
      <Textarea
        id={textareaId}
        value={value}
        onInput={(e: Event) =>
          setTextValue(option, (e.target as HTMLTextAreaElement).value)
        }
        maxLength={settings?.max ?? undefined}
        rows={4}
        size="xs"
      />
    </FormItem>
  );
});

export default OptionTextarea;

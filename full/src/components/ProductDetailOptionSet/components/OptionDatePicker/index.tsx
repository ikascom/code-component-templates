import {
  IkasProductOption,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import FormItem from "../../../../sub-components/FormItem";
import Input from "../../../../sub-components/Input";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
  minLabelText: string;
  maxLabelText: string;
}

function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateForDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

function computeMinMaxDates(option: IkasProductOption) {
  const settings = option.dateSettings;
  let minDate: string | undefined;
  let maxDate: string | undefined;

  if (settings) {
    if (settings.min) {
      minDate = formatDateForInput(new Date(settings.min));
    } else if (settings.minRelativeNextDate != null) {
      const d = new Date();
      d.setDate(d.getDate() + settings.minRelativeNextDate);
      minDate = formatDateForInput(d);
    }

    if (settings.max) {
      maxDate = formatDateForInput(new Date(settings.max));
    } else if (settings.maxRelativeNextDate != null) {
      const d = new Date();
      d.setDate(d.getDate() + settings.maxRelativeNextDate);
      maxDate = formatDateForInput(d);
    }
  }

  return { minDate, maxDate };
}

const OptionDatePicker = observer(function OptionDatePicker({
  option,
  showError,
  requiredErrorText,
  minLabelText,
  maxLabelText,
}: Props) {
  const errored = showError && hasOptionError(option);
  const storedValue = option.values?.[0] ?? "";
  const currentValue = storedValue
    ? formatDateForInput(new Date(storedValue))
    : "";
  const { minDate, maxDate } = computeMinMaxDates(option);

  const applyDateValue = (val: string) => {
    if (!val) {
      option.values = [];
      return;
    }
    const date = new Date(val);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) return;
    date.setHours(23, 59, 0, 0);
    option.values = [date.toString()];
  };

  const handleChange = (e: Event) => {
    applyDateValue((e.target as HTMLInputElement).value);
  };

  const handleBlur = (e: Event) => {
    applyDateValue((e.target as HTMLInputElement).value);
  };

  const inputId = `option-date-${option.id}`;

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      htmlFor={inputId}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={
        errored
          ? requiredErrorText
          : minDate || maxDate
            ? [
                minDate && `${minLabelText}${formatDateForDisplay(minDate)}`,
                maxDate && `${maxLabelText}${formatDateForDisplay(maxDate)}`,
              ]
                .filter(Boolean)
                .join(" — ")
            : undefined
      }
    >
      <Input
        id={inputId}
        type="date"
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={minDate}
        max={maxDate}
        size="xs"
      />
    </FormItem>
  );
});

export default OptionDatePicker;

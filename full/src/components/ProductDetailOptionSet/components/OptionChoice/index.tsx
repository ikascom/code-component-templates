import {
  IkasProductOption,
  isChoiceOptionSelectType,
  isChoiceOptionSwatchType,
  hasError as hasOptionError,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import ChoiceSelect from "./components/ChoiceSelect";
import ChoiceSwatch from "./components/ChoiceSwatch";
import ChoiceBox from "./components/ChoiceBox";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
  placeholderText: string;
  minLabelText: string;
  maxLabelText: string;
}

const OptionChoice = observer(function OptionChoice({
  option,
  showError,
  requiredErrorText,
  placeholderText,
  minLabelText,
  maxLabelText,
}: Props) {
  const errored = showError && hasOptionError(option);
  const settings = option.selectSettings;
  if (!settings) return null;

  const isSelect = isChoiceOptionSelectType(option);
  const isSwatch = isChoiceOptionSwatchType(option);

  const constraintParts: string[] = [];
  if (settings.minSelect != null)
    constraintParts.push(`${minLabelText}${settings.minSelect}`);
  if (settings.maxSelect != null)
    constraintParts.push(`${maxLabelText}${settings.maxSelect}`);
  const constraintText =
    constraintParts.length > 0 ? constraintParts.join(" / ") : undefined;

  const common = { option, errored, requiredErrorText, constraintText };

  if (isSelect) {
    return <ChoiceSelect {...common} placeholderText={placeholderText} />;
  }

  if (isSwatch) {
    return <ChoiceSwatch {...common} />;
  }

  return <ChoiceBox {...common} />;
});

export default OptionChoice;

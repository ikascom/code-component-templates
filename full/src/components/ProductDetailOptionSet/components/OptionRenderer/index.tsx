import {
  getDisplayedChildOptions,
  isTextOption,
  isTextAreaOption,
  isCheckboxOption,
  isChoiceOption,
  isColorPickerOption,
  isDatePickerOption,
  isFileOption,
  IkasProductOption,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

import OptionText from "../OptionText";
import OptionTextarea from "../OptionTextarea";
import OptionCheckbox from "../OptionCheckbox";
import OptionChoice from "../OptionChoice";
import OptionColorPicker from "../OptionColorPicker";
import OptionDatePicker from "../OptionDatePicker";
import OptionFile from "../OptionFile";

export interface TextProps {
  requiredErrorText: string;
  selectPlaceholderText: string;
  fileDropText: string;
  uploadingText: string;
  uploadFailedText: string;
  fileSizeErrorText: string;
  fileTypeErrorText: string;
  maxFilesErrorText: string;
  minLabelText: string;
  maxLabelText: string;
  fileFallbackNameText: string;
}

interface Props {
  option: IkasProductOption;
  showError: boolean;
  texts: TextProps;
}

function renderOption(
  option: IkasProductOption,
  showError: boolean,
  texts: TextProps,
) {
  const commonProps = {
    option,
    showError,
    requiredErrorText: texts.requiredErrorText,
  };

  const minMaxProps = {
    minLabelText: texts.minLabelText,
    maxLabelText: texts.maxLabelText,
  };

  if (isTextOption(option)) {
    return <OptionText {...commonProps} {...minMaxProps} />;
  }

  if (isTextAreaOption(option)) {
    return <OptionTextarea {...commonProps} {...minMaxProps} />;
  }

  if (isCheckboxOption(option)) {
    return <OptionCheckbox {...commonProps} />;
  }

  if (isChoiceOption(option)) {
    return (
      <OptionChoice
        {...commonProps}
        {...minMaxProps}
        placeholderText={texts.selectPlaceholderText}
      />
    );
  }

  if (isColorPickerOption(option)) {
    return <OptionColorPicker {...commonProps} />;
  }

  if (isDatePickerOption(option)) {
    return <OptionDatePicker {...commonProps} {...minMaxProps} />;
  }

  if (isFileOption(option)) {
    return (
      <OptionFile
        {...commonProps}
        {...minMaxProps}
        fileFallbackNameText={texts.fileFallbackNameText}
        fileDropText={texts.fileDropText}
        uploadingText={texts.uploadingText}
        uploadFailedText={texts.uploadFailedText}
        fileSizeErrorText={texts.fileSizeErrorText}
        fileTypeErrorText={texts.fileTypeErrorText}
        maxFilesErrorText={texts.maxFilesErrorText}
      />
    );
  }

  return null;
}

const OptionRenderer = observer(function OptionRenderer({
  option,
  showError,
  texts,
}: Props) {
  const childOptions = getDisplayedChildOptions(option) as IkasProductOption[];

  return (
    <div key={option.id} className="kombos-pd-optset__option">
      {renderOption(option, showError, texts)}
      {childOptions.length > 0 && (
        <div className="kombos-pd-optset__children">
          {childOptions.map((child) => (
            <OptionRenderer
              key={child.id}
              option={child}
              showError={showError}
              texts={texts}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default OptionRenderer;

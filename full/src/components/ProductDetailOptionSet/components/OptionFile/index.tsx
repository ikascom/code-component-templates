import {
  IkasProductOption,
  productOptionFileUpload,
  hasError as hasOptionError,
  getProductOptionFormattedLabel,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { useState, useRef } from "preact/hooks";
import FormItem from "../../../../sub-components/FormItem";
import { UploadSVG, TrashSVG } from "../../../../sub-components/icons";

interface Props {
  option: IkasProductOption;
  showError: boolean;
  requiredErrorText: string;
  minLabelText: string;
  maxLabelText: string;
  fileFallbackNameText: string;
  fileDropText: string;
  uploadingText: string;
  uploadFailedText: string;
  fileSizeErrorText: string;
  fileTypeErrorText: string;
  maxFilesErrorText: string;
}

const MAX_FILE_SIZE_MB = 4;

const OptionFile = observer(function OptionFile({
  option,
  showError,
  requiredErrorText,
  minLabelText,
  maxLabelText,
  fileFallbackNameText,
  fileDropText,
  uploadingText,
  uploadFailedText,
  fileSizeErrorText,
  fileTypeErrorText,
  maxFilesErrorText,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const errored = showError && hasOptionError(option);
  const settings = option.fileSettings;
  const uploadedFiles = option.values ?? [];

  const validateFiles = (files: File[]): string | null => {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return fileSizeErrorText
          .replace("{fileName}", file.name)
          .replace("{maxSize}", String(MAX_FILE_SIZE_MB));
      }

      if (settings?.allowedExtensions?.length) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const allowed = settings.allowedExtensions.map((e) =>
          e.toLowerCase().replace(/^\./, ""),
        );
        if (!allowed.includes(ext)) {
          return fileTypeErrorText
            .replace("{fileName}", file.name)
            .replace("{ext}", `.${ext}`);
        }
      }
    }

    const totalCount = uploadedFiles.length + files.length;
    if (settings?.maxQuantity != null && totalCount > settings.maxQuantity) {
      return maxFilesErrorText.replace("{max}", String(settings.maxQuantity));
    }

    return null;
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList?.length || isUploading) return;
    const files = Array.from(fileList);

    const error = validateFiles(files);
    if (error) {
      setFileError(error);
      return;
    }

    setFileError(null);
    setIsUploading(true);
    try {
      await productOptionFileUpload(option, files);
    } catch {
      setFileError(uploadFailedText);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newValues = [...uploadedFiles];
    newValues.splice(index, 1);
    option.values = newValues;
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    handleUpload(e.dataTransfer?.files ?? null);
  };

  const handleDropZoneClick = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const acceptExt = settings?.allowedExtensions?.length
    ? settings.allowedExtensions
        .map((e) => (e.startsWith(".") ? e : `.${e}`))
        .join(",")
    : undefined;

  const constraintParts: string[] = [];
  if (settings?.minQuantity != null)
    constraintParts.push(`${minLabelText}${settings.minQuantity}`);
  if (settings?.maxQuantity != null)
    constraintParts.push(`${maxLabelText}${settings.maxQuantity}`);
  if (settings?.allowedExtensions?.length) {
    constraintParts.push(settings.allowedExtensions.join(", "));
  }
  const constraintText =
    constraintParts.length > 0 ? constraintParts.join(" / ") : undefined;

  const dropCls = [
    "kombos-option-file__drop",
    isDragOver && "kombos-option-file__drop--active",
    errored && "kombos-option-file__drop--error",
    isUploading && "kombos-option-file__drop--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      status={fileError || errored ? "error" : "default"}
      description={option.optionalText}
      helper={
        fileError || errored
          ? (fileError ?? requiredErrorText)
          : constraintText
      }
    >
      <div
        className={dropCls}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        <span className="kombos-option-file__drop-icon">
          <UploadSVG />
        </span>
        <span className="kombos-option-file__drop-text text-sm-regular">
          {isUploading ? uploadingText : fileDropText}
        </span>
        <input
          ref={inputRef}
          type="file"
          className="kombos-option-file__native"
          accept={acceptExt}
          multiple={settings?.maxQuantity !== 1}
          onChange={(e: Event) =>
            handleUpload((e.target as HTMLInputElement).files)
          }
        />
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="kombos-option-file__list">
          {uploadedFiles.map((url, i) => {
            const name = url.split("/").pop() ?? `${fileFallbackNameText} ${i + 1}`;
            return (
              <li key={url} className="kombos-option-file__item">
                <span className="kombos-option-file__item-name text-xs-regular">
                  {name}
                </span>
                <button
                  type="button"
                  className="kombos-option-file__item-remove"
                  onClick={() => handleRemoveFile(i)}
                >
                  <TrashSVG />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </FormItem>
  );
});

export default OptionFile;

import {
  getProductOptionSet,
  getDisplayedOptions,
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  IkasProductOption,
} from "@ikas/bp-storefront";
import { useEffect, useState } from "preact/hooks";
import { Props } from "./types";

import OptionRenderer from "./components/OptionRenderer";
import type { TextProps } from "./components/OptionRenderer";

export function ProductDetailOptionSet({
  product,
  requiredFieldErrorText = "This field is required",
  selectPlaceholderText = "Select",
  fileDropText = "Choose a file or drag it here",
  uploadingText = "Uploading...",
  uploadFailedText = "Upload failed",
  fileSizeErrorText = "{fileName}: max {maxSize}MB",
  fileTypeErrorText = "{fileName}: {ext} file type not allowed",
  maxFilesErrorText = "Maximum {max} files can be uploaded",
  minLabelText = "Min: ",
  maxLabelText = "Max: ",
  fileFallbackNameText = "File",
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!product) return;
    getProductOptionSet(product).then(() => setLoaded(true));
  }, [product]);

  useEffect(() => {
    const showHandler = () => setShowError(true);
    const resetHandler = () => setShowError(false);
    window.addEventListener("ikas:show-option-errors", showHandler);
    window.addEventListener("ikas:reset-option-state", resetHandler);
    return () => {
      window.removeEventListener("ikas:show-option-errors", showHandler);
      window.removeEventListener("ikas:reset-option-state", resetHandler);
    };
  }, []);

  if (!product || !loaded) return null;

  const optionSet = product.productOptionSet;
  if (!optionSet) return null;

  const displayedOptions = getDisplayedOptions(
    optionSet,
  ) as IkasProductOption[];
  if (!displayedOptions.length) return null;

  const texts: TextProps = {
    requiredErrorText: requiredFieldErrorText,
    selectPlaceholderText,
    fileDropText,
    uploadingText,
    uploadFailedText,
    fileSizeErrorText,
    fileTypeErrorText,
    maxFilesErrorText,
    minLabelText,
    maxLabelText,
    fileFallbackNameText,
  };

  return (
    <div
      className="kombos-pd-optset"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <div className="kombos-pd-optset__list">
        {displayedOptions.map((option) => (
          <OptionRenderer
            key={option.id}
            option={option as unknown as IkasProductOption}
            showError={showError}
            texts={texts}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductDetailOptionSet;

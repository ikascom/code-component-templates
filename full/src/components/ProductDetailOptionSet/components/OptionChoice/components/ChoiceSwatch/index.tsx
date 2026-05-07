import { useState } from "preact/hooks";
import {
  IkasProductOption,
  selectValue,
  isProductOptionSelectValueSelected,
  getProductOptionFormattedLabel,
  getSrc,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../../../../../utils/cx";
import FormItem from "../../../../../../sub-components/FormItem";
import Checkbox from "../../../../../../sub-components/Checkbox";
import ImagePreviewModal from "../../../../../../sub-components/ImagePreviewModal";
import { EyeSVG } from "../../../../../../sub-components/icons";
import { getSelectValuePrice } from "../../../../../../utils/optionPrice";

interface Props {
  option: IkasProductOption;
  errored: boolean;
  requiredErrorText: string;
  constraintText?: string;
}

const ChoiceSwatch = observer(function ChoiceSwatch({
  option,
  errored,
  requiredErrorText,
  constraintText,
}: Props) {
  const settings = option.selectSettings;
  const [preview, setPreview] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <FormItem
      label={getProductOptionFormattedLabel(option)}
      status={errored ? "error" : "default"}
      description={option.optionalText}
      helper={errored ? requiredErrorText : constraintText}
    >
      <div className="kombos-option-choice__swatch-grid">
        {settings?.values?.map((val) => {
          const isSelected = isProductOptionSelectValueSelected(option, val);
          const thumbSrc = val.thumbnailImage
            ? getSrc(val.thumbnailImage, 180)
            : null;
          const price = getSelectValuePrice(option, val);

          return (
            <div key={val.id} className="kombos-option-choice__swatch-item">
              <button
                type="button"
                className={cx("kombos-option-choice__swatch-btn", isSelected && "kombos-option-choice__swatch-btn--selected")}
                onClick={() => {
                  if (thumbSrc) {
                    const largeSrc = getSrc(val.thumbnailImage!, 800);
                    setPreview({ src: largeSrc, alt: val.value });
                  } else {
                    selectValue(option, val);
                  }
                }}
                title={val.value}
              >
                {thumbSrc ? (
                  <>
                    <img
                      src={thumbSrc}
                      alt={val.value}
                      className="kombos-option-choice__swatch-img"
                    />
                    <div className="kombos-option-choice__swatch-eye">
                      <EyeSVG />
                    </div>
                  </>
                ) : (
                  <span
                    className="kombos-option-choice__swatch-color"
                    style={{
                      backgroundColor: val.colorCode ?? "transparent",
                    }}
                  />
                )}
              </button>
              {thumbSrc ? (
                <div className="kombos-option-choice__swatch-footer">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => selectValue(option, val)}
                  />
                  {price && (
                    <span className="kombos-option-choice__swatch-price text-xs-regular">
                      {price}
                    </span>
                  )}
                </div>
              ) : (
                price && (
                  <span className="kombos-option-choice__swatch-price text-xs-regular">
                    {price}
                  </span>
                )
              )}
            </div>
          );
        })}
      </div>

      {preview && (
        <ImagePreviewModal
          src={preview.src}
          alt={preview.alt}
          onClose={() => setPreview(null)}
        />
      )}
    </FormItem>
  );
});

export default ChoiceSwatch;

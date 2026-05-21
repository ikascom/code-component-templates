import { observer } from "@ikas/component-utils";
import {
  getDisplayedProductVariantTypes,
  getIkasVariantValueThumbnailImage,
  getProductVariantMainImage,
  getThumbnailSrc,
  isIkasVariantTypeColorSelection,
  selectVariantValue,
} from "@ikas/bp-storefront";
import type { IkasImage, IkasProduct, IkasVariantValue } from "@ikas/bp-storefront";

interface Props {
  product: IkasProduct;
  colorLabel: string;
  sizeLabel: string;
  selectedLabel: string;
  showVariantImage: boolean;
}

function findImageForValue(
  product: IkasProduct,
  value: IkasVariantValue,
): IkasImage | null {
  const explicit = getIkasVariantValueThumbnailImage(value);
  if (explicit) return explicit;

  const variants = product.variants ?? [];
  const matching = variants.find((v) =>
    v.variantValues?.some((vv) => vv.id === value.id),
  );
  if (!matching) return null;

  const mainPi = getProductVariantMainImage(matching);
  if (mainPi?.image) return mainPi.image;

  const fallback = matching.images?.find((pi) => pi.image)?.image;
  return fallback ?? null;
}

const ProductVariants = observer(function ProductVariants({
  product,
  colorLabel,
  sizeLabel,
  selectedLabel,
  showVariantImage,
}: Props) {
  const variantTypes = getDisplayedProductVariantTypes(product);
  if (!variantTypes.length) return null;

  return (
    <div class="pdp-variants">
      {variantTypes.map((vt, vtIndex) => {
        const variantType = vt.variantType;
        const typeName = variantType.name ?? "";
        const isColor = isIkasVariantTypeColorSelection(variantType);

        const sizeKeywords = ["beden", "size"];
        const isSizeLike =
          !isColor && sizeKeywords.some((kw) => typeName.toLowerCase().includes(kw));

        const groupLabel = isColor
          ? colorLabel
          : isSizeLike
            ? sizeLabel
            : typeName;

        const valueImages = vt.displayedVariantValues.map((dvv) =>
          findImageForValue(product, dvv.variantValue),
        );
        const anyValueHasImage = valueImages.some((img) => img != null);
        const useImageMode = showVariantImage && anyValueHasImage && vtIndex === 0;

        const selectedValue = vt.displayedVariantValues.find((dvv) => dvv.isSelected);
        const selectedName = selectedValue?.variantValue.name ?? "";
        const showSelectedLine = (isColor || useImageMode) && !!selectedName;

        const groupModifier = useImageMode
          ? " pdp-variant-group--image"
          : isColor
            ? " pdp-variant-group--color"
            : " pdp-variant-group--choice";

        return (
          <div key={variantType.id} class={`pdp-variant-group${groupModifier}`}>
            <div class="pdp-variant-header">
              <span class="pdp-variant-label">{groupLabel}</span>
              {showSelectedLine && (
                <span class="pdp-variant-selected">
                  <span class="pdp-variant-selected-prefix">{selectedLabel}</span>{" "}
                  <span class="pdp-variant-selected-value">{selectedName}</span>
                </span>
              )}
            </div>

            <div class="pdp-variant-options" role="group" aria-label={typeName}>
              {vt.displayedVariantValues.map((dvv, i) => {
                const value = dvv.variantValue;
                const disabled = !dvv.hasStock;
                const selected = dvv.isSelected;

                if (useImageMode) {
                  const img = valueImages[i];
                  return (
                    <button
                      key={value.id}
                      type="button"
                      class={`pdp-variant-image${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                      onClick={() => !disabled && selectVariantValue(product, value)}
                      aria-label={value.name}
                      aria-pressed={selected}
                      aria-disabled={disabled}
                      disabled={disabled}
                      title={value.name}
                    >
                      {img ? (
                        <img
                          class="pdp-variant-image-img"
                          src={getThumbnailSrc(img)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : isColor && value.colorCode ? (
                        <span
                          class="pdp-variant-image-fallback pdp-variant-image-fallback--color"
                          style={{ background: value.colorCode }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span class="pdp-variant-image-fallback pdp-variant-image-fallback--text">
                          {value.name}
                        </span>
                      )}
                    </button>
                  );
                }

                if (isColor) {
                  const swatchColor = value.colorCode || "var(--color-surface-alt)";
                  return (
                    <button
                      key={value.id}
                      type="button"
                      class={`pdp-swatch${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                      style={{ background: swatchColor }}
                      onClick={() => !disabled && selectVariantValue(product, value)}
                      aria-label={value.name}
                      aria-pressed={selected}
                      aria-disabled={disabled}
                      disabled={disabled}
                      title={value.name}
                    />
                  );
                }

                return (
                  <button
                    key={value.id}
                    type="button"
                    class={`pdp-option${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                    onClick={() => !disabled && selectVariantValue(product, value)}
                    aria-pressed={selected}
                    aria-disabled={disabled}
                    disabled={disabled}
                  >
                    {value.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ProductVariants;

import {
  IkasProduct,
  IkasVariantValue,
  getIkasVariantValueThumbnailImage,
  isIkasVariantTypeColorSelection,
  selectVariantValue,
  getDisplayedProductVariantTypes,
  getProductVariantMainImage,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { BadgeImage, BadgeColor, BadgeText } from "../Badge";
import { cx } from "../../utils/cx";

interface Props {
  product: IkasProduct;
  size?: "xs" | "s" | "m" | "l";
  disableRoute?: boolean;
  scrollable?: boolean;
  showLabels?: boolean;
  useVariantImages?: boolean;
  onSelect?: () => void;
}

const VariantBadge = observer(function VariantBadge({
  product,
  size = "s",
  disableRoute,
  scrollable,
  showLabels,
  useVariantImages,
  onSelect,
}: Props) {
  const displayedVariantTypes = getDisplayedProductVariantTypes(product);
  if (displayedVariantTypes.length === 0) return null;

  function handleSelect(variantValue: IkasVariantValue) {
    selectVariantValue(product, variantValue, disableRoute);
    onSelect?.();
  }

  return (
    <div
      className={cx(
        "kombos-variant-badge__groups",
        size === "l" && "kombos-variant-badge__groups--l",
      )}
    >
      {displayedVariantTypes.map((dvt) => {
        const isColor = isIkasVariantTypeColorSelection(dvt.variantType);

        return (
          <div key={dvt.variantType.id} className="kombos-variant-badge__group">
            {showLabels && (
              <span className={cx("kombos-variant-badge__label", size === "xs" ? "text-xs-medium" : "text-sm-medium")}>
                {dvt.variantType.name}
              </span>
            )}
            <div
              className={cx(
                "kombos-variant-badge__row",
                scrollable && "kombos-variant-badge__row--scrollable",
                size === "l" && "kombos-variant-badge__row--l",
              )}
            >
              {dvt.displayedVariantValues.map((dvv) => {
                const isSelected = dvv.isSelected;
                const outOfStock = dvv.hasStock === false;
                const variantValue = dvv.variantValue;

                if (isColor) {
                  // Variant product image
                  if (useVariantImages) {
                    const variantImage = getProductVariantMainImage(
                      dvv.variant,
                    )?.image;

                    if (variantImage) {
                      return (
                        <BadgeImage
                          key={variantValue.id}
                          image={variantImage}
                          alt={variantValue.name}
                          sizes="64px"
                          variantImg
                          size={size}
                          selected={isSelected}
                          outOfStock={outOfStock}
                          onClick={() => handleSelect(variantValue)}
                          aria-label={variantValue.name}
                        />
                      );
                    }
                  }

                  // Thumbnail image
                  const thumbImage =
                    getIkasVariantValueThumbnailImage(variantValue);

                  if (thumbImage) {
                    return (
                      <BadgeImage
                        key={variantValue.id}
                        image={thumbImage}
                        alt={variantValue.name}
                        sizes="(max-width: 1024px) 100vw, 100px"
                        size={size}
                        selected={isSelected}
                        outOfStock={outOfStock}
                        onClick={() => handleSelect(variantValue)}
                        aria-label={variantValue.name}
                      />
                    );
                  }

                  // Color swatch
                  const colorCode = variantValue.colorCode;
                  if (colorCode) {
                    return (
                      <BadgeColor
                        key={variantValue.id}
                        colorCode={colorCode}
                        size={size}
                        selected={isSelected}
                        outOfStock={outOfStock}
                        onClick={() => handleSelect(variantValue)}
                        aria-label={variantValue.name}
                      />
                    );
                  }
                }

                // Text badge (fallback)
                return (
                  <BadgeText
                    key={variantValue.id}
                    size={size}
                    selected={isSelected}
                    outOfStock={outOfStock}
                    onClick={() => handleSelect(variantValue)}
                  >
                    {variantValue.name}
                  </BadgeText>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default VariantBadge;

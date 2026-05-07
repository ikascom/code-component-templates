import {
  IkasProductOption,
  IkasProductOptionSelectValue,
  getProductOptionFormattedPrice,
} from "@ikas/bp-storefront";

export function getSelectValuePrice(
  parentOption: IkasProductOption,
  val: IkasProductOptionSelectValue,
): string {
  if (val.price == null) return "";

  return getProductOptionFormattedPrice({
    ...parentOption,
    price: val.price,
    priceType: val.priceType,
    otherPrices: val.otherPrices,
  });
}

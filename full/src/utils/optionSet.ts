import {
  IkasProductOptionSet,
  hasValidProductOptionSetValues,
} from "@ikas/bp-storefront";
import { showToast } from "./toast";

export function validateOptionSet(
  optionSet: IkasProductOptionSet | undefined | null,
  errorMessage: string
): boolean {
  if (optionSet && !hasValidProductOptionSetValues(optionSet)) {
    window.dispatchEvent(new CustomEvent("ikas:show-option-errors"));
    showToast(errorMessage, "error");
    return false;
  }
  return true;
}

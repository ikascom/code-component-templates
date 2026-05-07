import { Props } from "./types";
import VariantBadge from "../../sub-components/VariantBadge";

export function CardProductVariants({ product }: Props) {
  if (!product) return null;

  return <VariantBadge product={product} size="s" scrollable disableRoute />;
}

export default CardProductVariants;

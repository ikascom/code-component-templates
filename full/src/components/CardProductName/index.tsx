import { getProductHref } from "@ikas/bp-storefront";
import { cx } from "../../utils/cx";
import { Props } from "./types";

export function CardProductName({ product, singleLineName }: Props) {
  if (!product) return null;

  const productHref = getProductHref(product);

  return (
    <span className="kombos-card-product-name">
      <a
        href={productHref}
        className={cx(
          "kombos-card-product-name__link text-sm-medium md:text-md-medium",
          singleLineName && "kombos-card-product-name__link--single-line",
        )}
      >
        {product.name}
      </a>
    </span>
  );
}

export default CardProductName;

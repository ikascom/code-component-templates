import {
  getIkasCategoryPathItemHref,
  getProductCategoryPath,
  getProductVariantMainImage,
  getSelectedProductVariant,
  IkasImage,
  isNotEmpty,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import Breadcrumb from "../../sub-components/Breadcrumb";
import type { BreadcrumbItem } from "../../sub-components/Breadcrumb";
import ProductGallery from "./components/ProductGallery";

export function ProductDetail(props: Props) {
  const {
    product,
    components,
    aspectRatio,
    objectFit,
    bottomComponents,
    homepageText = "Home",
  } = props;
  if (!product) return null;

  const selectedVariant = getSelectedProductVariant(product);
  const mainProductImage = getProductVariantMainImage(selectedVariant);
  const mainImage = mainProductImage?.image;
  const variantImages = selectedVariant?.images;
  const images: IkasImage[] = variantImages?.length
    ? variantImages
        .map((pi: any) => pi.image)
        .filter((img: any): img is IkasImage => img != null)
    : mainImage
      ? [mainImage]
      : [];

  const categoryPath = getProductCategoryPath(product);

  return (
    <section className="kombos-pd">
      <div className="kombos-container kombos-pd__container">
        <Breadcrumb
          items={[
            { label: homepageText, href: "/" } as BreadcrumbItem,
            ...(isNotEmpty(categoryPath)
              ? categoryPath.map(
                  (pathItem: any) =>
                    ({
                      label: pathItem.name,
                      href: getIkasCategoryPathItemHref(pathItem),
                    }) as BreadcrumbItem,
                )
              : []),
            { label: product.name } as BreadcrumbItem,
          ]}
          size="xs"
          className="kombos-pd__breadcrumb"
        />

        <div className="kombos-pd__layout">
          <ProductGallery
            images={images}
            productName={product.name}
            aspectRatio={aspectRatio}
            objectFit={objectFit}
          />

          <div className="kombos-pd__info">
            <IkasComponentRenderer
              id="product-detail-info"
              components={components}
              parentProps={props}
            />
          </div>
        </div>

        {bottomComponents && (
          <div className="kombos-pd__bottom">
            <IkasComponentRenderer
              id="product-detail-bottom"
              components={bottomComponents}
              parentProps={props}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetail;

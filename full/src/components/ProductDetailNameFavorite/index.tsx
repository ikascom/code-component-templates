import {
  addIkasProductToFavorites,
  customerStore,
  getFormattedMarginTopSize,
  getFormattedMarginBottomSize,
  hasCustomer,
  isFavoriteIkasProduct,
  removeIkasProductFromFavorites,
  Router,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import { Heart2SVG, HeartFilledSVG } from "../../sub-components/icons";

export function ProductDetailNameFavorite({
  product,
  mobileMarginTop,
  mobileMarginBottom,
  desktopMarginTop,
  desktopMarginBottom,
  hideFavoriteButton,
}: Props) {
  if (!product) return null;

  const isFavorite = isFavoriteIkasProduct(product);

  const handleToggleFavorite = async () => {
    const isLoggedIn = hasCustomer(customerStore);

    if (!isLoggedIn) {
      Router.navigateToPage("LOGIN");
      return;
    }

    if (isFavorite) {
      await removeIkasProductFromFavorites(product);
    } else {
      await addIkasProductToFavorites(product);
    }
  };

  return (
    <div
      className="kombos-pd-name__row"
      style={{
        "--mobile-mt": getFormattedMarginTopSize(mobileMarginTop),
        "--mobile-mb": getFormattedMarginBottomSize(mobileMarginBottom),
        "--desktop-mt": getFormattedMarginTopSize(desktopMarginTop),
        "--desktop-mb": getFormattedMarginBottomSize(desktopMarginBottom),
      }}
    >
      <h1 className="kombos-pd-name__title text-xl-medium lg:display-xs-medium">{product.name}</h1>
      {!hideFavoriteButton && (
        <button
          type="button"
          className="kombos-pd-name__fav-btn"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <HeartFilledSVG /> : <Heart2SVG />}
        </button>
      )}
    </div>
  );
}

export default ProductDetailNameFavorite;

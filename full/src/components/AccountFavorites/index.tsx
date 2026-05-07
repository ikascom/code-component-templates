import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getFavoriteProducts,
  IkasProduct,
  getProductOptionSet,
  IkasComponentRenderer,
} from "@ikas/bp-storefront";
import ProductCard from "../../sub-components/ProductCard";
import PageLoader from "../../sub-components/PageLoader";
import { Props } from "./types";

export function AccountFavorites(props: Props) {
  const {
    favoritesLabel = "My Favorites",
    emptyFavoritesText = "You haven't added any favorites yet.",
    addToCartText = "Add to Cart",
    components,
  } = props;
  const [favorites, setFavorites] = useState<IkasProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoriteProducts(customerStore).then((products) => {
      const items = products ?? [];
      items.forEach((p) => getProductOptionSet(p));
      setFavorites(items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="kombos-account-favorites">
      <h1 className="kombos-account-favorites__title text-md-medium">
        {favoritesLabel}
      </h1>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          {favorites.length === 0 && (
            <p className="kombos-account-favorites__empty text-sm-regular">
              {emptyFavoritesText}
            </p>
          )}

          {favorites.length > 0 && (
            <div className="kombos-account-favorites__grid">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="kombos-account-favorites__card"
                >
                  <ProductCard
                    product={product}
                    addToCartText={addToCartText}
                    sizes="(max-width: 767px) calc(50vw - 36px), (max-width: 1023px) calc(33.3vw - 32px), calc(33.3vw - 48px)"
                    onFavoriteRemove={() =>
                      setFavorites((prev) =>
                        prev.filter((f) => f.id !== product.id),
                      )
                    }
                  />
                  <IkasComponentRenderer
                    id={`account-favorites-product-${product.id}`}
                    components={components}
                    parentProps={props}
                    map={{ product }}
                    className="kombos-account-favorites__card-content"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AccountFavorites;

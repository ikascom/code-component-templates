import { useState, useEffect, useMemo } from "preact/hooks";
import {
  getSelectedProductVariant,
  getBundleProductsOfVariant,
  initBundleProducts,
  hasBundleSettings,
  IkasBundleProduct,
  IkasProduct,
  cartStore,
  waitForCartStoreInit,
} from "@ikas/bp-storefront";
import { runInAction } from "mobx";
import { adjustBundleProductQuantity } from "../utils/bundle";

function adjustBundleQuantities(products: IkasBundleProduct[]) {
  runInAction(() => {
    for (const bp of products) {
      adjustBundleProductQuantity(bp);
    }
  });
}

export function useBundleProducts(product: IkasProduct | null | undefined) {
  const [isLoading, setIsLoading] = useState(true);

  const editLineID =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("editLineID")
      : null;

  const selectedVariant = product ? getSelectedProductVariant(product) : null;

  const hasBundle = selectedVariant
    ? hasBundleSettings(selectedVariant)
    : false;

  const bundleSettings = hasBundle ? selectedVariant!.bundleSettings : null;

  useEffect(() => {
    if (!product || !selectedVariant || !bundleSettings) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);

      try {
        if (editLineID) await waitForCartStoreInit(cartStore);

        await getBundleProductsOfVariant(product!, selectedVariant!);
        await initBundleProducts(product!);

        if (!cancelled && bundleSettings) {
          adjustBundleQuantities(bundleSettings.products);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedVariant, editLineID]);

  const sortedProducts = useMemo(() => {
    if (!bundleSettings) return [];

    return [...bundleSettings.products].sort((a, b) => a.order - b.order);
  }, [bundleSettings?.products]);

  return { isLoading, selectedVariant, bundleSettings, sortedProducts };
}

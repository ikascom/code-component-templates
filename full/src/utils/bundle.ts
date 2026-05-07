import {
  getSelectedProductVariant,
  hasProductVariantStock,
  setBundleProductQuantity,
  IkasBundleProduct,
  IkasBundleSettings,
} from "@ikas/bp-storefront";

export function adjustBundleProductQuantity(bp: IkasBundleProduct): void {
  if (!bp.product) return;

  const variant = getSelectedProductVariant(bp.product);

  const stock = variant.stock ?? 0;
  const inStock = hasProductVariantStock(variant);

  if (bp.minQuantity === 0 && !inStock) {
    setBundleProductQuantity(bp, 0);
    return;
  }

  if (stock < 10 && bp.quantity > stock && !variant.sellIfOutOfStock) {
    setBundleProductQuantity(bp, Math.max(stock, bp.minQuantity ?? 0));
  }
}

export function isBundleOutOfStock(
  bundleSettings: IkasBundleSettings,
): boolean {
  const { products, minBundleQuantity, maxBundleQuantity } = bundleSettings;

  // Skip check while bundle product data is still loading
  const loaded = products.some((bp) => !!bp.product);
  if (!loaded) return false;

  // A required bundle product (minQuantity !== 0) is out of stock
  const hasRequiredOutOfStock = products.some((bp) => {
    if (!bp.product) return false;

    const variant = getSelectedProductVariant(bp.product);
    const bpHasStock = variant ? hasProductVariantStock(variant) : false;

    return !bpHasStock && bp.minQuantity !== 0;
  });
  if (hasRequiredOutOfStock) return true;

  // All bundle products have zero quantity
  const allZeroQuantity = products.every((p) => p.quantity === 0);
  if (allZeroQuantity) return true;

  // Total quantity violates bundle-level min/max constraints
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  if (minBundleQuantity != null && totalQuantity < minBundleQuantity)
    return true;
  if (maxBundleQuantity != null && totalQuantity > maxBundleQuantity)
    return true;

  // Individual bundle product min/max quantity violations
  const hasMinQuantityError = products.some(
    (bp) => bp.minQuantity != null && bp.quantity < bp.minQuantity,
  );
  if (hasMinQuantityError) return true;

  const hasMaxQuantityError = products.some(
    (bp) => bp.maxQuantity != null && bp.quantity > bp.maxQuantity!,
  );
  if (hasMaxQuantityError) return true;

  return false;
}

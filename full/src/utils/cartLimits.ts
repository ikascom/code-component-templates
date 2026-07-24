import { IkasProduct, IkasStorefrontConfig } from "@ikas/bp-storefront";

export interface CartQuantityLimits {
  min: number;
  max?: number;
}

/**
 * Resolve the per-cart quantity limits for a product from its active sales
 * channel. Falls back to a minimum of 1 and no maximum when the channel or its
 * limits are not set. `addItemToCart` clamps to the same limits internally, so
 * applying these in the stepper keeps the UI honest instead of letting the
 * quantity snap silently.
 */
export function getProductCartLimits(product: IkasProduct): CartQuantityLimits {
  const channel = product.salesChannels?.find(
    (sc) => sc.id === IkasStorefrontConfig.salesChannelId,
  );
  return {
    min: channel?.minQuantityPerCart ?? 1,
    max: channel?.maxQuantityPerCart ?? undefined,
  };
}

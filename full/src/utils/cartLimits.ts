import { IkasProduct, IkasStorefrontConfig } from "@ikas/bp-storefront";

export interface CartQuantityLimits {
  min: number;
  max?: number;
}

/**
 * Resolve the per-cart quantity limits for a product from its active sales
 * channel. Falls back to a minimum of 1 and no maximum when the channel or its
 * limits are not set. `addItemToCart` clamps to the same limits internally only
 * when it creates a NEW cart line — incrementing an existing line goes through
 * `changeItemQuantity`, which never clamps — so enforcing these in the stepper
 * is the only guard that covers both paths.
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

import { useEffect, useState } from "preact/hooks";
import { baseStore, bs_searchProductsById } from "@ikas/bp-storefront";
import { CartQuantityLimits, getProductCartLimits } from "./cartLimits";

/**
 * Per-cart quantity limits for cart lines.
 *
 * A cart line's `IkasOrderLineVariant` carries no `salesChannels`, so the
 * min/max per-cart limits can only be read from the full `IkasProduct`. This
 * store batch-fetches the line products with `bs_searchProductsById` (lines
 * register their productId one by one; the ids are flushed as ONE request on
 * the next tick) and maps the resolved limits by product id for the cart
 * steppers to read. Each product is fetched at most once; results stay cached
 * for the session.
 */

const limitsByProductId = new Map<string, CartQuantityLimits>();
const requestedProductIds = new Set<string>();
const listeners = new Set<() => void>();

let pendingProductIds: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

async function flush() {
  flushTimer = null;
  const batch = pendingProductIds;
  pendingProductIds = [];

  // bs_searchProductsById never throws — API/network failures resolve with
  // isSuccess: false — so the retry unmark must live on the result check.
  const result = await bs_searchProductsById(baseStore, { productIds: batch }).catch(
    () => null,
  );
  if (!result?.isSuccess || !result.products) {
    // Limits stay unenforced for now; unmark the batch so a later
    // ensureCartLineLimits call (e.g. the next cart open) can retry.
    for (const id of batch) requestedProductIds.delete(id);
    return;
  }

  for (const product of result.products) {
    limitsByProductId.set(product.id, getProductCartLimits(product));
  }
  emit();
}

/**
 * Register a cart line's productId for limit resolution. Ids already requested
 * are skipped; new ids are collected and fetched in a single batched request
 * on the next tick, so per-line calls do not fan out into per-line requests.
 */
export function ensureCartLineLimits(productId: string) {
  if (requestedProductIds.has(productId)) return;
  requestedProductIds.add(productId);
  pendingProductIds.push(productId);
  if (!flushTimer) flushTimer = setTimeout(flush, 0);
}

/** Resolved limits for a product — undefined until the batch fetch lands. */
export function getCartLineLimits(
  productId: string | null | undefined,
): CartQuantityLimits | undefined {
  return productId ? limitsByProductId.get(productId) : undefined;
}

/** Subscribe to limit resolutions; returns the unsubscribe function. */
export function subscribeCartLineLimits(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Hook: resolved limits for one cart line's product — undefined until the
 * batched fetch lands. Encapsulates the subscription protocol so components
 * cannot get the ordering wrong.
 */
export function useCartLineLimits(
  productId: string | null | undefined,
): CartQuantityLimits | undefined {
  const [, setVersion] = useState(0);
  const limits = getCartLineLimits(productId);
  useEffect(() => {
    if (!productId) return;
    // Subscribe BEFORE registering the id: a batch already in flight can
    // resolve between render and this effect, and its emit must not be missed.
    const unsubscribe = subscribeCartLineLimits(() => setVersion((v) => v + 1));
    ensureCartLineLimits(productId);
    // Re-check once for a result that landed before the subscription armed —
    // skipped when the arming render already saw it (no redundant re-render).
    if (!limits && getCartLineLimits(productId)) setVersion((v) => v + 1);
    return unsubscribe;
  }, [productId]);
  return limits;
}

import { observer } from "@ikas/component-utils";
import { useEffect, useState } from "preact/hooks";
import { TrashSVG, NoProductSVG } from "../icons";
import QuantitySelector from "../QuantitySelector";
import BundleProducts from "./components/BundleProducts";
import ItemOptions from "./components/ItemOptions";
import {
  getIkasOrderLineVariantMainImage,
  getIkasOrderLineVariantHref,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  getDefaultSrc,
  createMediaSrcset,
  changeItemQuantity,
  IkasOrderLineItem,
  getOrderLineItemFormattedOverridenPriceWithQuantity,
  hasOrderLineItemDiscount,
  getOrderLineItemOverridenPriceWithQuantity,
  cartStore,
  isOrderLineItemAutoCreated,
} from "@ikas/bp-storefront";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import { cx } from "../../utils/cx";
import {
  ensureCartLineLimits,
  getCartLineLimits,
  subscribeCartLineLimits,
} from "../../utils/cartLineLimits";
import type { AspectRatio, ObjectFit } from "../../global-types";

interface CartItemProps {
  item: IkasOrderLineItem;
  onRemove: (item: IkasOrderLineItem) => void;
  variant?: "sidebar" | "page";
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  giftLabel?: string;
}

const CartItem = observer(function CartItem({
  item,
  onRemove,
  variant = "sidebar",
  aspectRatio,
  objectFit,
  giftLabel = "Gift",
}: CartItemProps) {
  const isPage = variant === "page";

  // The line's IkasOrderLineVariant carries no salesChannels, so the per-cart
  // quantity limits come from a batched product fetch shared across all lines.
  const productId = item.variant?.productId ?? null;
  const [, setLimitsVersion] = useState(0);
  useEffect(() => {
    // Subscribe BEFORE registering the id: a batch already in flight can
    // resolve between render and this effect, and its emit must not be missed.
    const unsubscribe = subscribeCartLineLimits(() => setLimitsVersion((v) => v + 1));
    if (productId) {
      ensureCartLineLimits([productId]);
      // Re-check once for a result that landed before the subscription armed.
      if (getCartLineLimits(productId)) setLimitsVersion((v) => v + 1);
    }
    return unsubscribe;
  }, [productId]);
  const limits = getCartLineLimits(productId);

  // Lines a campaign added automatically (e.g. a "buy 1 get 1" gift) cannot be
  // edited or removed on their own, so render them read-only with a badge.
  const isAutoCreated =
    !!cartStore.cart && isOrderLineItemAutoCreated(cartStore.cart, item);
  const giftBadge = isAutoCreated ? (
    <span className="kombos-cart-item__gift-badge text-xs-medium">
      {giftLabel}
    </span>
  ) : null;
  const staticQuantity = (
    <span className="kombos-cart-item__qty-static text-sm-medium">
      ×{item.quantity}
    </span>
  );

  const mediaStyle: Record<string, string> = {
    aspectRatio: resolveAspectRatio(aspectRatio),
    objectFit: resolveObjectFit(objectFit),
  };
  const image = item.variant
    ? getIkasOrderLineVariantMainImage(item.variant)
    : null;
  const href = item.variant
    ? getIkasOrderLineVariantHref(item.variant)
    : undefined;
  const overridenPriceWithQuantity =
    getOrderLineItemOverridenPriceWithQuantity(item);
  const overridenFormattedPriceWithQuantity =
    getOrderLineItemFormattedOverridenPriceWithQuantity(item);

  const hasDiscount =
    hasOrderLineItemDiscount(item) || !!overridenPriceWithQuantity;
  const variantValues = item.variant?.variantValues ?? [];

  const rootClass = isPage
    ? "kombos-cart-item kombos-cart-item--page"
    : "kombos-cart-item";
  const nameClass = isPage
    ? "kombos-cart-item__name text-md-semibold"
    : "kombos-cart-item__name text-sm-regular";
  const imgSizes = isPage ? "(min-width: 768px) 100px, 80px" : "72px";

  return (
    <div className={rootClass}>
      <a href={href} className="kombos-cart-item__img-link">
        {image?.isVideo ? (
          <video
            src={getDefaultSrc(image)}
            className="kombos-cart-item__img"
            style={mediaStyle}
            muted
            loop
            autoPlay
            playsInline
          >
            <track kind="captions" />
          </video>
        ) : image ? (
          <img
            src={getDefaultSrc(image)}
            srcSet={createMediaSrcset(image)}
            sizes={imgSizes}
            alt={item.variant?.name || ""}
            className="kombos-cart-item__img"
            style={mediaStyle}
          />
        ) : (
          <div
            className="kombos-cart-item__img kombos-cart-item__img--placeholder"
            style={mediaStyle}
          >
            <NoProductSVG />
          </div>
        )}
      </a>
      <div className="kombos-cart-item__details">
        {isPage ? (
          <div className="kombos-cart-item__top">
            <div className="kombos-cart-item__info">
              <a href={href} className={nameClass}>
                {item.variant?.name}
              </a>
              {giftBadge}
              {variantValues.length > 0 && (
                <p className="kombos-cart-item__variant-text text-sm-regular">
                  {variantValues
                    .map(
                      (vv) => `${vv.variantTypeName}: ${vv.variantValueName}`,
                    )
                    .join(" / ")}
                </p>
              )}
            </div>
            {!isAutoCreated && (
              <button
                className="kombos-cart-item__remove"
                onClick={() => onRemove(item)}
                aria-label="Remove"
              >
                <TrashSVG />
              </button>
            )}
          </div>
        ) : (
          <>
            <a href={href} className={nameClass}>
              {item.variant?.name}
            </a>
            {giftBadge}

            {variantValues.length > 0 && (
              <div className="kombos-cart-item__variants">
                {variantValues.map((vv, idx) => (
                  <span
                    key={idx}
                    className="kombos-cart-item__variant text-xs-regular"
                  >
                    {`${vv.variantTypeName}: ${vv.variantValueName}`}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <ItemOptions item={item} />
        <BundleProducts
          item={item}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
        />

        {isPage ? (
          <div className="kombos-cart-item__bottom">
            {isAutoCreated ? (
              staticQuantity
            ) : (
              <QuantitySelector
                size="sm"
                value={item.quantity}
                min={limits?.min ?? 1}
                max={limits?.max}
                onChange={(qty) => changeItemQuantity(item, qty)}
              />
            )}
            <div className="kombos-cart-item__prices">
              {hasDiscount && (
                <span className="kombos-cart-item__original-price text-sm-regular-strike">
                  {overridenFormattedPriceWithQuantity}
                </span>
              )}
              <span
                className={cx(
                  "kombos-cart-item__price",
                  "text-md-semibold",
                  hasDiscount && "kombos-cart-item__price--discount",
                )}
              >
                {getOrderLineItemFormattedFinalPriceWithQuantity(item)}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="kombos-cart-item__price-row">
              <span
                className={cx(
                  "kombos-cart-item__price",
                  "text-sm-medium",
                  hasDiscount && "kombos-cart-item__price--discount",
                )}
              >
                {getOrderLineItemFormattedFinalPriceWithQuantity(item)}
              </span>
              {hasDiscount && (
                <span className="kombos-cart-item__original-price text-sm-regular-strike">
                  {overridenFormattedPriceWithQuantity}
                </span>
              )}
            </div>

            <div className="kombos-cart-item__actions">
              {isAutoCreated ? (
                staticQuantity
              ) : (
                <>
                  <QuantitySelector
                    size="sm"
                    value={item.quantity}
                    min={limits?.min ?? 1}
                    max={limits?.max}
                    onChange={(qty) => changeItemQuantity(item, qty)}
                  />
                  <button
                    className="kombos-cart-item__remove"
                    onClick={() => onRemove(item)}
                    aria-label="Remove"
                  >
                    <TrashSVG />
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default CartItem;

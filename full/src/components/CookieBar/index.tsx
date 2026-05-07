import { useState, useEffect } from "preact/hooks";
import {
  customerStore,
  getCustomerConsentGranted,
  handleCustomerConsentGrant,
  waitForCustomerStoreInit,
} from "@ikas/bp-storefront";
import { XSVG } from "../../sub-components/icons";
import { cx } from "../../utils/cx";
import { Props } from "./types";

export function CookieBar({
  cookieContent,
  buttonText,
  position = false,
  showCloseIcon = false,
  backgroundColor,
  textColor,
  buttonTextColor,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    waitForCustomerStoreInit(customerStore).then(() => setStoreReady(true));
  }, []);

  if (!storeReady) return null;

  const hasConsent = getCustomerConsentGranted(customerStore);
  if (hasConsent || dismissed) return null;

  const positionClass = position
    ? "kombos-cookie-bar--left"
    : "kombos-cookie-bar--right";

  const cssVars = {
    ...(backgroundColor && { "--cookie-bg-color": backgroundColor }),
    ...(textColor && { "--cookie-text-color": textColor }),
    ...(buttonTextColor && { "--cookie-button-text-color": buttonTextColor }),
  } as Record<string, string>;

  return (
    <div className={cx("kombos-cookie-bar", positionClass)} style={cssVars}>
      <div className="kombos-cookie-bar__wrapper">
        <div
          className={cx(
            "kombos-cookie-bar__top",
            !showCloseIcon && "kombos-cookie-bar__top--has-close",
          )}
        >
          <div
            className="kombos-cookie-bar__content text-sm-regular"
            dangerouslySetInnerHTML={{ __html: cookieContent || "" }}
          />

          {!showCloseIcon && (
            <button
              className="kombos-cookie-bar__close"
              onClick={() => setDismissed(true)}
              aria-label="Close"
            >
              <XSVG />
            </button>
          )}
        </div>
        <button
          className="kombos-cookie-bar__accept text-sm-semibold"
          onClick={() => handleCustomerConsentGrant(customerStore)}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default CookieBar;

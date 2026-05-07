import {
  cartStore,
  createPayWithIkasSession,
  IkasProduct,
} from "@ikas/bp-storefront";
import { useEffect, useMemo, useRef } from "preact/hooks";

interface UsePayWithIkasParams {
  product: IkasProduct;
  quantity: number;
  isEnabled: boolean;
  payWithIkasUrl: string;
}

export function usePayWithIkas({
  product,
  quantity,
  isEnabled,
  payWithIkasUrl,
}: UsePayWithIkasParams) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const quantityRef = useRef(quantity);
  quantityRef.current = quantity;

  const iframeReady = useRef(false);
  const isEnabledRef = useRef(isEnabled);
  isEnabledRef.current = isEnabled;

  const { iframeSrc, iframeHeight, targetOrigin } = useMemo(() => {
    const url = new URL(payWithIkasUrl);
    const height =
      url.searchParams.get("subtextOption") === "true" ? "90px" : "56px";
    url.searchParams.set("isAddToCartEnabled", isEnabled.toString());
    return {
      iframeSrc: url.toString(),
      iframeHeight: height,
      targetOrigin: url.origin,
    };
  }, [payWithIkasUrl, isEnabled]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let isProcessing = false;

    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "ikas-widget-ready") {
        if (iframe.contentWindow !== event.source) return;

        iframeReady.current = true;
        iframe.contentWindow!.postMessage(
          {
            type: "ikas-buy-enabled-state-change",
            isAddToCartEnabled: isEnabledRef.current,
          },
          targetOrigin,
        );
        return;
      }

      if (event.data.type === "ikas-buy-click") {
        if (iframe.contentWindow !== event.source) return;
        if (isProcessing) return;

        isProcessing = true;
        try {
          const result = await createPayWithIkasSession(
            cartStore,
            product,
            quantityRef.current,
          );

          iframe.contentWindow?.postMessage(
            { type: "ikas-buy-loading-stop" },
            targetOrigin,
          );

          if (!result.success || !result.payUrl) {
            console.error("Pay with ikas error:", result.error);
            return;
          }

          window.location.href = result.payUrl;
        } catch (error) {
          console.error("Pay with ikas error:", error);
        } finally {
          isProcessing = false;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      iframeReady.current = false;
      window.removeEventListener("message", handleMessage);
    };
  }, [product, targetOrigin]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframeReady.current || !iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      {
        type: "ikas-buy-enabled-state-change",
        isAddToCartEnabled: isEnabled,
      },
      targetOrigin,
    );
  }, [isEnabled, targetOrigin]);

  return { iframeRef, iframeSrc, iframeHeight };
}

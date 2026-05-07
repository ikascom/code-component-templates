import { useEffect } from "preact/hooks";
import { RefObject } from "preact";

export function useScrollLock(
  enabled: boolean = true,
  skipCleanupRef?: RefObject<boolean>,
) {
  useEffect(() => {
    if (!enabled) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";

    return () => {
      if (skipCleanupRef?.current) return;
      document.body.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, [enabled]);
}

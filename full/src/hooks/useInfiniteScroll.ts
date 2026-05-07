import { useEffect, useRef } from "preact/hooks";
import {
  hasProductListNextPage,
  getProductListNextPage,
  IkasProductList,
} from "@ikas/bp-storefront";

interface Options {
  isEnabled: boolean;
  productList: IkasProductList | null | undefined;
}

export function useInfiniteScroll({ isEnabled, productList }: Options) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    if (!isEnabled || !sentinelRef.current || !productList) return;

    const sentinel = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasProductListNextPage(productList) &&
          !isLoadingMoreRef.current
        ) {
          isLoadingMoreRef.current = true;
          getProductListNextPage(productList).finally(() => {
            isLoadingMoreRef.current = false;
            setTimeout(() => {
              if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
                observer.observe(sentinelRef.current);
              }
            }, 200);
          });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isEnabled, productList]);

  return { sentinelRef };
}

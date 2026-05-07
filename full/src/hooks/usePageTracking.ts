import { useEffect, useRef } from "preact/hooks";
import {
  setProductListVisiblePage,
  IkasProductList,
} from "@ikas/bp-storefront";

interface Options {
  isEnabled: boolean;
  productList: IkasProductList | null | undefined;
  productCount: number;
}

export function usePageTracking({
  isEnabled,
  productList,
  productCount,
}: Options) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEnabled || !gridRef.current || !productList) return;

    const markers =
      gridRef.current.querySelectorAll<HTMLElement>("[data-page]");
    if (markers.length === 0) return;

    const visiblePages = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number((entry.target as HTMLElement).dataset.page);
          if (entry.isIntersecting) {
            visiblePages.add(page);
          } else {
            visiblePages.delete(page);
          }
        }

        if (visiblePages.size > 0) {
          const currentPage = Math.min(...visiblePages);

          if (currentPage !== productList.infiniteScrollPage) {
            setProductListVisiblePage(productList, currentPage);
          }
        }
      },
      { rootMargin: "0px 0px -50% 0px" },
    );

    markers.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, [isEnabled, productList, productCount]);

  return { gridRef };
}

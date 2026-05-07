import { useCallback, useEffect, useState } from "preact/hooks";

const COLUMNS_STORAGE_KEY = "kombos-product-list-columns";

export function useColumnPreference() {
  const [columns, setColumns] = useState<3 | 4>(4);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
      if (stored === "3") setColumns(3);
    } catch {}
  }, []);

  const toggleColumns = useCallback(() => {
    setColumns((prev) => {
      const next = prev === 4 ? 3 : 4;
      try {
        localStorage.setItem(COLUMNS_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  return { columns, toggleColumns };
}

import { useCallback, useMemo } from "react";
import { useUi } from "../context/UiContext";
import { pickLocalized, ui } from "./translations";

export { pickLocalized, ui, LOCALES, STORAGE_KEY } from "./translations";

export function useLocale() {
  const { locale, setLocale } = useUi();
  return { locale, setLocale };
}

export function useT() {
  const { locale } = useUi();

  const dict = ui[locale] || ui.en;

  const t = useCallback(
    (key) => {
      const parts = key.split(".");
      let node = dict;
      for (const part of parts) {
        if (node == null) return key;
        node = node[part];
      }
      return typeof node === "string" ? node : key;
    },
    [dict],
  );

  const categoryLabel = useCallback(
    (category) => dict.categories?.[category] || category,
    [dict],
  );

  const navLabel = useCallback(
    (id, fallback) => dict.nav?.[id] || fallback || id,
    [dict],
  );

  const L = useCallback((obj, key) => pickLocalized(obj, key, locale), [locale]);

  return useMemo(() => ({ t, L, categoryLabel, navLabel, locale }), [t, L, categoryLabel, navLabel, locale]);
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "../i18n/translations";

const UiContext = createContext(null);

function readStoredLocale() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "sv" || value === "en") return value;
  } catch {
    /* ignore */
  }
  return "en";
}

export function UiProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [locale, setLocaleState] = useState(() => (typeof window === "undefined" ? "en" : readStoredLocale()));

  const setLocale = useCallback((next) => {
    const code = next === "sv" ? "sv" : "en";
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const value = useMemo(
    () => ({
      searchOpen,
      setSearchOpen,
      openSearch,
      closeSearch,
      menuQuery,
      setMenuQuery,
      highlightId,
      setHighlightId,
      locale,
      setLocale,
    }),
    [searchOpen, openSearch, closeSearch, menuQuery, highlightId, locale, setLocale],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);

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
    }),
    [searchOpen, openSearch, closeSearch, menuQuery, highlightId],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}

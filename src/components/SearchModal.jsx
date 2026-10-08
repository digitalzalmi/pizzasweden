import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useUi } from "../context/UiContext";
import { useContent } from "../context/ContentContext";
import { useT } from "../i18n";
import { formatPrice } from "../utils/format";

export default function SearchModal() {
  const { menu } = useContent();
  const { setSearchOpen, setMenuQuery, setHighlightId } = useUi();
  const { t, L, categoryLabel } = useT();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter((dish) => {
      if (!q) return dish.available;
      const ingredients = dish.ingredients || [];
      const name = String(L(dish, "name") || dish.name || "").toLowerCase();
      const description = String(L(dish, "description") || "").toLowerCase();
      return (
        name.includes(q) ||
        description.includes(q) ||
        dish.category.toLowerCase().includes(q) ||
        categoryLabel(dish.category).toLowerCase().includes(q) ||
        ingredients.some((item) => item.toLowerCase().includes(q))
      );
    });
  }, [query, menu, L, categoryLabel]);

  function choose(dish) {
    setMenuQuery(L(dish, "name") || dish.name);
    setHighlightId(dish.id);
    setSearchOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    requestAnimationFrame(() => {
      document.getElementById(`menu-${dish.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/70 px-3 pt-[max(5.5rem,env(safe-area-inset-top)+4rem)] sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("closeSearch")}
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-paper p-5 shadow-2xl">
        <h2 id="search-title" className="sr-only">
          {t("searchTitle")}
        </h2>
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <FiSearch className="text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-base outline-none"
            onChange={(event) => {
              setQuery(event.target.value);
              setMenuQuery(event.target.value);
            }}
            aria-label={t("searchTitle")}
          />
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
            aria-label={t("closeSearch")}
            onClick={() => setSearchOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <ul className="mt-3 max-h-[50vh] overflow-auto">
          {results.map((dish) => (
            <li key={dish.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-cream"
                onClick={() => choose(dish)}
              >
                <img src={dish.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1">
                  <span className="block font-semibold text-ink">{L(dish, "name")}</span>
                  <span className="text-sm text-muted">{categoryLabel(dish.category)}</span>
                </span>
                <span className="text-sm font-semibold text-ink">{formatPrice(dish.price)}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-muted">{t("searchEmpty")}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

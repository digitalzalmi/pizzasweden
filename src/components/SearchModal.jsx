import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useUi } from "../context/UiContext";
import { useContent } from "../context/ContentContext";
import { formatPrice } from "../utils/format";

export default function SearchModal() {
  const { menu } = useContent();
  const { setSearchOpen, setMenuQuery, setHighlightId } = useUi();
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
    return menu.filter((pizza) => {
      if (!q) return pizza.available;
      return (
        pizza.name.toLowerCase().includes(q) ||
        pizza.category.toLowerCase().includes(q) ||
        pizza.ingredients.some((item) => item.toLowerCase().includes(q))
      );
    });
  }, [query]);

  function choose(pizza) {
    setMenuQuery(pizza.name);
    setHighlightId(pizza.id);
    setSearchOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
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
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-paper p-5 shadow-2xl">
        <h2 id="search-title" className="sr-only">
          Search the menu
        </h2>
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <FiSearch className="text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Search pizzas, toppings, categories…"
            className="w-full bg-transparent text-base outline-none"
            onChange={(event) => {
              setQuery(event.target.value);
              setMenuQuery(event.target.value);
            }}
            aria-label="Search pizzas"
          />
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <ul className="mt-3 max-h-[50vh] overflow-auto">
          {results.map((pizza) => (
            <li key={pizza.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-cream"
                onClick={() => choose(pizza)}
              >
                <img src={pizza.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1">
                  <span className="block font-semibold text-ink">{pizza.name}</span>
                  <span className="text-sm text-muted">{pizza.category}</span>
                </span>
                <span className="text-sm font-semibold text-ink">{formatPrice(pizza.price)}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-muted">No pizzas match that search.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

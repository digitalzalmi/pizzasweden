import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useContent } from "../context/ContentContext";
import PizzaCard from "./PizzaCard";
import SectionReveal from "./SectionReveal";

export default function Menu() {
  const { menu, menuCategories } = useContent();
  const { menuQuery, setMenuQuery, highlightId, setHighlightId } = useCart();
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (highlightId) setCategory("All");
  }, [highlightId]);

  const pizzas = useMemo(() => {
    const q = menuQuery.trim().toLowerCase();
    return menu.filter((pizza) => {
      const categoryMatch = category === "All" || pizza.category === category;
      const searchMatch =
        !q ||
        pizza.name.toLowerCase().includes(q) ||
        pizza.category.toLowerCase().includes(q) ||
        pizza.ingredients.some((item) => item.toLowerCase().includes(q));
      return categoryMatch && searchMatch;
    });
  }, [category, menuQuery]);

  return (
    <SectionReveal id="menu" className="scroll-mt-24 bg-cream py-14 sm:py-20" aria-labelledby="menu-heading">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-tomato uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">Wood-fired list</p>
          <h2 id="menu-heading" className="font-display mt-3 text-[clamp(1.85rem,8vw,4rem)] text-ink">
            OUR FAVORITE PIZZAS
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Built on rested dough and a blistering oven. Filter by style, pick a size, and add it to your order — prices shown in Pakistani Rupees.
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="Pizza categories">
          {menuCategories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                category === item
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-paper text-warm hover:border-ink"
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {menuQuery && (
          <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            Showing results for “{menuQuery}”
            <button
              type="button"
              className="font-semibold text-ink underline decoration-gold underline-offset-4"
              onClick={() => {
                setMenuQuery("");
                setHighlightId(null);
              }}
            >
              Clear search
            </button>
          </p>
        )}

        <div className="menu-grid mt-8">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} highlighted={highlightId === pizza.id} />
          ))}
        </div>

        {pizzas.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-paper px-6 py-12 text-center text-muted">
            Nothing in this category matches the current search. Try another filter.
          </p>
        )}
      </div>
    </SectionReveal>
  );
}

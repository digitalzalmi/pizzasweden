import { useEffect, useMemo, useState } from "react";
import { useUi } from "../context/UiContext";
import { useContent } from "../context/ContentContext";
import { useT } from "../i18n";
import PizzaCard from "./PizzaCard";
import SectionReveal from "./SectionReveal";

export default function Menu() {
  const { menu, menuCategories } = useContent();
  const { menuQuery, setMenuQuery, highlightId, setHighlightId, locale } = useUi();
  const { t, categoryLabel, L } = useT();
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (highlightId) setCategory("All");
  }, [highlightId]);

  const items = useMemo(() => {
    const q = menuQuery.trim().toLowerCase();
    return menu.filter((dish) => {
      const categoryMatch = category === "All" || dish.category === category;
      const name = String(L(dish, "name") || dish.name || "").toLowerCase();
      const description = String(L(dish, "description") || dish.description || "").toLowerCase();
      const ingredients = dish.ingredients || [];
      const searchMatch =
        !q ||
        name.includes(q) ||
        description.includes(q) ||
        dish.category.toLowerCase().includes(q) ||
        categoryLabel(dish.category).toLowerCase().includes(q) ||
        ingredients.some((item) => item.toLowerCase().includes(q));
      return categoryMatch && searchMatch;
    });
  }, [category, menuQuery, menu, L, categoryLabel]);

  return (
    <SectionReveal id="menu" className="scroll-mt-20 bg-cream py-10 sm:py-14" aria-labelledby="menu-heading">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="text-[0.6rem] font-bold tracking-[0.2em] text-tomato uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">{t("menuEyebrow")}</p>
          <h2 id="menu-heading" className="font-display mt-2 text-[clamp(1.55rem,5.5vw,2.75rem)] text-ink">
            {t("menuHeading")}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">{t("menuIntro")}</p>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label={t("menuCategoriesAria")}>
          {menuCategories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                category === item
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-paper text-warm hover:border-ink"
              }`}
              onClick={() => setCategory(item)}
            >
              {categoryLabel(item)}
            </button>
          ))}
        </div>

        {menuQuery && (
          <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            {t("showingResults")} “{menuQuery}”
            <button
              type="button"
              className="font-semibold text-ink underline decoration-gold underline-offset-4"
              onClick={() => {
                setMenuQuery("");
                setHighlightId(null);
              }}
            >
              {t("clearSearch")}
            </button>
          </p>
        )}

        <div className="menu-grid mt-6" key={locale}>
          {items.map((dish) => (
            <PizzaCard key={dish.id} item={dish} highlighted={highlightId === dish.id} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-paper px-6 py-12 text-center text-muted">
            {t("menuEmpty")}
          </p>
        )}
      </div>
    </SectionReveal>
  );
}

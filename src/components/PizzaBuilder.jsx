import { useMemo, useState } from "react";
import { useContent } from "../context/ContentContext";
import { formatPrice } from "../utils/format";
import SectionReveal from "./SectionReveal";

const defaults = {
  size: "medium",
  crust: "classic",
  sauce: "tomato",
  cheese: "mozzarella",
  toppings: [],
};

function findOption(list, id) {
  return list.find((item) => item.id === id);
}

export default function PizzaBuilder() {
  const { builderOptions, images } = useContent();
  const [config, setConfig] = useState(defaults);

  const size = findOption(builderOptions.sizes, config.size);
  const crust = findOption(builderOptions.crusts, config.crust);
  const sauce = findOption(builderOptions.sauces, config.sauce);
  const cheese = findOption(builderOptions.cheeses, config.cheese);
  const toppings = builderOptions.toppings.filter((item) => config.toppings.includes(item.id));

  const lines = useMemo(() => {
    if (!size || !crust || !sauce || !cheese) return [];
    const rows = [
      { label: `Base pizza (${size.label})`, amount: size.price },
    ];
    if (crust.price) rows.push({ label: crust.label, amount: crust.price });
    if (sauce.price) rows.push({ label: sauce.label, amount: sauce.price });
    if (cheese.price) rows.push({ label: cheese.label, amount: cheese.price });
    toppings.forEach((topping) => rows.push({ label: topping.label, amount: topping.price }));
    return rows;
  }, [size, crust, sauce, cheese, toppings]);

  const total = lines.reduce((sum, row) => sum + row.amount, 0);

  function toggleTopping(id) {
    setConfig((current) => {
      const has = current.toppings.includes(id);
      return {
        ...current,
        toppings: has ? current.toppings.filter((item) => item !== id) : [...current.toppings, id],
      };
    });
  }

  function scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <SectionReveal id="builder" className="scroll-mt-24 bg-paper py-14 sm:py-20" variant="left" aria-labelledby="builder-heading">
      <div className="container-site grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div>
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-tomato uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">Kitchen counter</p>
          <h2 id="builder-heading" className="font-display mt-3 text-[clamp(1.85rem,8vw,3.6rem)] text-ink">
            BUILD YOUR PERFECT PIZZA
          </h2>
          <p className="mt-4 text-muted">
            Try combinations below — the ticket updates live. Call or visit us to place an order in person.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-[1.25rem] sm:mt-8 sm:rounded-[1.8rem]">
            <img
              src={images.builderPreview}
              alt="Custom pizza preview with melted cheese and mixed toppings"
              className="aspect-[5/4] max-h-64 w-full object-cover sm:max-h-none md:aspect-square"
              loading="lazy"
            />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ink/85 p-3 text-cream backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:p-4">
              <p className="text-[0.65rem] tracking-[0.16em] text-gold uppercase sm:text-xs sm:tracking-[0.2em]">Tonight’s build</p>
              <p className="font-display mt-1 text-lg sm:text-2xl">
                {size.label} · {crust.label} · {sauce.label}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <OptionGroup
              legend="Size"
              options={builderOptions.sizes}
              value={config.size}
              onChange={(id) => setConfig((current) => ({ ...current, size: id }))}
            />
            <OptionGroup
              legend="Crust"
              options={builderOptions.crusts}
              value={config.crust}
              onChange={(id) => setConfig((current) => ({ ...current, crust: id }))}
            />
            <OptionGroup
              legend="Sauce"
              options={builderOptions.sauces}
              value={config.sauce}
              onChange={(id) => setConfig((current) => ({ ...current, sauce: id }))}
            />
            <OptionGroup
              legend="Cheese"
              options={builderOptions.cheeses}
              value={config.cheese}
              onChange={(id) => setConfig((current) => ({ ...current, cheese: id }))}
            />

            <fieldset>
              <legend className="text-sm font-bold tracking-[0.16em] text-ink uppercase">Toppings</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {builderOptions.toppings.map((topping) => {
                  const active = config.toppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-2 text-sm ${
                        active ? "border-ink bg-ink text-cream" : "border-line bg-cream text-warm hover:border-ink"
                      }`}
                      onClick={() => toggleTopping(topping.id)}
                    >
                      {topping.label}
                      <span className="ml-1 text-xs opacity-70">+{formatPrice(topping.price)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-[1.4rem] border border-dashed border-ink/20 bg-cream p-5" aria-live="polite">
            <p className="font-display text-xl text-ink">Kitchen ticket</p>
            <ul className="mt-4 space-y-2 text-sm">
              {lines.map((row) => (
                <li key={row.label} className="flex justify-between gap-3 border-b border-dotted border-ink/15 py-2">
                  <span>{row.label}</span>
                  <span className="font-semibold">
                    {row.label.startsWith("Base") ? formatPrice(row.amount) : `+ ${formatPrice(row.amount)}`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center justify-between">
              <span className="text-sm tracking-[0.16em] uppercase">Total</span>
              <span className="font-display text-3xl text-ink">{formatPrice(total)}</span>
            </p>
            <button type="button" className="btn btn-gold mt-5 w-full" onClick={scrollToContact}>
              Contact to order
            </button>
          </aside>
        </div>
      </div>
    </SectionReveal>
  );
}

function OptionGroup({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold tracking-[0.16em] text-ink uppercase">{legend}</legend>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              className={`rounded-xl border px-3 py-3 text-left ${
                active ? "border-ink bg-ink text-cream" : "border-line bg-cream hover:border-ink"
              }`}
              onClick={() => onChange(option.id)}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className={`text-xs ${active ? "text-gold" : "text-muted"}`}>
                {option.detail ? `${option.detail} · ` : ""}
                {legend === "Size"
                  ? formatPrice(option.price)
                  : option.price
                    ? `+ ${formatPrice(option.price)}`
                    : "Included"}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

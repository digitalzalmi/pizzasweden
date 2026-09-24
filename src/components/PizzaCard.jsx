import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { formatPrice } from "../utils/format";

const SIZE_KEYS = [
  { key: "small", label: "S" },
  { key: "medium", label: "M" },
  { key: "large", label: "L" },
];

export default function PizzaCard({ pizza, highlighted = false }) {
  const [size, setSize] = useState("medium");
  const price = pizza.sizes?.[size] ?? pizza.price;

  return (
    <article
      id={`pizza-${pizza.id}`}
      className={`pizza-card group flex h-full flex-col overflow-hidden rounded-xl border bg-paper shadow-[0_8px_22px_rgba(22,19,17,0.05)] transition-all duration-300 sm:rounded-2xl ${
        highlighted ? "border-gold ring-2 ring-gold/40" : "border-line hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(22,19,17,0.1)]"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={pizza.image}
          alt={`${pizza.name} pizza`}
          className={`pizza-card-image h-36 w-full object-cover sm:h-44 ${pizza.available ? "" : "grayscale"}`}
          loading="lazy"
        />
        {pizza.badge ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-ink px-2.5 py-0.5 text-[0.58rem] font-bold tracking-[0.12em] text-gold uppercase">
            {pizza.badge}
          </span>
        ) : null}
        {!pizza.available ? (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-ink/85 px-2.5 py-0.5 text-[0.58rem] font-bold tracking-[0.12em] text-cream uppercase">
            Sold out
          </span>
        ) : null}
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-paper/95 px-2.5 py-0.5 text-xs font-bold text-ink">
          {formatPrice(price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.15rem] leading-tight text-ink sm:text-xl">{pizza.name}</h3>
          <p className="flex items-center gap-0.5 text-xs font-semibold text-ink">
            <AiFillStar className="text-gold" aria-hidden="true" />
            <span>{pizza.rating.toFixed(1)}</span>
          </p>
        </div>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted sm:text-[0.8rem]">{pizza.description}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex rounded-full border border-line p-0.5" role="group" aria-label={`View size prices for ${pizza.name}`}>
            {SIZE_KEYS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`h-7 min-w-7 rounded-full px-2 text-[0.65rem] font-bold ${
                  size === option.key ? "bg-ink text-cream" : "text-muted hover:text-ink"
                }`}
                aria-pressed={size === option.key}
                onClick={() => setSize(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[0.62rem] tracking-[0.1em] text-muted uppercase">{size}</p>
        </div>
      </div>
    </article>
  );
}

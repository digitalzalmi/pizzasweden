import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

const SIZE_KEYS = [
  { key: "small", label: "S" },
  { key: "medium", label: "M" },
  { key: "large", label: "L" },
];

export default function PizzaCard({ pizza, highlighted = false }) {
  const { addItem } = useCart();
  const [size, setSize] = useState("medium");
  const price = pizza.sizes?.[size] ?? pizza.price;

  function addToOrder() {
    addItem({
      pizzaId: pizza.id,
      name: pizza.name,
      size: size[0].toUpperCase() + size.slice(1),
      price,
      image: pizza.image,
    });
  }

  return (
    <article
      id={`pizza-${pizza.id}`}
      className={`pizza-card group flex h-full flex-col overflow-hidden rounded-[1.4rem] border bg-paper shadow-[0_12px_30px_rgba(22,19,17,0.06)] transition-all duration-300 ${
        highlighted ? "border-gold ring-2 ring-gold/40" : "border-line hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,19,17,0.12)]"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={pizza.image}
          alt={`${pizza.name} pizza`}
          className={`pizza-card-image h-44 w-full object-cover sm:h-52 ${pizza.available ? "" : "grayscale"}`}
          loading="lazy"
        />
        {pizza.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[0.68rem] font-bold tracking-[0.14em] text-gold uppercase">
            {pizza.badge}
          </span>
        ) : null}
        <span className="absolute right-3 bottom-3 rounded-full bg-paper/95 px-3 py-1 text-sm font-bold text-ink">
          {formatPrice(price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.35rem] leading-tight text-ink sm:text-2xl">{pizza.name}</h3>
          <p className="flex items-center gap-1 text-sm font-semibold text-ink">
            <AiFillStar className="text-gold" aria-hidden="true" />
            <span>{pizza.rating.toFixed(1)}</span>
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{pizza.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex rounded-full border border-line p-1" role="group" aria-label={`Choose size for ${pizza.name}`}>
            {SIZE_KEYS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`h-8 min-w-8 rounded-full px-2.5 text-xs font-bold ${
                  size === option.key ? "bg-ink text-cream" : "text-muted hover:text-ink"
                }`}
                aria-pressed={size === option.key}
                onClick={() => setSize(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[0.7rem] tracking-[0.12em] text-muted uppercase">{size}</p>
        </div>

        <button
          type="button"
          className="btn btn-ink mt-5 w-full"
          disabled={!pizza.available}
          onClick={addToOrder}
        >
          {pizza.available ? "Add to Order" : "Sold Out"}
        </button>
      </div>
    </article>
  );
}

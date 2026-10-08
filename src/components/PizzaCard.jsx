import { AiFillStar } from "react-icons/ai";
import { formatPrice } from "../utils/format";
import { useT } from "../i18n";

export default function PizzaCard({ pizza, item, highlighted = false }) {
  const dish = item || pizza;
  const { t, L, categoryLabel } = useT();
  const price = dish.price;
  const name = L(dish, "name") || dish.name;
  const description = L(dish, "description") || dish.description;
  const badge = L(dish, "badge") || dish.badge;

  return (
    <article
      id={`menu-${dish.id}`}
      className={`pizza-card group flex h-full flex-col overflow-hidden rounded-xl border bg-paper shadow-[0_8px_22px_rgba(22,19,17,0.05)] transition-all duration-300 sm:rounded-2xl ${
        highlighted ? "border-gold ring-2 ring-gold/40" : "border-line hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(22,19,17,0.1)]"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={dish.image}
          alt={name}
          className={`pizza-card-image h-36 w-full object-cover sm:h-44 ${dish.available ? "" : "grayscale"}`}
          loading="lazy"
        />
        {badge ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-ink px-2.5 py-0.5 text-[0.58rem] font-bold tracking-[0.12em] text-gold uppercase">
            {badge}
          </span>
        ) : null}
        {!dish.available ? (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-ink/85 px-2.5 py-0.5 text-[0.58rem] font-bold tracking-[0.12em] text-cream uppercase">
            {t("soldOut")}
          </span>
        ) : null}
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-paper/95 px-2.5 py-0.5 text-xs font-bold text-ink">
          {formatPrice(price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.15rem] leading-tight text-ink sm:text-xl">{name}</h3>
          <p className="flex items-center gap-0.5 text-xs font-semibold text-ink">
            <AiFillStar className="text-gold" aria-hidden="true" />
            <span>{Number(dish.rating || 0).toFixed(1)}</span>
          </p>
        </div>
        <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">{categoryLabel(dish.category)}</p>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted sm:text-[0.8rem]">{description}</p>
      </div>
    </article>
  );
}

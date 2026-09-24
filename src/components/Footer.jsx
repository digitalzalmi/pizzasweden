import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import PizzaLogo from "./PizzaLogo";

export default function Footer() {
  const { restaurant } = useContent();
  return (
    <footer className="bg-ink text-cream">
      <div className="container-site grid gap-6 py-9 sm:gap-8 sm:py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <a href="#home" className="flex items-center gap-2.5 no-underline">
            <PizzaLogo className="h-8 w-8 shrink-0" />
            <span className="font-display text-sm tracking-[0.1em] text-gold sm:tracking-[0.14em]">{restaurant.name}</span>
          </a>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-cream/65 sm:text-sm">{restaurant.footerBlurb}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Quick Links</h2>
          <ul className="mt-4 space-y-2">
            {restaurant.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-sm text-cream/75 no-underline hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Opening Hours</h2>
          <p className="mt-4 text-sm text-cream/75">
            {restaurant.hoursTitle}
            <br />
            {restaurant.hoursTime}
          </p>
          <p className="mt-2 text-xs text-cream/45">{restaurant.hoursNote}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Contact</h2>
          <p className="mt-4 text-sm text-cream/75">
            {restaurant.addressLine1}
            <br />
            {restaurant.addressLine2}
          </p>
          <p className="mt-3 text-sm">
            <a className="text-cream/75 no-underline hover:text-gold" href={`tel:${restaurant.phoneTel}`}>
              {restaurant.phoneDisplay}
            </a>
            <br />
            <a className="text-cream/75 no-underline hover:text-gold" href={`mailto:${restaurant.email}`}>
              {restaurant.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[0.68rem] tracking-[0.08em] text-cream/45 sm:text-xs sm:tracking-[0.12em]">
        {restaurant.copyright}{" "}
        <Link to="/admin" className="text-cream/40 no-underline hover:text-gold">
          Owner login
        </Link>
      </div>
    </footer>
  );
}

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import PizzaLogo from "./PizzaLogo";

const social = [
  { key: "facebook", label: "Facebook", Icon: FaFacebookF },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
  { key: "whatsapp", label: "WhatsApp", Icon: FaWhatsapp },
];

export default function Footer() {
  const { restaurant } = useContent();
  return (
    <footer className="bg-ink text-cream">
      <div className="container-site grid gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <a href="#home" className="flex items-center gap-3 no-underline">
            <PizzaLogo className="h-9 w-9 shrink-0" />
            <span className="font-display tracking-[0.12em] text-gold sm:tracking-[0.18em]">{restaurant.name}</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">{restaurant.footerBlurb}</p>
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
          <ul className="mt-5 flex gap-2">
            {social.map(({ key, label, Icon }) => (
              <li key={key}>
                <a
                  href={restaurant.social[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-cream no-underline hover:border-gold hover:text-gold"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
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

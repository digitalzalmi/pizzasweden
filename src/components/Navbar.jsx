import { useEffect, useState } from "react";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import { useContent } from "../context/ContentContext";
import PizzaLogo from "./PizzaLogo";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const { restaurant } = useContent();
  const { count, openCart, setSearchOpen, searchOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function goTo(id) {
    setMobileOpen(false);
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-ink/95 text-cream shadow-[0_10px_30px_rgba(22,19,17,0.18)] backdrop-blur-md"
            : "bg-transparent text-cream"
        }`}
      >
        <nav className="container-site flex h-16 items-center justify-between gap-2 sm:h-[72px] sm:gap-4" aria-label="Primary">
          <a href="#home" className="flex min-w-0 items-center gap-2 no-underline sm:gap-2.5" onClick={() => goTo("home")}>
            <PizzaLogo className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
            <span className="font-display truncate text-[0.92rem] font-semibold tracking-[0.1em] text-gold sm:text-[1.15rem] sm:tracking-[0.18em]">
              {restaurant.name}
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {restaurant.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[0.78rem] font-semibold tracking-[0.16em] text-cream/80 uppercase no-underline transition-colors hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-cream transition-colors hover:bg-white/10 hover:text-gold"
              aria-label="Search the menu"
              onClick={() => setSearchOpen(true)}
            >
              <FiSearch size={18} />
            </button>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full text-cream transition-colors hover:bg-white/10 hover:text-gold"
              aria-label={`Open order bag, ${count} items`}
              onClick={() => openCart()}
            >
              <HiOutlineShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
            <button type="button" className="btn btn-gold hidden md:inline-flex" onClick={() => openCart()}>
              Order Now
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-ink text-cream transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <div className="flex h-full flex-col px-5 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-28">
          <ul className="flex flex-col gap-1 sm:gap-2">
            {restaurant.nav.map((item, index) => (
              <li key={item.id} style={{ transitionDelay: mobileOpen ? `${index * 60}ms` : "0ms" }}>
                <button
                  type="button"
                  className="font-display w-full py-2.5 text-left text-[clamp(1.85rem,8vw,2.5rem)] text-cream sm:py-3"
                  onClick={() => goTo(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <p className="text-sm text-cream/60">{restaurant.addressLine1}</p>
            <button type="button" className="btn btn-gold w-full" onClick={() => { setMobileOpen(false); openCart(); }}>
              Order Now
            </button>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal />}
    </>
  );
}

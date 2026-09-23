import { useEffect, useState } from "react";
import { FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useContent } from "../context/ContentContext";
import ImageSlider from "./ImageSlider";

export default function Hero() {
  const { restaurant, heroSlides } = useContent();
  const { openCart } = useCart();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const onScroll = () => setOffset(Math.min(window.scrollY, 700));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToMenu() {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-ink text-cream">
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${offset * 0.22}px, 0) scale(1.06)` }}
      >
        <ImageSlider slides={heroSlides} className="h-full min-h-[100svh]" kenBurns controlsClassName="bottom-[5.75rem] sm:bottom-28">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink/88 via-ink/45 to-ink/15" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink/90 via-transparent to-ink/25" />
        </ImageSlider>
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col">
        <div className="container-site flex flex-1 flex-col justify-center pt-24 pb-8 sm:py-28">
          <p className="hero-enter text-[0.62rem] font-bold tracking-[0.22em] text-gold sm:text-[0.72rem] sm:tracking-[0.32em]">
            {restaurant.heroLabel}
          </p>
          <h1 className="font-display hero-enter-delay mt-3 max-w-3xl whitespace-pre-line text-[clamp(2.15rem,11vw,6rem)] leading-[0.92] font-semibold text-cream sm:mt-4">
            {restaurant.tagline}
          </h1>
          <p className="hero-enter-delay mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/78 sm:mt-5 sm:text-[1.05rem]">
            {restaurant.heroSupport}
          </p>
          <div className="hero-enter-delay mt-6 flex w-full max-w-md flex-col gap-3 pointer-events-auto sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap">
            <button type="button" className="btn btn-gold w-full sm:w-auto" onClick={() => openCart()}>
              Order Now
            </button>
            <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={scrollToMenu}>
              Explore Menu
            </button>
          </div>
        </div>

        <div className="pointer-events-auto border-t border-white/10 bg-ink/55 backdrop-blur-md">
          <dl className="container-site grid grid-cols-3 gap-2 py-3 sm:gap-4 sm:py-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-10 sm:w-10">
                <FiPhone aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.68rem] tracking-[0.16em] text-cream/50 uppercase sm:block">Call</dt>
                <dd className="truncate">
                  <a className="text-xs font-semibold text-cream no-underline hover:text-gold sm:text-base" href={`tel:${restaurant.phoneTel}`}>
                    {restaurant.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-10 sm:w-10">
                <FiMapPin aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.68rem] tracking-[0.16em] text-cream/50 uppercase sm:block">Find us</dt>
                <dd className="truncate text-xs font-semibold text-cream sm:text-base">{restaurant.addressLine1}</dd>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-10 sm:w-10">
                <FiClock aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.68rem] tracking-[0.16em] text-cream/50 uppercase sm:block">Hours</dt>
                <dd className="truncate text-xs font-semibold text-cream sm:text-base">
                  <span className="sm:hidden">{restaurant.hoursTime}</span>
                  <span className="hidden sm:inline">
                    {restaurant.hoursTitle} · {restaurant.hoursTime}
                  </span>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

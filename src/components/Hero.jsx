import { useEffect, useState } from "react";
import { FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { useContent } from "../context/ContentContext";
import ImageSlider from "./ImageSlider";

export default function Hero() {
  const { restaurant, heroSlides } = useContent();
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

  function scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-ink text-cream">
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${offset * 0.22}px, 0) scale(1.06)` }}
      >
        <ImageSlider slides={heroSlides} className="h-full min-h-[100svh]" kenBurns controlsClassName="bottom-[4.75rem] sm:bottom-24">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink/88 via-ink/45 to-ink/15" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink/90 via-transparent to-ink/25" />
        </ImageSlider>
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col">
        <div className="container-site flex flex-1 flex-col justify-center pt-20 pb-6 sm:pt-24 sm:pb-16">
          <p className="hero-enter text-[0.58rem] font-bold tracking-[0.2em] text-gold sm:text-[0.65rem] sm:tracking-[0.28em]">
            {restaurant.heroLabel}
          </p>
          <h1 className="font-display hero-enter-delay mt-2.5 max-w-3xl whitespace-pre-line text-[clamp(1.85rem,8.5vw,4.35rem)] leading-[0.94] font-semibold text-cream sm:mt-3">
            {restaurant.tagline}
          </h1>
          <p className="hero-enter-delay mt-3 max-w-lg text-[0.88rem] leading-relaxed text-cream/78 sm:mt-4 sm:text-[0.95rem]">
            {restaurant.heroSupport}
          </p>
          <div className="hero-enter-delay mt-5 flex w-full max-w-md flex-col gap-2.5 pointer-events-auto sm:mt-6 sm:max-w-none sm:flex-row sm:flex-wrap">
            <button type="button" className="btn btn-gold w-full sm:w-auto" onClick={scrollToMenu}>
              Explore Menu
            </button>
            <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={scrollToContact}>
              Contact Us
            </button>
          </div>
        </div>

        <div className="pointer-events-auto border-t border-white/10 bg-ink/55 backdrop-blur-md">
          <dl className="container-site grid grid-cols-3 gap-2 py-2.5 sm:gap-3 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-8 sm:w-8">
                <FiPhone aria-hidden="true" size={14} />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.58rem] tracking-[0.14em] text-cream/50 uppercase sm:block">Call</dt>
                <dd className="truncate">
                  <a className="text-[0.7rem] font-semibold text-cream no-underline hover:text-gold sm:text-sm" href={`tel:${restaurant.phoneTel}`}>
                    {restaurant.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-8 sm:w-8">
                <FiMapPin aria-hidden="true" size={14} />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.58rem] tracking-[0.14em] text-cream/50 uppercase sm:block">Find us</dt>
                <dd className="truncate text-[0.7rem] font-semibold text-cream sm:text-sm">{restaurant.addressLine1}</dd>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-ink sm:h-8 sm:w-8">
                <FiClock aria-hidden="true" size={14} />
              </span>
              <div className="min-w-0">
                <dt className="hidden text-[0.58rem] tracking-[0.14em] text-cream/50 uppercase sm:block">Hours</dt>
                <dd className="truncate text-[0.7rem] font-semibold text-cream sm:text-sm">
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

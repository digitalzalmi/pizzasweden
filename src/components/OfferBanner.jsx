import { useContent } from "../context/ContentContext";
import { formatPrice } from "../utils/format";
import ImageSlider from "./ImageSlider";
import SectionReveal from "./SectionReveal";

export default function OfferBanner() {
  const { offers, offerSlides } = useContent();
  const offer = offers[0];
  if (!offer) return null;

  function scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <SectionReveal id="offers" className="scroll-mt-24 bg-cream py-8" variant="left" aria-labelledby="offer-heading">
      <div className="container-site">
        <div className="overflow-hidden rounded-[1.25rem] bg-ink text-cream sm:rounded-[2rem] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <ImageSlider
            slides={offerSlides}
            interval={4800}
            className="min-h-[220px] sm:min-h-[280px] lg:min-h-full"
            kenBurns
          >
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/15 to-transparent lg:bg-gradient-to-r" />
            <p className="absolute top-4 left-4 z-[2] rounded-full bg-gold px-3 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-ink uppercase sm:top-5 sm:left-5 sm:text-[0.7rem] sm:tracking-[0.16em]">
              {offer.kicker}
            </p>
          </ImageSlider>

          <div className="relative px-5 py-8 sm:px-6 sm:py-10 md:px-10 lg:py-14">
            <p className="text-[0.62rem] font-bold tracking-[0.22em] text-gold sm:text-[0.72rem] sm:tracking-[0.28em]">{offer.title}</p>
            <h2 id="offer-heading" className="font-display mt-3 text-[clamp(1.7rem,7vw,3.4rem)] leading-[1.05] sm:mt-4">
              {offer.headline}
            </h2>
            <p className="mt-4 max-w-md text-sm text-cream/70 sm:text-base">{offer.description}</p>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <p className="font-display text-[clamp(2.2rem,8vw,3rem)] text-gold">{formatPrice(offer.price)}</p>
              <p className="pb-1 text-sm text-cream/40 line-through">{formatPrice(offer.originalPrice)}</p>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-cream/80">
              {offer.includes.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <button type="button" className="btn btn-gold mt-8" onClick={scrollToContact}>
              {offer.cta || "Ask about this deal"}
            </button>
            <p className="mt-3 text-xs text-cream/45">{offer.note}</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

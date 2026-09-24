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
    <SectionReveal id="offers" className="scroll-mt-20 bg-cream py-6 sm:py-8" variant="left" aria-labelledby="offer-heading">
      <div className="container-site">
        <div className="overflow-hidden rounded-xl bg-ink text-cream sm:rounded-2xl lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <ImageSlider
            slides={offerSlides}
            interval={4800}
            className="min-h-[180px] sm:min-h-[240px] lg:min-h-full"
            kenBurns
          >
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/15 to-transparent lg:bg-gradient-to-r" />
            <p className="absolute top-3 left-3 z-[2] rounded-full bg-gold px-2.5 py-0.5 text-[0.55rem] font-bold tracking-[0.12em] text-ink uppercase sm:top-4 sm:left-4 sm:text-[0.62rem]">
              {offer.kicker}
            </p>
          </ImageSlider>

          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:py-10">
            <p className="text-[0.58rem] font-bold tracking-[0.2em] text-gold sm:text-[0.65rem] sm:tracking-[0.24em]">{offer.title}</p>
            <h2 id="offer-heading" className="font-display mt-2 text-[clamp(1.45rem,5vw,2.4rem)] leading-[1.05] sm:mt-3">
              {offer.headline}
            </h2>
            <p className="mt-3 max-w-md text-xs text-cream/70 sm:text-sm">{offer.description}</p>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="font-display text-[clamp(1.7rem,5vw,2.25rem)] text-gold">{formatPrice(offer.price)}</p>
              <p className="pb-0.5 text-xs text-cream/40 line-through">{formatPrice(offer.originalPrice)}</p>
            </div>

            <ul className="mt-4 space-y-1.5 text-xs text-cream/80 sm:text-sm">
              {offer.includes.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <button type="button" className="btn btn-gold mt-5" onClick={scrollToContact}>
              {offer.cta || "Ask about this deal"}
            </button>
            <p className="mt-2.5 text-[0.68rem] text-cream/45">{offer.note}</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

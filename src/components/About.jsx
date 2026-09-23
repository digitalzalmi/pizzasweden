import { useContent } from "../context/ContentContext";
import SectionReveal from "./SectionReveal";

export default function About() {
  const { restaurant, images } = useContent();
  return (
    <SectionReveal id="about" className="scroll-mt-24 bg-cream py-14 sm:py-20" variant="right" aria-labelledby="about-heading">
      <div className="container-site grid items-center gap-10 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden sm:overflow-visible">
          <div className="absolute top-3 left-3 hidden h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] rounded-[1.8rem] border border-gold/50 sm:block" aria-hidden="true" />
          <img
            src={images.aboutKitchen}
            alt="Pizza maker stretching handmade dough in the Pizza House kitchen"
            className="scroll-zoom relative z-10 aspect-[4/5] w-full rounded-[1.4rem] object-cover sm:translate-x-3 sm:translate-y-3 sm:rounded-[1.8rem]"
            loading="lazy"
          />
          <img
            src={images.aboutOven}
            alt="Fresh pizza coming out of a hot oven"
            className="absolute right-2 -bottom-4 z-20 hidden w-36 rounded-2xl border-4 border-cream object-cover shadow-xl md:block md:w-52"
            loading="lazy"
          />
        </div>

        <div className="lg:pl-6">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-tomato uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">Our story</p>
          <h2 id="about-heading" className="font-display mt-3 text-[clamp(1.85rem,8vw,3.8rem)] text-ink">
            {restaurant.aboutTitle}
          </h2>
          <p className="mt-4 text-lg text-ink/80">{restaurant.aboutLead}</p>
          <div className="mt-5 space-y-4 text-muted">
            {restaurant.aboutBody.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-line pt-6 min-[480px]:grid-cols-3">
            {restaurant.aboutStats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-[0.65rem] tracking-[0.12em] text-muted uppercase sm:text-xs sm:tracking-[0.14em]">{stat.label}</dt>
                <dd className="font-display mt-1 text-xl text-ink sm:text-2xl md:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionReveal>
  );
}

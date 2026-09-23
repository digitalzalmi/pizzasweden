import { GiPizzaCutter } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa6";
import { LuUtensils } from "react-icons/lu";
import { MdCelebration } from "react-icons/md";
import { useContent } from "../context/ContentContext";
import SectionReveal from "./SectionReveal";

const iconMap = {
  dine: LuUtensils,
  delivery: FaMotorcycle,
  takeaway: GiPizzaCutter,
  party: MdCelebration,
};

export default function Services() {
  const { services } = useContent();
  return (
    <SectionReveal className="bg-ink py-12 text-cream sm:py-16" variant="up" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 md:flex-row md:items-end">
          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">How we serve</p>
            <h2 id="services-heading" className="font-display mt-2 text-[clamp(1.7rem,7vw,2.25rem)]">
              Table, box, or doorstep
            </h2>
          </div>
          <p className="max-w-sm text-sm text-cream/60">
            Same oven, four ways to eat. Choose the service that fits the night.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <article key={service.id} className="rounded-[1.4rem] border border-white/10 bg-ink-soft p-6">
                <p className="text-xs tracking-[0.2em] text-gold/80">0{index + 1}</p>
                <Icon className="mt-4 text-gold" size={26} aria-hidden="true" />
                <h3 className="font-display mt-4 text-2xl">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}

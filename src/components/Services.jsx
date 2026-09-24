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
    <SectionReveal className="bg-ink py-9 text-cream sm:py-12" variant="up" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:mb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.2em] text-gold uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">How we serve</p>
            <h2 id="services-heading" className="font-display mt-1.5 text-[clamp(1.45rem,5vw,1.9rem)]">
              Table, box, or doorstep
            </h2>
          </div>
          <p className="max-w-sm text-xs text-cream/60 sm:text-sm">
            Same oven, four ways to eat. Choose the service that fits the night.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <article key={service.id} className="rounded-xl border border-white/10 bg-ink-soft p-4 sm:rounded-2xl sm:p-5">
                <p className="text-[0.65rem] tracking-[0.18em] text-gold/80">0{index + 1}</p>
                <Icon className="mt-3 text-gold" size={22} aria-hidden="true" />
                <h3 className="font-display mt-3 text-xl">{service.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-cream/65 sm:text-sm">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}

import { GiWheat, GiPizzaSlice } from "react-icons/gi";
import { IoFlashOutline } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { useContent } from "../context/ContentContext";
import SectionReveal from "./SectionReveal";

const iconMap = {
  fresh: GiWheat,
  fast: IoFlashOutline,
  handcrafted: GiPizzaSlice,
  quality: AiFillStar,
};

export default function FeatureStrip() {
  const { features } = useContent();
  return (
    <SectionReveal className="bg-cream" variant="up" aria-label="Why guests choose Pizza House">
      <div className="border-y border-ink/10 bg-paper">
        <div className="container-site grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <article key={feature.id} className="flex items-start gap-3 px-4 py-5 sm:px-5 sm:py-6">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-gold">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold tracking-wide text-ink uppercase">{feature.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}

import { useContent } from "../context/ContentContext";
import { useT } from "../i18n";
import SectionReveal from "./SectionReveal";

export default function About() {
  const { restaurant, images } = useContent();
  const { t, L } = useT();
  const aboutBody = L(restaurant, "aboutBody");
  const paragraphs = Array.isArray(aboutBody) ? aboutBody : restaurant.aboutBody || [];

  return (
    <SectionReveal id="about" className="scroll-mt-20 bg-cream py-10 sm:py-14" variant="right" aria-labelledby="about-heading">
      <div className="container-site grid items-center gap-7 sm:gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <img
            src={images.aboutKitchen}
            alt={t("ourStory")}
            className="scroll-zoom aspect-[3/4] w-full rounded-xl object-cover sm:rounded-2xl"
            loading="lazy"
          />
          <img
            src={images.aboutOven}
            alt={t("ourStory")}
            className="scroll-zoom mt-6 aspect-[3/4] w-full rounded-xl object-cover sm:mt-10 sm:rounded-2xl"
            loading="lazy"
          />
        </div>

        <div className="lg:pl-4">
          <p className="text-[0.6rem] font-bold tracking-[0.2em] text-tomato uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">{t("ourStory")}</p>
          <h2 id="about-heading" className="font-display mt-2 text-[clamp(1.55rem,5.5vw,2.65rem)] text-ink">
            {L(restaurant, "aboutTitle")}
          </h2>
          <p className="mt-3 text-[0.95rem] text-ink/80 sm:text-base">{L(restaurant, "aboutLead")}</p>
          <div className="mt-3 space-y-3 text-sm text-muted">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-line pt-5 min-[480px]:grid-cols-3">
            {(restaurant.aboutStats || []).map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-[0.6rem] tracking-[0.1em] text-muted uppercase sm:text-[0.65rem] sm:tracking-[0.12em]">
                  {L(stat, "label")}
                </dt>
                <dd className="font-display mt-0.5 text-lg text-ink sm:text-xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionReveal>
  );
}

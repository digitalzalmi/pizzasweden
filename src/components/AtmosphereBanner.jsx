import { useContent } from "../context/ContentContext";
import { useT } from "../i18n";
import ImageSlider from "./ImageSlider";
import SectionReveal from "./SectionReveal";

export default function AtmosphereBanner() {
  const { houseSlides } = useContent();
  const { t, L } = useT();

  const slides = (houseSlides || []).map((slide) => ({
    ...slide,
    alt: L(slide, "alt") || slide.alt,
    kicker: L(slide, "kicker") || slide.kicker,
    title: L(slide, "title") || slide.title,
    text: L(slide, "text") || slide.text,
  }));

  return (
    <SectionReveal className="bg-ink py-5" variant="scale" aria-labelledby="house-heading">
      <div className="container-site">
        <ImageSlider
          slides={slides}
          interval={6200}
          className="min-h-[220px] rounded-xl sm:min-h-[340px] sm:rounded-2xl md:min-h-[400px]"
        >
          {(_index, slide) => (
            <>
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
              <div
                key={slide?.src}
                className="banner-copy relative z-[2] flex min-h-[220px] max-w-xl flex-col justify-end p-4 pb-14 sm:min-h-[340px] sm:p-6 sm:pb-14 md:min-h-[400px] md:p-8"
                aria-live="polite"
              >
                <p className="text-[0.55rem] font-bold tracking-[0.2em] text-gold uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">
                  {slide?.kicker || t("theHouse")}
                </p>
                <h2 id="house-heading" className="font-display mt-1.5 text-[clamp(1.4rem,5.5vw,2.5rem)] leading-[1.05] text-cream sm:mt-2">
                  {slide?.title || t("moreThanMenu")}
                </h2>
                <p className="mt-2 max-w-md text-xs text-cream/75 sm:mt-3 sm:text-sm">{slide?.text}</p>
              </div>
            </>
          )}
        </ImageSlider>
      </div>
    </SectionReveal>
  );
}

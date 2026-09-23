import { useContent } from "../context/ContentContext";
import ImageSlider from "./ImageSlider";
import SectionReveal from "./SectionReveal";

export default function AtmosphereBanner() {
  const { houseSlides } = useContent();
  return (
    <SectionReveal className="bg-ink py-6" variant="scale" aria-labelledby="house-heading">
      <div className="container-site">
        <ImageSlider
          slides={houseSlides}
          interval={6200}
          className="min-h-[280px] rounded-[1.25rem] sm:min-h-[420px] sm:rounded-[2rem] md:min-h-[520px]"
        >
          {(_index, slide) => (
            <>
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
              <div
                key={slide?.src}
                className="banner-copy relative z-[2] flex min-h-[280px] max-w-xl flex-col justify-end p-5 pb-16 sm:min-h-[420px] sm:p-8 sm:pb-16 md:min-h-[520px] md:p-12"
                aria-live="polite"
              >
                <p className="text-[0.62rem] font-bold tracking-[0.22em] text-gold uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">
                  {slide?.kicker || "The house"}
                </p>
                <h2 id="house-heading" className="font-display mt-2 text-[clamp(1.65rem,7vw,3.6rem)] leading-[1.05] text-cream sm:mt-3">
                  {slide?.title || "More than a menu"}
                </h2>
                <p className="mt-3 max-w-md text-sm text-cream/75 sm:mt-4 sm:text-base">{slide?.text}</p>
              </div>
            </>
          )}
        </ImageSlider>
      </div>
    </SectionReveal>
  );
}

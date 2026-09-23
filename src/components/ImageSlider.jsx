import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ImageSlider({
  slides,
  interval = 5600,
  className = "",
  imageClassName = "",
  altFallback = "Pizza House",
  showControls = true,
  kenBurns = true,
  controlsClassName = "",
  children,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const slideCount = slides?.length || 0;
  const go = useCallback(
    (next) => {
      if (!slideCount) return;
      setIndex((current) => (current + next + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    if (paused || reduceMotion || slideCount < 2) return undefined;
    const timer = window.setInterval(() => go(1), interval);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slideCount, interval, go]);

  if (!slideCount) {
    return <div className={`relative overflow-hidden bg-ink ${className}`} />;
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photo banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, slideIndex) => (
          <img
            key={slide.src + slideIndex}
            src={slide.src}
            alt={slide.alt || altFallback}
            className={`slide-img ${kenBurns ? "slide-ken" : ""} ${slideIndex === index ? "is-active" : ""} ${imageClassName}`}
            aria-hidden={slideIndex !== index}
          />
        ))}
      </div>

      {typeof children === "function" ? children(index, slides[index]) : children}

      {showControls && slides.length > 1 && (
        <div className={`absolute inset-x-0 bottom-4 z-20 flex items-center justify-between gap-3 px-4 sm:bottom-5 sm:px-5 ${controlsClassName}`}>
          <div className="flex gap-2" role="tablist" aria-label="Banner slides">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src + slideIndex}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={`Show slide ${slideIndex + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  slideIndex === index ? "w-8 bg-gold" : "w-2.5 bg-white/45 hover:bg-white"
                }`}
                onClick={() => setIndex(slideIndex)}
              />
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-ink/40 text-cream backdrop-blur-sm hover:border-gold hover:text-gold"
              aria-label="Previous banner image"
              onClick={() => go(-1)}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-ink/40 text-cream backdrop-blur-sm hover:border-gold hover:text-gold"
              aria-label="Next banner image"
              onClick={() => go(1)}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

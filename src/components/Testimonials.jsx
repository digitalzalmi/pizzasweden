import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useContent } from "../context/ContentContext";
import SectionReveal from "./SectionReveal";

export default function Testimonials() {
  const { testimonials, testimonialsNote } = useContent();
  const [active, setActive] = useState(0);
  const review = testimonials[active] || testimonials[0];
  if (!review) return null;

  return (
    <SectionReveal className="bg-cream py-10 sm:py-14" variant="right" aria-labelledby="reviews-heading">
      <div className="container-site grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[0.6rem] font-bold tracking-[0.2em] text-tomato uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">Guest notes</p>
          <h2 id="reviews-heading" className="font-display mt-2 text-[clamp(1.55rem,5.5vw,2.5rem)] text-ink">
            What the table says
          </h2>
          <p className="mt-3 text-xs text-muted sm:text-sm">{testimonialsNote}</p>
        </div>

        <figure className="rounded-xl bg-paper p-4 shadow-[0_10px_28px_rgba(22,19,17,0.05)] sm:rounded-2xl sm:p-6 md:p-8">
          <div className="flex text-gold" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <AiFillStar key={index} className={index < review.rating ? "text-gold" : "text-line"} size={16} />
            ))}
          </div>
          <blockquote className="font-display mt-4 text-[clamp(1.2rem,2.5vw,1.75rem)] leading-snug text-ink">
            “{review.quote}”
          </blockquote>
          <figcaption className="mt-4 text-xs sm:text-sm">
            <span className="font-bold text-ink">— {review.name}</span>
            <span className="text-muted"> · {review.city} · {review.dish}</span>
          </figcaption>

          <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Choose a review">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  index === active ? "bg-ink text-cream" : "bg-cream text-warm hover:bg-line"
                }`}
                onClick={() => setActive(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </figure>
      </div>
    </SectionReveal>
  );
}

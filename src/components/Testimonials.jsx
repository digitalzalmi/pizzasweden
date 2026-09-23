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
    <SectionReveal className="bg-cream py-14 sm:py-20" variant="right" aria-labelledby="reviews-heading">
      <div className="container-site grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-tomato uppercase sm:text-[0.72rem] sm:tracking-[0.28em]">Guest notes</p>
          <h2 id="reviews-heading" className="font-display mt-3 text-[clamp(1.85rem,8vw,3.6rem)] text-ink">
            What the table says
          </h2>
          <p className="mt-4 text-sm text-muted">{testimonialsNote}</p>
        </div>

        <figure className="rounded-[1.4rem] bg-paper p-5 shadow-[0_16px_40px_rgba(22,19,17,0.06)] sm:rounded-[2rem] sm:p-8 md:p-12">
          <div className="flex text-gold" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <AiFillStar key={index} className={index < review.rating ? "text-gold" : "text-line"} />
            ))}
          </div>
          <blockquote className="font-display mt-6 text-[clamp(1.5rem,3vw,2.35rem)] leading-snug text-ink">
            “{review.quote}”
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="font-bold text-ink">— {review.name}</span>
            <span className="text-muted"> · {review.city} · {review.dish}</span>
          </figcaption>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Choose a review">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
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

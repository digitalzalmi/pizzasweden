import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { useContent } from "../context/ContentContext";
import SectionReveal from "./SectionReveal";

export default function Contact() {
  const { restaurant, images } = useContent();
  return (
    <SectionReveal id="contact" className="scroll-mt-24 bg-paper py-14 sm:py-20" variant="up" aria-labelledby="contact-heading">
      <div className="container-site grid overflow-hidden rounded-[1.25rem] bg-cream sm:rounded-[2rem] lg:grid-cols-2">
        <div className="p-5 sm:p-8 md:p-12">
          <p className="text-[0.72rem] font-bold tracking-[0.28em] text-tomato uppercase">Visit us</p>
          <h2 id="contact-heading" className="font-display mt-3 text-[clamp(2.2rem,5vw,3.5rem)] text-ink">
            {restaurant.shortName}
          </h2>
          <address className="mt-6 not-italic">
            <p className="flex items-start gap-3 text-lg text-ink">
              <FiMapPin className="mt-1 text-gold" aria-hidden="true" />
              <span>
                {restaurant.addressLine1}
                <br />
                {restaurant.addressLine2}
              </span>
            </p>
          </address>

          <dl className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <FiPhone className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-xs tracking-[0.16em] text-muted uppercase">Phone</dt>
                <dd>
                  <a className="text-ink no-underline hover:text-tomato" href={`tel:${restaurant.phoneTel}`}>
                    {restaurant.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-xs tracking-[0.16em] text-muted uppercase">Email</dt>
                <dd>
                  <a className="text-ink no-underline hover:text-tomato" href={`mailto:${restaurant.email}`}>
                    {restaurant.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-xs tracking-[0.16em] text-muted uppercase">Opening hours</dt>
                <dd className="text-ink">
                  {restaurant.hoursTitle}
                  <br />
                  {restaurant.hoursTime}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-gold no-underline" href={`mailto:${restaurant.email}`}>
              Contact
            </a>
            <a className="btn btn-line no-underline" href={`tel:${restaurant.phoneTel}`}>
              Call
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <img
            src={images.contactAmbience}
            alt="Warm restaurant dining room at Pizza House"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-3 flex flex-col items-start justify-end rounded-[1rem] border border-white/20 bg-ink/40 p-4 text-cream no-underline backdrop-blur-[2px] sm:inset-8 sm:rounded-[1.4rem] sm:p-6"
          >
            <p className="text-xs tracking-[0.2em] text-gold uppercase">Google Maps</p>
            <p className="font-display mt-2 text-2xl sm:text-3xl">Find us in Main Market</p>
            <p className="mt-2 text-sm text-cream/70">{restaurant.mapsQuery}</p>
            <span className="btn btn-gold mt-5">Open map</span>
          </a>
        </div>
      </div>
    </SectionReveal>
  );
}

import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { useContent } from "../context/ContentContext";
import { phoneHref } from "../utils/format";
import SectionReveal from "./SectionReveal";

export default function Contact() {
  const { restaurant, images } = useContent();
  const callHref = phoneHref(restaurant.phoneDisplay || restaurant.phoneTel);
  return (
    <SectionReveal id="contact" className="scroll-mt-20 bg-paper py-10 sm:py-14" variant="up" aria-labelledby="contact-heading">
      <div className="container-site grid overflow-hidden rounded-xl bg-cream sm:rounded-2xl lg:grid-cols-2">
        <div className="p-4 sm:p-6 md:p-8">
          <p className="text-[0.6rem] font-bold tracking-[0.2em] text-tomato uppercase sm:text-[0.65rem]">Visit us</p>
          <h2 id="contact-heading" className="font-display mt-2 text-[clamp(1.7rem,4vw,2.5rem)] text-ink">
            {restaurant.shortName}
          </h2>
          <address className="mt-4 not-italic">
            <p className="flex items-start gap-2.5 text-sm text-ink sm:text-base">
              <FiMapPin className="mt-0.5 text-gold" aria-hidden="true" />
              <span>
                {restaurant.addressLine1}
                <br />
                {restaurant.addressLine2}
              </span>
            </p>
          </address>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <FiPhone className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] tracking-[0.14em] text-muted uppercase">Phone</dt>
                <dd>
                  <a className="text-ink no-underline hover:text-tomato" href={callHref}>
                    {restaurant.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <FiMail className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] tracking-[0.14em] text-muted uppercase">Email</dt>
                <dd>
                  <a className="text-ink no-underline hover:text-tomato" href={`mailto:${restaurant.email}`}>
                    {restaurant.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <FiClock className="text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] tracking-[0.14em] text-muted uppercase">Opening hours</dt>
                <dd className="text-ink">
                  {restaurant.hoursTitle}
                  <br />
                  {restaurant.hoursTime}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a className="btn btn-gold no-underline" href={`mailto:${restaurant.email}`}>
              Contact
            </a>
            <a className="btn btn-line no-underline" href={callHref}>
              Call
            </a>
          </div>
        </div>

        <div className="relative min-h-[260px]">
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
            className="absolute inset-2.5 flex flex-col items-start justify-end rounded-lg border border-white/20 bg-ink/40 p-3.5 text-cream no-underline backdrop-blur-[2px] sm:inset-5 sm:rounded-xl sm:p-5"
          >
            <p className="text-[0.65rem] tracking-[0.16em] text-gold uppercase">Google Maps</p>
            <p className="font-display mt-1.5 text-xl sm:text-2xl">Find us in Main Market</p>
            <p className="mt-1.5 text-xs text-cream/70">{restaurant.mapsQuery}</p>
            <span className="btn btn-gold mt-4">Open map</span>
          </a>
        </div>
      </div>
    </SectionReveal>
  );
}

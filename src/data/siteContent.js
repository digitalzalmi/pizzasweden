import { restaurant } from "./restaurant.js";
import { menu, menuCategories } from "./menu.js";
import { heroSlides, houseSlides, offerSlides } from "./banners.js";
import { images } from "./images.js";
import { offers } from "./offers.js";
import { testimonials, testimonialsNote } from "./testimonials.js";
import { features } from "./features.js";
import { services } from "./services.js";
import { builderOptions } from "./builder.js";

export function getDefaultContent() {
  return structuredClone({
    restaurant,
    menu,
    menuCategories,
    heroSlides,
    houseSlides,
    offerSlides,
    images,
    offers,
    testimonials,
    testimonialsNote,
    features,
    services,
    builderOptions,
  });
}

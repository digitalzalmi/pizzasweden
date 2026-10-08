export const LOCALES = [
  { code: "en", label: "EN", native: "English" },
  { code: "sv", label: "SV", native: "Svenska" },
];

export const STORAGE_KEY = "pizza-house-locale";

/** UI chrome + shared labels (EN / SV) */
export const ui = {
  en: {
    skipLink: "Skip to content",
    navAria: "Primary",
    searchMenu: "Search the menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    contact: "Contact",
    call: "Call",
    exploreMenu: "Explore Menu",
    contactUs: "Contact Us",
    findUs: "Find us",
    hours: "Hours",
    menuEyebrow: "Full kitchen list",
    menuHeading: "OUR MENU",
    menuIntro:
      "Pizza, family trays, pasta, burgers, salads, and rolls — pick a category. Prices in Swedish kronor (SEK).",
    showingResults: "Showing results for",
    clearSearch: "Clear search",
    menuEmpty: "Nothing in this category matches the current search. Try another filter.",
    menuCategoriesAria: "Menu categories",
    soldOut: "Sold out",
    ourStory: "Our story",
    visitUs: "Visit us",
    phone: "Phone",
    email: "Email",
    openingHours: "Opening hours",
    googleMaps: "Google Maps",
    findUsMarket: "Find us here",
    openMap: "Open map",
    howWeServe: "How we serve",
    servicesHeading: "Table, box, or doorstep",
    servicesIntro: "Same oven, four ways to eat. Choose the service that fits the night.",
    guestNotes: "Guest notes",
    reviewsHeading: "What the table says",
    chooseReview: "Choose a review",
    starsOutOf: "out of 5 stars",
    featuresAria: "Why guests choose Slice of Prima",
    askAboutDeal: "Ask about this deal",
    theHouse: "The house",
    moreThanMenu: "More than a menu",
    quickLinks: "Quick Links",
    footerHours: "Opening Hours",
    footerContact: "Contact",
    ownerLogin: "Owner login",
    searchTitle: "Search the menu",
    searchPlaceholder: "Search pizza, pasta, burger, salad, rolls…",
    searchEmpty: "No menu items match that search.",
    closeSearch: "Close search",
    language: "Language",
    nav: {
      home: "Home",
      menu: "Menu",
      offers: "Offers",
      about: "About",
      contact: "Contact",
    },
    categories: {
      All: "All",
      Pizza: "Pizza",
      "Family Pizza": "Family Pizza",
      Pasta: "Pasta",
      Burger: "Burger",
      Salad: "Salad",
      "Chicken Rolls": "Chicken Rolls",
      "Kebab Rolls": "Kebab Rolls",
    },
  },
  sv: {
    skipLink: "Hoppa till innehållet",
    navAria: "Huvudmeny",
    searchMenu: "Sök i menyn",
    openMenu: "Öppna meny",
    closeMenu: "Stäng meny",
    contact: "Kontakt",
    call: "Ring",
    exploreMenu: "Se menyn",
    contactUs: "Kontakta oss",
    findUs: "Hitta hit",
    hours: "Öppettider",
    menuEyebrow: "Hela köket",
    menuHeading: "VÅR MENY",
    menuIntro:
      "Pizza, familjepizza, pasta, burgers, sallader och wraps — välj en kategori. Priser i svenska kronor (SEK).",
    showingResults: "Visar resultat för",
    clearSearch: "Rensa sökning",
    menuEmpty: "Inget i den här kategorin matchar sökningen. Prova ett annat filter.",
    menuCategoriesAria: "Menykategorier",
    soldOut: "Slutsåld",
    ourStory: "Vår historia",
    visitUs: "Besök oss",
    phone: "Telefon",
    email: "E-post",
    openingHours: "Öppettider",
    googleMaps: "Google Maps",
    findUsMarket: "Hitta oss här",
    openMap: "Öppna karta",
    howWeServe: "Så serverar vi",
    servicesHeading: "Bord, låda eller dörr",
    servicesIntro: "Samma ugn, fyra sätt att äta. Välj det som passar kvällen.",
    guestNotes: "Gästernas ord",
    reviewsHeading: "Vad bordet säger",
    chooseReview: "Välj en recension",
    starsOutOf: "av 5 stjärnor",
    featuresAria: "Därför väljer gäster Slice of Prima",
    askAboutDeal: "Fråga om erbjudandet",
    theHouse: "Huset",
    moreThanMenu: "Mer än en meny",
    quickLinks: "Snabblänkar",
    footerHours: "Öppettider",
    footerContact: "Kontakt",
    ownerLogin: "Ägarinloggning",
    searchTitle: "Sök i menyn",
    searchPlaceholder: "Sök pizza, pasta, burger, sallad, wraps…",
    searchEmpty: "Inga rätter matchar sökningen.",
    closeSearch: "Stäng sökning",
    language: "Språk",
    nav: {
      home: "Hem",
      menu: "Meny",
      offers: "Erbjudanden",
      about: "Om oss",
      contact: "Kontakt",
    },
    categories: {
      All: "Alla",
      Pizza: "Pizza",
      "Family Pizza": "Familjepizza",
      Pasta: "Pasta",
      Burger: "Burger",
      Salad: "Sallad",
      "Chicken Rolls": "Kycklingrullar",
      "Kebab Rolls": "Kebabrolls",
    },
  },
};

/**
 * Pick a localized field from content objects.
 * Uses `keySv` when locale is Swedish, otherwise `key`.
 */
export function pickLocalized(obj, key, locale = "en") {
  if (!obj) return "";
  if (locale === "sv") {
    const svKey = `${key}Sv`;
    const sv = obj[svKey];
    if (Array.isArray(sv) && sv.length) return sv;
    if (typeof sv === "string" && sv.trim()) return sv;
  }
  const value = obj[key];
  if (value == null) return "";
  return value;
}

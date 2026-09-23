/**
 * ============================================
 * OFFERS / DEALS — edit promotions here
 * ============================================
 * The first offer is used in the featured banner.
 * `cartItem` is what gets added when a guest taps ORDER DEAL.
 */
export const offers = [
  {
    id: "weekend-deal",
    kicker: "Saturday & Sunday",
    title: "WEEKEND PIZZA DEAL",
    headline: "2 Medium Pizzas + 2 Drinks",
    description:
      "Pick any two medium pies from the classic or chicken list, add two regular drinks, and keep the table happy without emptying the wallet.",
    price: 1999,
    originalPrice: 2598,
    cta: "ORDER DEAL",
    note: "Dine-in, takeaway, and delivery. Add-ons billed separately.",
    includes: ["Any 2 medium pizzas", "2 regular drinks", "Garlic dip on the house"],
    image: "/images/offer.jpg",
    cartItem: {
      name: "Weekend Pizza Deal",
      size: "2 × Medium",
      price: 1999,
      image: "/images/offer.jpg",
    },
  },
];

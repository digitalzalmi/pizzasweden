/** Format a number as Swedish kronor, e.g. 109 → "109 kr" */
export function formatPrice(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
}

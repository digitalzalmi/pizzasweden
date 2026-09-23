/** Format a number as Pakistani Rupees, e.g. 1099 → "Rs. 1,099" */
export function formatPrice(amount) {
  const value = Number(amount) || 0;
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export function createCartId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

import { formatPrice } from "./format";

export function buildWhatsAppUrl(number, text) {
  const digits = String(number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function buildOrderMessage({ restaurant, customer, items, total }) {
  const lines = [
    `Order from ${restaurant.shortName}`,
    "",
    ...items.map((item) => {
      const extras = item.extras?.length ? ` (${item.extras.join(", ")})` : "";
      return `• ${item.quantity}× ${item.name} — ${item.size}${extras} — ${formatPrice(item.price * item.quantity)}`;
    }),
    "",
    `Total: ${formatPrice(total)}`,
  ];

  if (customer?.name || customer?.phone || customer?.address) {
    lines.push("", "Customer");
    if (customer.name) lines.push(`Name: ${customer.name}`);
    if (customer.phone) lines.push(`Phone: ${customer.phone}`);
    if (customer.address) lines.push(`Address: ${customer.address}`);
  }

  lines.push("", restaurant.addressLine1, restaurant.phoneDisplay);
  return lines.join("\n");
}

import { getDefaultContent } from "../src/data/siteContent.js";

export function mergeContent(base, extra) {
  if (Array.isArray(extra)) return extra;
  if (extra && typeof extra === "object" && base && typeof base === "object" && !Array.isArray(base)) {
    const out = { ...base };
    for (const key of Object.keys(extra)) {
      out[key] = mergeContent(base[key], extra[key]);
    }
    return out;
  }
  return extra ?? base;
}

export function syncDerivedFields(content) {
  const restaurant = content.restaurant || {};
  const phone = restaurant.phoneDisplay || restaurant.phoneTel || "";
  restaurant.phoneDisplay = phone;
  restaurant.phoneTel = String(phone).replace(/[^\d+]/g, "");
  content.restaurant = restaurant;
  return content;
}

export function normalizeContent(incoming) {
  const content = mergeContent(getDefaultContent(), incoming || {});
  return syncDerivedFields(content);
}

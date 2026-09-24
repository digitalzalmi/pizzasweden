import { getSession, json } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }
  if (!getSession(req)) return json(res, 401, { error: "Please log in." });
  return json(res, 200, { ok: true });
}

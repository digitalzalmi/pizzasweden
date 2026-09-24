import { clearSessionCookie, json } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }
  return json(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
}

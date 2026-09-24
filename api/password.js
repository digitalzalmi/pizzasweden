import { getSession, hashPassword, json, readBody, verifyPassword } from "./_lib/auth.js";
import { ADMIN_PATH, readGithubJson, writeGithubJson } from "./_lib/github.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }
  try {
    if (!getSession(req)) return json(res, 401, { error: "Please log in." });
    const body = req.body ?? (await readBody(req));
    const current = String(body?.current || "");
    const next = String(body?.next || "");

    let stored = null;
    try {
      stored = (await readGithubJson(ADMIN_PATH)).value;
    } catch {
      stored = null;
    }

    if (!verifyPassword(current, stored)) {
      return json(res, 401, { error: "Current password is wrong." });
    }
    if (next.length < 8) {
      return json(res, 400, { error: "New password must be at least 8 characters." });
    }

    await writeGithubJson(ADMIN_PATH, hashPassword(next), "Update Pizza House admin password.");
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, { error: error.message || "Password update failed." });
  }
}

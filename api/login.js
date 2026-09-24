import { json, readBody, sessionCookie, verifyPassword } from "./_lib/auth.js";
import { ADMIN_PATH, readGithubJson } from "./_lib/github.js";

const attempts = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
    if (tooMany(ip)) {
      return json(res, 429, { error: "Too many attempts. Wait a few minutes and try again." });
    }

    const body = req.body ?? (await readBody(req));
    const password = String(body?.password || "");
    let stored = null;
    try {
      if (process.env.GITHUB_TOKEN) {
        const file = await readGithubJson(ADMIN_PATH);
        stored = file.value;
      }
    } catch {
      stored = null;
    }

    if (!verifyPassword(password, stored)) {
      record(ip);
      return json(res, 401, { error: "Wrong password." });
    }

    attempts.delete(ip);
    return json(res, 200, { ok: true }, { "Set-Cookie": sessionCookie() });
  } catch (error) {
    return json(res, 500, { error: error.message || "Login failed." });
  }
}

function tooMany(ip) {
  const row = attempts.get(ip);
  if (!row) return false;
  if (Date.now() - row.start > 15 * 60 * 1000) {
    attempts.delete(ip);
    return false;
  }
  return row.count >= 8;
}

function record(ip) {
  const row = attempts.get(ip);
  if (!row || Date.now() - row.start > 15 * 60 * 1000) {
    attempts.set(ip, { start: Date.now(), count: 1 });
    return;
  }
  row.count += 1;
}

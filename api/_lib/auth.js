import { createHmac, timingSafeEqual, scryptSync, randomBytes, createHash } from "node:crypto";

const COOKIE = "ph_admin";
const DAY = 24 * 60 * 60 * 1000;

function secret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "pizzahouse-session";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "pizzahouse";
}

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession(req) {
  const cookies = parseCookies(req);
  return verify(cookies[COOKIE]);
}

export function sessionCookie() {
  const token = sign({ exp: Date.now() + 7 * DAY });
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function verifyPassword(password, stored) {
  if (stored?.salt && stored?.hash) {
    const hashed = scryptSync(String(password), stored.salt, 32);
    const expected = Buffer.from(stored.hash, "hex");
    return hashed.length === expected.length && timingSafeEqual(hashed, expected);
  }
  return safeEqual(password, adminPassword());
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    timingSafeEqual(createHash("sha256").update(left).digest(), createHash("sha256").update(right).digest());
    return false;
  }
  return timingSafeEqual(left, right);
}

export function json(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return null;
  return JSON.parse(raw);
}

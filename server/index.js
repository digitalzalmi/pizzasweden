import { createServer } from "node:http";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { getDefaultContent } from "../src/data/siteContent.js";
import { normalizeContent } from "../shared/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isDev = process.argv.includes("--dev");
const port = Number(process.env.PORT) || 5173;
const dataDir = join(root, "data");
const uploadsDir = join(root, "public", "uploads");
const contentPath = join(root, "public", "content.json");
const adminPath = join(dataDir, "admin.json");
const cookieName = "ph_admin";
const sessionDays = 7;

loadEnv(join(root, ".env"));
mkdirSync(uploadsDir, { recursive: true });
mkdirSync(dataDir, { recursive: true });

const sessions = new Map();
const loginAttempts = new Map();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = safeExt(file.originalname);
      cb(null, `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = safeExt(file.originalname);
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (!allowed.includes(ext) || !String(file.mimetype).startsWith("image/")) {
      cb(new Error("Please upload a JPG, PNG, WebP, or GIF image."));
      return;
    }
    cb(null, true);
  },
});

app.get("/api/content", (_req, res) => {
  res.json({ content: readContent() });
});

app.get("/api/session", (req, res) => {
  if (!getSession(req)) {
    res.status(401).json({ error: "Please log in." });
    return;
  }
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const ip = req.ip || "local";
  if (tooManyAttempts(ip)) {
    res.status(429).json({ error: "Too many attempts. Wait a few minutes and try again." });
    return;
  }

  const password = String(req.body?.password || "");
  if (!verifyPassword(password)) {
    recordAttempt(ip);
    res.status(401).json({ error: "Wrong password." });
    return;
  }

  loginAttempts.delete(ip);
  const token = randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + sessionDays * 24 * 60 * 60 * 1000);
  res.cookie(cookieName, token, cookieOptions());
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  const token = req.cookies?.[cookieName];
  if (token) sessions.delete(token);
  res.clearCookie(cookieName, { path: "/" });
  res.json({ ok: true });
});

app.post("/api/password", (req, res) => {
  if (!getSession(req)) {
    res.status(401).json({ error: "Please log in." });
    return;
  }
  const current = String(req.body?.current || "");
  const next = String(req.body?.next || "");
  if (!verifyPassword(current)) {
    res.status(401).json({ error: "Current password is wrong." });
    return;
  }
  if (next.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters." });
    return;
  }
  writeJson(adminPath, hashPassword(next));
  res.json({ ok: true });
});

app.put("/api/content", (req, res) => {
  if (!getSession(req)) {
    res.status(401).json({ error: "Please log in." });
    return;
  }
  const incoming = req.body;
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    res.status(400).json({ error: "Invalid content." });
    return;
  }
  const content = normalizeContent(incoming);
  writeJson(contentPath, content);
  res.json({ content });
});

app.post("/api/upload", (req, res) => {
  if (!getSession(req)) {
    res.status(401).json({ error: "Please log in." });
    return;
  }

  if (req.is("application/json") && req.body?.data) {
    try {
      const ext = safeExt(req.body.name || "upload.jpg");
      const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      if (!allowed.includes(ext)) {
        res.status(400).json({ error: "Please upload a JPG, PNG, WebP, or GIF image." });
        return;
      }
      const buffer = Buffer.from(String(req.body.data), "base64");
      if (buffer.length > 8 * 1024 * 1024) {
        res.status(400).json({ error: "Image must be under 8 MB." });
        return;
      }
      const filename = `${Date.now()}-${randomBytes(4).toString("hex")}${ext === ".jpeg" ? ".jpg" : ext}`;
      writeFileSync(join(uploadsDir, filename), buffer);
      res.json({ url: `/uploads/${filename}` });
    } catch (error) {
      res.status(400).json({ error: error.message || "Upload failed." });
    }
    return;
  }

  upload.single("image")(req, res, (error) => {
    if (error) {
      res.status(400).json({ error: error.message || "Upload failed." });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "Choose an image to upload." });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

const httpServer = createServer(app);

if (isDev) {
  const vite = await import("vite");
  const viteServer = await vite.createServer({
    root,
    appType: "spa",
    server: { middlewareMode: true },
  });
  app.use(viteServer.middlewares);
} else {
  const dist = join(root, "dist");
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    res.sendFile(join(dist, "index.html"));
  });
}

httpServer.listen(port, () => {
  console.log(`Pizza House ${isDev ? "dev" : "server"} running on http://localhost:${port}`);
  if (isDev) console.log("Owner panel: http://localhost:" + port + "/admin");
});

function readContent() {
  if (!existsSync(contentPath)) return getDefaultContent();
  try {
    return normalizeContent(JSON.parse(readFileSync(contentPath, "utf8")));
  } catch {
    return getDefaultContent();
  }
}

function getSession(req) {
  const token = req.cookies?.[cookieName];
  if (!token) return null;
  const expires = sessions.get(token);
  if (!expires || expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return true;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "1",
    maxAge: sessionDays * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function defaultPassword() {
  return process.env.ADMIN_PASSWORD || "pizzahouse";
}

function verifyPassword(password) {
  if (existsSync(adminPath)) {
    try {
      const stored = JSON.parse(readFileSync(adminPath, "utf8"));
      if (stored?.salt && stored?.hash) return checkHash(password, stored.salt, stored.hash);
    } catch {
      return false;
    }
  }
  return safeEqual(password, defaultPassword());
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

function checkHash(password, salt, hash) {
  const hashed = scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, "hex");
  return hashed.length === expected.length && timingSafeEqual(hashed, expected);
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

function tooManyAttempts(ip) {
  const row = loginAttempts.get(ip);
  if (!row) return false;
  if (Date.now() - row.start > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
    return false;
  }
  return row.count >= 8;
}

function recordAttempt(ip) {
  const row = loginAttempts.get(ip);
  if (!row || Date.now() - row.start > 15 * 60 * 1000) {
    loginAttempts.set(ip, { start: Date.now(), count: 1 });
    return;
  }
  row.count += 1;
}

function safeExt(name) {
  const ext = extname(String(name || "")).toLowerCase();
  if (ext === ".jpeg") return ".jpg";
  return ext || ".jpg";
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2));
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null) process.env[key] = value;
  }
}

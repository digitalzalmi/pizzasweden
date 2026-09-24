import { extname } from "node:path";
import { randomBytes } from "node:crypto";
import { getSession, json, readBody } from "./_lib/auth.js";
import { writeGithubBinary } from "./_lib/github.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    if (!getSession(req)) return json(res, 401, { error: "Please log in." });
    const body = req.body ?? (await readBody(req));
    const name = String(body?.name || "upload.jpg");
    const type = String(body?.type || "");
    const data = String(body?.data || "");
    if (!data) return json(res, 400, { error: "Choose an image to upload." });

    const ext = safeExt(name);
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (!allowed.includes(ext) || (type && !type.startsWith("image/"))) {
      return json(res, 400, { error: "Please upload a JPG, PNG, WebP, or GIF image." });
    }

    const buffer = Buffer.from(data, "base64");
    if (buffer.length > 8 * 1024 * 1024) {
      return json(res, 400, { error: "Image must be under 8 MB." });
    }

    const filename = `${Date.now()}-${randomBytes(4).toString("hex")}${ext === ".jpeg" ? ".jpg" : ext}`;
    const filePath = `public/uploads/${filename}`;
    const url = await writeGithubBinary(filePath, buffer, `Upload ${filename} from Pizza House admin.`);
    return json(res, 200, { url });
  } catch (error) {
    return json(res, 500, { error: error.message || "Upload failed." });
  }
}

function safeExt(name) {
  const ext = extname(String(name || "")).toLowerCase();
  if (ext === ".jpeg") return ".jpg";
  return ext || ".jpg";
}

import { getDefaultContent } from "../src/data/siteContent.js";
import { normalizeContent } from "../shared/content.mjs";

async function loadContent() {
  if (!process.env.GITHUB_TOKEN) {
    return normalizeContent(getDefaultContent());
  }
  const { readGithubJson, CONTENT_PATH } = await import("./_lib/github.js");
  const { value } = await readGithubJson(CONTENT_PATH);
  return normalizeContent(value || getDefaultContent());
}

export default async function handler(req, res) {
  const { getSession, json, readBody } = await import("./_lib/auth.js");
  try {
    if (req.method === "GET") {
      const content = await loadContent();
      return json(res, 200, { content });
    }

    if (req.method === "PUT") {
      if (!getSession(req)) return json(res, 401, { error: "Please log in." });
      if (!process.env.GITHUB_TOKEN) {
        return json(res, 500, {
          error:
            "GITHUB_TOKEN is missing. Add it in Vercel → Project → Settings → Environment Variables so admin saves can be stored.",
        });
      }
      const { CONTENT_PATH, writeGithubJson } = await import("./_lib/github.js");
      const incoming = req.body ?? (await readBody(req));
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        return json(res, 400, { error: "Invalid content." });
      }
      const content = normalizeContent(incoming);
      await writeGithubJson(CONTENT_PATH, content, "Update Pizza House website content from owner admin.");
      return json(res, 200, { content });
    }

    res.setHeader("Allow", "GET, PUT");
    return json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Content request failed." });
  }
}

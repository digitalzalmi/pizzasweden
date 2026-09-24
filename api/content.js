import { getDefaultContent } from "../src/data/siteContent.js";
import { normalizeContent } from "../shared/content.mjs";

const REPO = process.env.GITHUB_REPO || "digitalzalmi/pizzasweden";
const BRANCH = process.env.GITHUB_BRANCH || "main";

async function loadContent() {
  if (process.env.GITHUB_TOKEN) {
    try {
      const { readGithubJson, CONTENT_PATH } = await import("./_lib/github.js");
      const { value } = await readGithubJson(CONTENT_PATH);
      if (value) return normalizeContent(value);
    } catch {
      // fall through to raw/public defaults
    }
  }

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/content.json?t=${Date.now()}`,
      { cache: "no-store" },
    );
    if (response.ok) return normalizeContent(await response.json());
  } catch {
    // ignore
  }

  return normalizeContent(getDefaultContent());
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
            "Add GITHUB_TOKEN in Vercel → Project Settings → Environment Variables (repo Contents permission), then redeploy. Until then, admin changes cannot be stored on the live site.",
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

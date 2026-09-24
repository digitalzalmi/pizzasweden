const CONTENT_PATH = "public/content.json";
const ADMIN_PATH = "data/admin.json";

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "digitalzalmi/pizzasweden";
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is missing. Add it in Vercel → Project → Settings → Environment Variables so admin saves can be stored.",
    );
  }
  return { token, repo, branch };
}

async function github(path, options = {}) {
  const { token } = config();
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `GitHub error (${response.status})`);
  }
  return data;
}

export async function readGithubJson(filePath) {
  const { repo, branch } = config();
  try {
    const data = await github(`/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`);
    const json = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
    return { value: JSON.parse(json), sha: data.sha };
  } catch (error) {
    if (String(error.message).includes("Not Found")) return { value: null, sha: null };
    throw error;
  }
}

export async function writeGithubJson(filePath, value, message) {
  const { repo, branch } = config();
  const current = await readGithubJson(filePath);
  const body = {
    message,
    content: Buffer.from(JSON.stringify(value, null, 2), "utf8").toString("base64"),
    branch,
  };
  if (current.sha) body.sha = current.sha;
  await github(`/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function writeGithubBinary(filePath, buffer, message) {
  const { repo, branch } = config();
  let sha = null;
  try {
    const existing = await github(`/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`);
    sha = existing.sha;
  } catch {
    sha = null;
  }
  const body = {
    message,
    content: Buffer.from(buffer).toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;
  await github(`/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return rawUrl(filePath);
}

export function rawUrl(filePath) {
  const { repo, branch } = config();
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
}

export { CONTENT_PATH, ADMIN_PATH };

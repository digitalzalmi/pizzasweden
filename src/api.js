async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(path, {
      credentials: "include",
      ...options,
      headers,
    });
  } catch {
    throw new Error("Could not reach the server. Admin saves need the API to be available.");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "The save API is not available on this host yet. After the latest deploy, add GITHUB_TOKEN in Vercel env settings.",
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function fetchContent() {
  try {
    return await request("/api/content");
  } catch {
    const response = await fetch("/content.json", { credentials: "omit" });
    if (!response.ok) throw new Error("Could not load website content.");
    const content = await response.json();
    return { content };
  }
}

export function saveContent(content) {
  return request("/api/content", {
    method: "PUT",
    body: JSON.stringify(content),
  });
}

export function fetchSession() {
  return request("/api/session");
}

export function login(password) {
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function logout() {
  return request("/api/logout", { method: "POST" });
}

export function changePassword(current, next) {
  return request("/api/password", {
    method: "POST",
    body: JSON.stringify({ current, next }),
  });
}

export async function uploadImage(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const data = await request("/api/upload", {
    method: "POST",
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      data: btoa(binary),
    }),
  });
  return data.url;
}

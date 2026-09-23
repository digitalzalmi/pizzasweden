async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export function fetchContent() {
  return request("/api/content");
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
  const body = new FormData();
  body.append("image", file);
  const data = await request("/api/upload", {
    method: "POST",
    body,
  });
  return data.url;
}

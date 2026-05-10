const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = typeof options.getToken === "function" ? await options.getToken() : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const { getToken, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...fetchOptions
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Request failed");
  }

  return response.json();
}

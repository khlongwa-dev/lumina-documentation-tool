const BASE = "/api";

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail?.message || err?.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  generate: (command, input) =>
    request("POST", "/generate/", { command, input }),

  history: () =>
    request("GET", "/transactions/history"),

  returnLatest: () =>
    request("GET", "/transactions/return"),

  returnById: (id) =>
    request("GET", `/transactions/return/${id}`),

  logLatest: () =>
    request("GET", "/transactions/log"),

  logById: (id) =>
    request("GET", `/transactions/log/${id}`),
};
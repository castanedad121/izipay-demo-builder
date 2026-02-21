const API = import.meta.env.VITE_API_URL;

export async function get(path) {
  const r = await fetch(`${API}${path}`);
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

export async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

export async function put(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

export async function del(path) {
  const r = await fetch(`${API}${path}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

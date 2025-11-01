const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPatch(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

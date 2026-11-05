export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

/** The one way the web app talks to the API. Never call fetch() directly from components. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.code ?? 'UNKNOWN', body?.error?.message ?? res.statusText);
  }
  return body as T;
}

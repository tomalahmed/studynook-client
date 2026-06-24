/**
 * API client — browser uses Next rewrites to Express; server uses getApiUrl().
 */
import { getApiUrl } from "@/lib/app-env";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function getApiBase() {
  if (typeof window !== "undefined") {
    return "";
  }
  return getApiUrl();
}

export async function api(path, options = {}) {
  const { body, headers = {}, ...rest } = options;
  const url = `${getApiBase()}/api${path}`;

  const res = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body != null ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.error || res.statusText || "Request failed", res.status);
  }

  return data;
}

export const roomsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") {
        if (Array.isArray(value)) {
          qs.set(key, value.join(","));
        } else {
          qs.set(key, String(value));
        }
      }
    });
    const query = qs.toString();
    return api(`/rooms${query ? `?${query}` : ""}`);
  },
  latest: () => api("/rooms/latest"),
  mine: () => api("/rooms/mine"),
  get: (id) => api(`/rooms/${id}`),
  create: (body) => api("/rooms", { method: "POST", body }),
  update: (id, body) => api(`/rooms/${id}`, { method: "PUT", body }),
  remove: (id) => api(`/rooms/${id}`, { method: "DELETE" }),
};

export const bookingsApi = {
  mine: () => api("/bookings/mine"),
  create: (body) => api("/bookings", { method: "POST", body }),
  cancel: (id) => api(`/bookings/${id}/cancel`, { method: "PATCH" }),
};

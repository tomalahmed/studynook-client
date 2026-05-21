/**
 * Server-only fetch helpers (direct to Express during SSR).
 */

const API_BASE = process.env.API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function serverFetch(path) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function fetchRoomById(id) {
  const data = await serverFetch(`/rooms/${id}`);
  return data?.room ?? null;
}

export async function fetchLatestRooms() {
  const data = await serverFetch("/rooms/latest");
  return data?.rooms ?? [];
}

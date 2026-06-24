export const FAVORITES_STORAGE_KEY = "studynook-favorites";

export const FAVORITES_CHANGED_EVENT = "studynook-favorites-changed";

function parseIds(raw) {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((id) => String(id)).filter(Boolean);
  } catch {
    return [];
  }
}

export function getFavoriteIds() {
  if (typeof window === "undefined") {
    return [];
  }
  return parseIds(localStorage.getItem(FAVORITES_STORAGE_KEY));
}

export function isFavorite(roomId) {
  if (roomId == null) {
    return false;
  }
  return getFavoriteIds().includes(String(roomId));
}

function persistFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

/** @returns {boolean} true if now favorited, false if removed */
export function toggleFavorite(roomId) {
  const id = String(roomId);
  const ids = getFavoriteIds();

  if (ids.includes(id)) {
    persistFavoriteIds(ids.filter((item) => item !== id));
    return false;
  }

  persistFavoriteIds([...ids, id]);
  return true;
}

export function removeFavorite(roomId) {
  const id = String(roomId);
  persistFavoriteIds(getFavoriteIds().filter((item) => item !== id));
}

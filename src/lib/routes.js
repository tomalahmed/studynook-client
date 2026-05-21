/**
 * App route paths — use these for Link hrefs and redirects so links stay in sync.
 */

export const ROUTES = {
  home: "/",
  rooms: "/rooms",
  about: "/about",
  login: "/login",
  register: "/register",
  addRoom: "/add-room",
  myListings: "/my-listings",
  myBookings: "/my-bookings",
};

export function roomDetails(id) {
  return `${ROUTES.rooms}/${id}`;
}

/** Safe internal post-login redirect (blocks open redirects). */
export function safeCallbackUrl(url) {
  if (!url || typeof url !== "string") {
    return ROUTES.home;
  }
  const trimmed = url.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return ROUTES.home;
  }
  return trimmed;
}

export function loginUrl(callbackUrl) {
  const path = safeCallbackUrl(callbackUrl);
  if (path === ROUTES.home) {
    return ROUTES.login;
  }
  return `${ROUTES.login}?callbackUrl=${encodeURIComponent(path)}`;
}

export function isRoomDetailsPath(pathname) {
  return /^\/rooms\/[^/]+$/.test(pathname);
}

export function isProtectedPath(pathname) {
  return (
    pathname.startsWith(ROUTES.addRoom) ||
    pathname.startsWith(ROUTES.myListings) ||
    pathname.startsWith(ROUTES.myBookings) ||
    isRoomDetailsPath(pathname)
  );
}

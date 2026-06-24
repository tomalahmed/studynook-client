/** Shared local assets under /public/images */

export const DEFAULT_ROOM_IMAGE = "/images/library.png";
export const HERO_BANNER_IMAGE = "/images/Banner.png";
export const LOGIN_IMAGE = "/images/login.png";
export const REGISTER_IMAGE = "/images/register.png";
export const NOT_FOUND_IMAGE = "/images/notfound.png";

/**
 * Normalize room listing/detail image URLs with a local fallback.
 */
export function resolveRoomImage(image) {
  if (image == null || typeof image !== "string") {
    return DEFAULT_ROOM_IMAGE;
  }

  const trimmed = image.trim();
  if (!trimmed) {
    return DEFAULT_ROOM_IMAGE;
  }

  if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
    return trimmed;
  }

  return DEFAULT_ROOM_IMAGE;
}

export function isRemoteImage(src) {
  return typeof src === "string" && src.startsWith("http");
}

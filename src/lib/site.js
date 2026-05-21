/** Site-wide SEO and page titles (assignment: dynamic tab titles). */

export const SITE_NAME = "StudyNook";

const DEFAULT_DESCRIPTION =
  "Browse and book quiet, private study rooms in your library. List your own room and earn.";

export function pageTitle(segment) {
  if (!segment) return SITE_NAME;
  return `${SITE_NAME} – ${segment}`;
}

/**
 * @param {string} segment - e.g. "Home", "Available Rooms"
 * @param {string} [description]
 */
export function createPageMetadata(segment, description = DEFAULT_DESCRIPTION) {
  return {
    title: pageTitle(segment),
    description,
  };
}

export function getMetadataBase() {
  const url =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000";
  try {
    return new URL(url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

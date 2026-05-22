/**
 * Upload a room image via the Next.js API route.
 * @returns {Promise<string>} Public URL path
 */
export async function uploadRoomImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/room-image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
}

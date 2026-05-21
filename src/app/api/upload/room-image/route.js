import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request) {
  const { user, response } = await requireAuth(request);
  if (response) {
    return response;
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP, or GIF image" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller" },
      { status: 400 },
    );
  }

  const ext = EXT_BY_TYPE[file.type] || ".jpg";
  const safeUser = String(user.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8) || "user";
  const filename = `room-${Date.now()}-${safeUser}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");

  await mkdir(uploadsDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  const url = `/images/uploads/${filename}`;

  return NextResponse.json({ url, message: "Image uploaded" });
}

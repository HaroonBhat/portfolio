import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Returns ONLY the public Cloudinary values needed for an unsigned browser upload.
// The API secret is never exposed. If not configured, the admin falls back to
// storing a manual image URL / local preview so the flow still works.
export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";
  const folder = process.env.CLOUDINARY_FOLDER || "portfolio";
  return NextResponse.json({
    configured: Boolean(cloudName && uploadPreset),
    cloudName,
    uploadPreset,
    folder,
  });
}

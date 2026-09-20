"use client";

// Client helpers used by the admin dashboard.

export async function fetchContent(name) {
  const res = await fetch(`/api/admin/content/${name}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${name}`);
  return res.json();
}

export async function saveContent(name, data, message) {
  const res = await fetch(`/api/admin/content/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, message }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Save failed");
  return json;
}

let cloudinaryConfig = null;

export async function getCloudinaryConfig() {
  if (cloudinaryConfig) return cloudinaryConfig;
  const res = await fetch("/api/admin/cloudinary", { cache: "no-store" });
  cloudinaryConfig = await res.json();
  return cloudinaryConfig;
}

// Uploads to Cloudinary via unsigned preset. Returns the secure URL.
// If Cloudinary isn't configured, returns a local object URL so preview works
// (and the admin will warn that the URL is temporary).
export async function uploadImage(file, onProgress) {
  const cfg = await getCloudinaryConfig();

  if (!cfg.configured) {
    return {
      url: URL.createObjectURL(file),
      persisted: false,
    };
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", cfg.uploadPreset);
  if (cfg.folder) form.append("folder", cfg.folder);

  const url = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`;

  const json = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Cloudinary upload failed"));
    xhr.send(form);
  });

  return { url: json.secure_url, persisted: true };
}

"use client";

import { useRef, useState } from "react";
import { uploadImage } from "./lib";

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [warn, setWarn] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setProgress(0);
    setWarn("");
    try {
      const { url, persisted } = await uploadImage(file, setProgress);
      onChange(url);
      if (!persisted) {
        setWarn(
          "Cloudinary not configured — this is a temporary local preview. Set CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET, or paste an image URL below."
        );
      }
    } catch (e) {
      setWarn(e.message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="uploader">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="uploader-preview"
          src={value || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>"}
          alt="preview"
        />
        <div style={{ flex: 1 }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            className="btn-a ghost small"
            onClick={() => inputRef.current?.click()}
          >
            {progress != null ? `Uploading ${progress}%` : "Upload image"}
          </button>
          <input
            className="input"
            style={{ marginTop: 10 }}
            placeholder="or paste an image URL"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {warn && (
            <div style={{ color: "#fbbf24", fontSize: "0.8rem", marginTop: 8 }}>
              {warn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

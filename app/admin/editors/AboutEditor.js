"use client";

import { useEffect, useState } from "react";
import { fetchContent, saveContent } from "../lib";
import ImageUploader from "../ImageUploader";

export default function AboutEditor() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchContent("about");
        setData(res.data || {});
      } catch (e) {
        setStatus({ type: "err", msg: e.message });
      }
    })();
  }, []);

  function set(key, val) {
    setData((d) => ({ ...d, [key]: val }));
  }
  function setStat(i, key, val) {
    const stats = [...(data.stats || [])];
    stats[i] = { ...stats[i], [key]: val };
    set("stats", stats);
  }
  function setSocial(key, val) {
    set("socials", { ...(data.socials || {}), [key]: val });
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveContent("about", data, "chore: update about");
      setStatus({
        type: "ok",
        msg: result.mode === "github" ? "Saved & committed to GitHub ✓" : "Saved locally ✓",
      });
    } catch (e) {
      setStatus({ type: "err", msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p style={{ color: "#6f6f7a" }}>Loading…</p>;

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">About</h1>
          <p className="admin-sub">Your personal info, bio, portrait, and stats.</p>
        </div>
        <button className="btn-a primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {status && <div className={`admin-banner ${status.type}`}>{status.msg}</div>}

      <div className="admin-card">
        <div className="grid-2">
          <div className="field">
            <label>Name</label>
            <input className="input" value={data.name || ""} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="field">
            <label>Location</label>
            <input className="input" value={data.location || ""} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Email</label>
          <input className="input" value={data.email || ""} onChange={(e) => set("email", e.target.value)} />
        </div>

        <div className="field">
          <label>Tagline (hero)</label>
          <input className="input" value={data.tagline || ""} onChange={(e) => set("tagline", e.target.value)} />
        </div>

        <div className="field">
          <label>Headline (about section)</label>
          <textarea className="textarea" value={data.headline || ""} onChange={(e) => set("headline", e.target.value)} />
        </div>

        <div className="field">
          <label>Bio — paragraph 1</label>
          <textarea className="textarea" value={data.bioPrimary || ""} onChange={(e) => set("bioPrimary", e.target.value)} />
        </div>
        <div className="field">
          <label>Bio — paragraph 2</label>
          <textarea className="textarea" value={data.bioSecondary || ""} onChange={(e) => set("bioSecondary", e.target.value)} />
        </div>

        <ImageUploader label="Portrait / hero image" value={data.portrait} onChange={(url) => set("portrait", url)} />
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 14 }}>Stats</h3>
        {(data.stats || []).map((s, i) => (
          <div className="grid-2" key={i}>
            <div className="field">
              <label>Value</label>
              <input className="input" value={s.value || ""} onChange={(e) => setStat(i, "value", e.target.value)} />
            </div>
            <div className="field">
              <label>Label</label>
              <input className="input" value={s.label || ""} onChange={(e) => setStat(i, "label", e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 14 }}>Social links</h3>
        <div className="field">
          <label>LinkedIn</label>
          <input className="input" value={data.socials?.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} />
        </div>
        <div className="field">
          <label>GitHub</label>
          <input className="input" value={data.socials?.github || ""} onChange={(e) => setSocial("github", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

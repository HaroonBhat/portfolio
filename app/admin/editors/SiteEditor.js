"use client";

import { useEffect, useState } from "react";
import { fetchContent, saveContent } from "../lib";

export default function SiteEditor() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [marqueeInput, setMarqueeInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchContent("site");
        setData(res.data || {});
      } catch (e) {
        setStatus({ type: "err", msg: e.message });
      }
    })();
  }, []);

  function set(key, val) {
    setData((d) => ({ ...d, [key]: val }));
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveContent("site", data, "chore: update site settings");
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

  function addMarquee() {
    const t = marqueeInput.trim();
    if (!t) return;
    set("marquee", [...(data.marquee || []), t]);
    setMarqueeInput("");
  }

  if (!data) return <p style={{ color: "#6f6f7a" }}>Loading…</p>;

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Site Settings</h1>
          <p className="admin-sub">Global settings, SEO, hero mode, and marquee.</p>
        </div>
        <button className="btn-a primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {status && <div className={`admin-banner ${status.type}`}>{status.msg}</div>}

      <div className="admin-card">
        <div className="field">
          <label>Site title (SEO)</label>
          <input className="input" value={data.siteTitle || ""} onChange={(e) => set("siteTitle", e.target.value)} />
        </div>
        <div className="field">
          <label>Site description (SEO)</label>
          <textarea className="textarea" value={data.siteDescription || ""} onChange={(e) => set("siteDescription", e.target.value)} />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Availability text</label>
            <input className="input" value={data.availability || ""} onChange={(e) => set("availability", e.target.value)} />
          </div>
          <div className="field">
            <label>Year (hero)</label>
            <input className="input" value={data.year || ""} onChange={(e) => set("year", e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Hero mode</label>
          <select className="select" value={data.heroMode || "anonymous"} onChange={(e) => set("heroMode", e.target.value)}>
            <option value="anonymous">Anonymous (shows “Anonymous Dev”)</option>
            <option value="name">Show my name</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 14 }}>Hero marquee words</h3>
        <div className="admin-row" style={{ marginBottom: 14 }}>
          <input
            className="input"
            value={marqueeInput}
            placeholder="Add a phrase"
            onChange={(e) => setMarqueeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMarquee()}
          />
          <button className="btn-a ghost" onClick={addMarquee}>Add</button>
        </div>
        <div className="chip-row">
          {(data.marquee || []).map((m, i) => (
            <span className="chip" key={i}>
              {m}
              <button onClick={() => set("marquee", data.marquee.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

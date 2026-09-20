"use client";

import { useEffect, useState } from "react";
import { fetchContent, saveContent } from "../lib";

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchContent("skills");
        setSkills(Array.isArray(data) ? data : []);
      } catch (e) {
        setStatus({ type: "err", msg: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function persist(next) {
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveContent("skills", next, "chore: update skills");
      setSkills(next);
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

  function add() {
    const t = input.trim();
    if (!t) return;
    persist([...skills, t]);
    setInput("");
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Skills</h1>
          <p className="admin-sub">Technologies shown in the scrolling marquee.</p>
        </div>
      </div>

      {status && <div className={`admin-banner ${status.type}`}>{status.msg}</div>}

      <div className="admin-card">
        <div className="admin-row" style={{ marginBottom: 18 }}>
          <input
            className="input"
            value={input}
            placeholder="Add a skill (e.g. TypeScript)"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button className="btn-a primary" onClick={add} disabled={saving}>
            Add
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#6f6f7a" }}>Loading…</p>
        ) : (
          <div className="chip-row">
            {skills.map((s, i) => (
              <span className="chip" key={i}>
                {s}
                <button onClick={() => persist(skills.filter((_, idx) => idx !== i))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchContent, saveContent } from "../lib";
import ImageUploader from "../ImageUploader";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankProject(count) {
  return {
    id: "",
    number: String(count + 1).padStart(2, "0"),
    title: "",
    category: "",
    year: new Date().getFullYear().toString(),
    description: "",
    tech: [],
    image: "",
    accent: "#7df9c4",
    link: "",
    featured: false,
  };
}

export default function ProjectsEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchContent("projects");
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setStatus({ type: "err", msg: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function persist(next, msg) {
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveContent("projects", next, msg);
      setItems(next);
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

  function openNew() {
    setEditing({ index: -1, data: blankProject(items.length) });
    setTechInput("");
  }
  function openEdit(i) {
    setEditing({ index: i, data: { ...items[i], tech: [...(items[i].tech || [])] } });
    setTechInput("");
  }

  function setField(key, val) {
    setEditing((e) => ({ ...e, data: { ...e.data, [key]: val } }));
  }

  function addTech() {
    const t = techInput.trim();
    if (!t) return;
    setField("tech", [...(editing.data.tech || []), t]);
    setTechInput("");
  }
  function removeTech(i) {
    setField("tech", editing.data.tech.filter((_, idx) => idx !== i));
  }

  async function saveItem() {
    const d = { ...editing.data };
    if (!d.title.trim()) {
      setStatus({ type: "err", msg: "Title is required" });
      return;
    }
    if (!d.id) d.id = slugify(d.title);
    const next = [...items];
    if (editing.index === -1) next.push(d);
    else next[editing.index] = d;
    await persist(next, `chore: ${editing.index === -1 ? "add" : "update"} project "${d.title}"`);
    setEditing(null);
  }

  async function removeItem(i) {
    if (!confirm(`Delete project "${items[i].title}"?`)) return;
    await persist(items.filter((_, idx) => idx !== i), "chore: delete project");
  }

  async function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    await persist(next, "chore: reorder projects");
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Projects</h1>
          <p className="admin-sub">Add, edit, reorder, and delete your portfolio projects.</p>
        </div>
        <button className="btn-a primary" onClick={openNew}>
          + Add Project
        </button>
      </div>

      {status && <div className={`admin-banner ${status.type}`}>{status.msg}</div>}

      {loading ? (
        <p style={{ color: "#6f6f7a" }}>Loading…</p>
      ) : (
        <div className="item-list">
          {items.map((p, i) => (
            <div className="item" key={p.id || i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="item-thumb" src={p.image} alt="" />
              <div className="item-info">
                <div className="item-name">
                  {p.title}{" "}
                  {p.featured && (
                    <span style={{ color: "#7df9c4", fontSize: "0.75rem" }}>★ featured</span>
                  )}
                </div>
                <div className="item-meta">
                  {p.category} · {p.year} · {(p.tech || []).join(", ")}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-a ghost small" onClick={() => move(i, -1)} title="Move up">↑</button>
                <button className="btn-a ghost small" onClick={() => move(i, 1)} title="Move down">↓</button>
                <button className="btn-a ghost small" onClick={() => openEdit(i)}>Edit</button>
                <button className="btn-a danger small" onClick={() => removeItem(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="modal-back" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {editing.index === -1 ? "Add Project" : "Edit Project"}
            </div>

            <div className="field">
              <label>Title *</label>
              <input
                className="input"
                value={editing.data.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. The Shorewood"
              />
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Category</label>
                <input
                  className="input"
                  value={editing.data.category}
                  onChange={(e) => setField("category", e.target.value)}
                  placeholder="Hospitality • Booking"
                />
              </div>
              <div className="field">
                <label>Year</label>
                <input
                  className="input"
                  value={editing.data.year}
                  onChange={(e) => setField("year", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                className="textarea"
                value={editing.data.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <ImageUploader
              label="Project image"
              value={editing.data.image}
              onChange={(url) => setField("image", url)}
            />

            <div className="field">
              <label>Tech stack</label>
              <div className="chip-row" style={{ marginBottom: 10 }}>
                {(editing.data.tech || []).map((t, i) => (
                  <span className="chip" key={i}>
                    {t}
                    <button onClick={() => removeTech(i)}>×</button>
                  </span>
                ))}
              </div>
              <div className="admin-row">
                <input
                  className="input"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="Type a tech and press Enter"
                />
                <button className="btn-a ghost" onClick={addTech} type="button">
                  Add
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Link (URL)</label>
                <input
                  className="input"
                  value={editing.data.link}
                  onChange={(e) => setField("link", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="field">
                <label>Accent color</label>
                <div className="admin-row">
                  <input
                    type="color"
                    value={editing.data.accent || "#7df9c4"}
                    onChange={(e) => setField("accent", e.target.value)}
                    style={{ width: 48, height: 40, background: "none", border: "none" }}
                  />
                  <input
                    className="input"
                    value={editing.data.accent}
                    onChange={(e) => setField("accent", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!!editing.data.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                Featured (displayed larger on the site)
              </label>
            </div>

            <div className="admin-row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn-a ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-a primary" onClick={saveItem} disabled={saving}>
                {saving ? "Saving…" : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

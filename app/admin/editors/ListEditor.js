"use client";

import { useEffect, useState } from "react";
import { fetchContent, saveContent } from "../lib";
import ImageUploader from "../ImageUploader";

function blank(fields) {
  const o = {};
  for (const f of fields) o[f.key] = f.type === "checkbox" ? false : "";
  return o;
}

function uid() {
  return "id" + Math.random().toString(36).slice(2, 9);
}

export default function ListEditor({
  name,
  title,
  subtitle,
  fields,
  display,
  withId = false,
  imageField,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {index, data} or null
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchContent(name);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setStatus({ type: "err", msg: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  async function persist(next, msg) {
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveContent(name, next, msg);
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
    const d = blank(fields);
    if (withId) d.id = uid();
    setEditing({ index: -1, data: d });
  }

  function openEdit(i) {
    setEditing({ index: i, data: { ...items[i] } });
  }

  async function saveItem() {
    const { index, data } = editing;
    const next = [...items];
    if (index === -1) next.push(data);
    else next[index] = data;
    await persist(next, `chore: ${index === -1 ? "add" : "update"} ${name} item`);
    setEditing(null);
  }

  async function removeItem(i) {
    if (!confirm("Delete this item?")) return;
    const next = items.filter((_, idx) => idx !== i);
    await persist(next, `chore: delete ${name} item`);
  }

  function setField(key, val) {
    setEditing((e) => ({ ...e, data: { ...e.data, [key]: val } }));
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{title}</h1>
          <p className="admin-sub">{subtitle}</p>
        </div>
        <button className="btn-a primary" onClick={openNew}>
          + Add {title.replace(/s$/, "")}
        </button>
      </div>

      {status && <div className={`admin-banner ${status.type}`}>{status.msg}</div>}

      {loading ? (
        <p style={{ color: "#6f6f7a" }}>Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", color: "#6f6f7a" }}>
          Nothing here yet. Click “Add” to create your first entry.
        </div>
      ) : (
        <div className="item-list">
          {items.map((x, i) => {
            const d = display(x);
            return (
              <div className="item" key={x.id || i}>
                {imageField && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="item-thumb" src={d.image || ""} alt="" />
                )}
                <div className="item-info">
                  <div className="item-name">{d.name || "(untitled)"}</div>
                  <div className="item-meta">{d.meta}</div>
                </div>
                <div className="item-actions">
                  <button className="btn-a ghost small" onClick={() => openEdit(i)}>
                    Edit
                  </button>
                  <button className="btn-a danger small" onClick={() => removeItem(i)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="modal-back" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {editing.index === -1 ? "Add" : "Edit"} {title.replace(/s$/, "")}
            </div>

            {fields.map((f) => {
              if (f.type === "image") {
                return (
                  <ImageUploader
                    key={f.key}
                    label={f.label}
                    value={editing.data[f.key]}
                    onChange={(url) => setField(f.key, url)}
                  />
                );
              }
              if (f.type === "checkbox") {
                return (
                  <div className="field" key={f.key}>
                    <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!editing.data[f.key]}
                        onChange={(e) => setField(f.key, e.target.checked)}
                      />
                      {f.label}
                    </label>
                  </div>
                );
              }
              const El = f.type === "textarea" ? "textarea" : "input";
              return (
                <div
                  className="field"
                  key={f.key}
                  style={f.half ? { display: "inline-block", width: "48%", marginRight: "3%" } : {}}
                >
                  <label>{f.label}</label>
                  <El
                    className={f.type === "textarea" ? "textarea" : "input"}
                    value={editing.data[f.key] || ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </div>
              );
            })}

            <div className="admin-row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn-a ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn-a primary" onClick={saveItem} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

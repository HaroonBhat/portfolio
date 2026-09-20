"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";
import { fetchContent, saveContent } from "./lib";
import ProjectsEditor from "./editors/ProjectsEditor";
import ListEditor from "./editors/ListEditor";
import AboutEditor from "./editors/AboutEditor";
import SiteEditor from "./editors/SiteEditor";
import SkillsEditor from "./editors/SkillsEditor";

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", ic: "▦" },
  { key: "projects", label: "Projects", ic: "◆" },
  { key: "services", label: "Services", ic: "✦" },
  { key: "skills", label: "Skills", ic: "★" },
  { key: "experience", label: "Experience", ic: "❖" },
  { key: "education", label: "Education", ic: "❐" },
  { key: "testimonials", label: "Testimonials", ic: "❝" },
  { key: "blog", label: "Blog", ic: "✎" },
  { key: "about", label: "About", ic: "☺" },
  { key: "site", label: "Site Settings", ic: "⚙" },
];

export default function AdminPage() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [github, setGithub] = useState(false);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Load counts for the dashboard tiles.
    (async () => {
      const names = ["projects", "services", "skills", "experience", "education", "testimonials", "blog"];
      const result = {};
      let gh = false;
      for (const n of names) {
        try {
          const { data, github } = await fetchContent(n);
          result[n] = Array.isArray(data) ? data.length : 0;
          gh = github;
        } catch {
          result[n] = 0;
        }
      }
      setCounts(result);
      setGithub(gh);
    })();
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-brand">
            <span className="star">✦</span> Portfolio CMS
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`admin-nav-item ${active === s.key ? "active" : ""}`}
              onClick={() => setActive(s.key)}
            >
              <span className="ic">{s.ic}</span>
              {s.label}
            </button>
          ))}
          <button className="admin-nav-item admin-logout" onClick={logout}>
            <span className="ic">⏻</span> Logout
          </button>
        </aside>

        <main className="admin-main">
          {!github && (
            <div className="admin-banner warn">
              ⚠ GitHub not configured — changes are saved to local files only (great
              for preview). Set <code>GITHUB_TOKEN</code>, <code>GITHUB_OWNER</code>,{" "}
              <code>GITHUB_REPO</code> to commit &amp; auto-deploy.
            </div>
          )}

          {active === "dashboard" && (
            <Dashboard counts={counts} setActive={setActive} github={github} />
          )}

          {active === "projects" && <ProjectsEditor />}

          {active === "services" && (
            <ListEditor
              name="services"
              title="Services"
              subtitle="Manage the services you offer."
              fields={[
                { key: "name", label: "Service name", type: "text" },
                { key: "desc", label: "Description", type: "textarea" },
              ]}
              display={(x) => ({ name: x.name, meta: x.desc })}
            />
          )}

          {active === "skills" && <SkillsEditor />}

          {active === "experience" && (
            <ListEditor
              name="experience"
              title="Experience"
              subtitle="Your work history."
              withId
              fields={[
                { key: "role", label: "Role / Title", type: "text" },
                { key: "company", label: "Company", type: "text" },
                { key: "start", label: "Start", type: "text", half: true },
                { key: "end", label: "End", type: "text", half: true },
                { key: "description", label: "Description", type: "textarea" },
              ]}
              display={(x) => ({ name: x.role, meta: `${x.company} · ${x.start}–${x.end}` })}
            />
          )}

          {active === "education" && (
            <ListEditor
              name="education"
              title="Education"
              subtitle="Your academic background."
              withId
              fields={[
                { key: "degree", label: "Degree", type: "text" },
                { key: "institution", label: "Institution", type: "text" },
                { key: "start", label: "Start", type: "text", half: true },
                { key: "end", label: "End", type: "text", half: true },
                { key: "description", label: "Description", type: "textarea" },
              ]}
              display={(x) => ({ name: x.degree, meta: `${x.institution} · ${x.start}–${x.end}` })}
            />
          )}

          {active === "testimonials" && (
            <ListEditor
              name="testimonials"
              title="Testimonials"
              subtitle="Client quotes and feedback."
              withId
              imageField="avatar"
              fields={[
                { key: "quote", label: "Quote", type: "textarea" },
                { key: "name", label: "Name", type: "text", half: true },
                { key: "role", label: "Role", type: "text", half: true },
                { key: "avatar", label: "Avatar", type: "image" },
              ]}
              display={(x) => ({ name: x.name, meta: x.role, image: x.avatar })}
            />
          )}

          {active === "blog" && (
            <ListEditor
              name="blog"
              title="Blog"
              subtitle="Articles and posts."
              withId
              imageField="cover"
              fields={[
                { key: "title", label: "Title", type: "text" },
                { key: "slug", label: "Slug", type: "text", half: true },
                { key: "date", label: "Date", type: "text", half: true },
                { key: "excerpt", label: "Excerpt", type: "textarea" },
                { key: "cover", label: "Cover image", type: "image" },
                { key: "published", label: "Published", type: "checkbox" },
              ]}
              display={(x) => ({ name: x.title, meta: x.published ? "Published" : "Draft", image: x.cover })}
            />
          )}

          {active === "about" && <AboutEditor />}
          {active === "site" && <SiteEditor />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ counts, setActive, github }) {
  const tiles = [
    { key: "projects", label: "Projects", ic: "◆" },
    { key: "services", label: "Services", ic: "✦" },
    { key: "skills", label: "Skills", ic: "★" },
    { key: "experience", label: "Experience", ic: "❖" },
    { key: "education", label: "Education", ic: "❐" },
    { key: "testimonials", label: "Testimonials", ic: "❝" },
    { key: "blog", label: "Blog Posts", ic: "✎" },
  ];
  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Welcome back 👋</h1>
          <p className="admin-sub">
            Manage your portfolio content. Storage:{" "}
            <strong style={{ color: github ? "#7df9c4" : "#fbbf24" }}>
              {github ? "GitHub (auto-deploy)" : "Local files"}
            </strong>
          </p>
        </div>
        <a className="btn-a ghost" href="/" target="_blank" rel="noreferrer">
          View site ↗
        </a>
      </div>

      <div className="dash-grid">
        {tiles.map((t) => (
          <div key={t.key} className="dash-tile" onClick={() => setActive(t.key)}>
            <div className="ic">{t.ic}</div>
            <div className="n">{counts[t.key] ?? "–"}</div>
            <div className="l">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

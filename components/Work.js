import Reveal from "./Reveal";

export default function Work({ projects = [] }) {
  return (
    <section id="work" className="section">
      <div className="container">
        <Reveal>
          <span className="label">My Work</span>
          <h2 className="section-heading">Crafted With Purpose</h2>
        </Reveal>

        <div className="work-grid">
          {projects.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 2) * 90}
              className={`work-card ${p.featured ? "big" : ""}`}
            >
              <a href={p.link || "#"} className="work-media">
                <span className="work-badge">{p.number}</span>
                <span className="work-arrow">↗</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} loading="lazy" />
              </a>
              <div className="work-body">
                <div className="work-head">
                  <h3 className="work-title">{p.title}</h3>
                  <span className="work-year">{p.year}</span>
                </div>
                <div
                  className="work-tag"
                  style={{
                    width: "fit-content",
                    color: p.accent,
                    borderColor: "var(--line)",
                  }}
                >
                  {p.category}
                </div>
                <p className="work-desc">{p.description}</p>
                <div className="work-tags">
                  {(p.tech || []).map((t) => (
                    <span className="work-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

export default function About({ about = {} }) {
  const stats = about.stats || [];
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <span className="label">About Me</span>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <h2 className="about-big">
              {about.headline ||
                "I'm a passionate designer & developer creating modern, user-focused digital experiences."}
            </h2>
          </Reveal>

          <Reveal className="about-side" delay={100}>
            {about.bioPrimary && <p>{about.bioPrimary}</p>}
            {about.bioSecondary && <p>{about.bioSecondary}</p>}

            <div className="about-stats">
              {stats.map((s) => (
                <div className="about-stat" key={s.label}>
                  <div className="n">{s.value}</div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

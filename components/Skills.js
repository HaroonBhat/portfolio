export default function Skills({ skills = [] }) {
  const items = [...skills, ...skills];
  return (
    <section id="skills" className="section" style={{ paddingBottom: 60 }}>
      <div className="container">
        <span className="label">My Skills</span>
        <h2 className="section-heading">Skills That Drive Results</h2>
      </div>

      <div className="skills-marquee">
        <div className="skills-track">
          {items.map((s, i) => (
            <span className="skill-chip" key={i}>
              <span className="ic">{String(s).slice(0, 2)}</span>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

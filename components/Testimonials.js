import Reveal from "./Reveal";

export default function Testimonials({ testimonials = [] }) {
  if (!testimonials.length) return null;
  const first = testimonials[0];

  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <div className="container">
        <Reveal>
          <span className="label">Testimonials</span>
          <h2 className="section-heading">Trusted by Clients</h2>
        </Reveal>

        <div className="testi">
          <Reveal>
            <div className="testi-avatars">
              <div className="a" style={{ background: "#7df9c4" }} />
              <div className="a" style={{ background: "#9d7bff" }} />
              <div className="a" style={{ background: "#f59e0b" }} />
            </div>
            <p style={{ marginTop: 24, color: "var(--ink-soft)", maxWidth: 300 }}>
              Building lasting relationships through reliable, high-quality work
              that clients trust.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="testi-card">
              <div className="testi-mark">&ldquo;</div>
              <p className="testi-quote">{first.quote}</p>
              <div className="testi-person">
                <div
                  className="testi-avatar"
                  style={{ background: "#7df9c4" }}
                >
                  {first.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={first.avatar} alt={first.name} />
                  ) : null}
                </div>
                <div>
                  <div className="testi-name">{first.name}</div>
                  <div className="testi-role">{first.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

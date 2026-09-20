import Reveal from "./Reveal";

export default function Services({ services = [] }) {
  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal>
          <span className="label">Services</span>
          <h2 className="section-heading">Services that drive brands</h2>
        </Reveal>

        <div className="services-list">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 60} className="service-row">
              <span className="idx">0{i + 1}</span>
              <span className="name">{s.name}</span>
              <span className="desc">{s.desc}</span>
              <span className="plus">+</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

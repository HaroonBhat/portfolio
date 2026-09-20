import Reveal from "./Reveal";

export default function Contact({ about = {} }) {
  const email = about.email || "Bharoon00@gmail.com";
  const location = about.location || "Srinagar, Kashmir, India";
  const socials = about.socials || {};

  const socialLinks = [
    socials.linkedin && { label: "in", href: socials.linkedin },
    socials.github && { label: "gh", href: socials.github },
    { label: "@", href: `mailto:${email}` },
  ].filter(Boolean);

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal>
          <span className="label">Contact</span>
          <h2 className="contact-head">Start a Conversation</h2>
          <p className="contact-sub">
            Have a project in mind? I&apos;d love to hear about your ideas and
            help bring them to life.
          </p>
        </Reveal>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="k">Email</div>
            <a className="v" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <div className="contact-item">
            <div className="k">Location</div>
            <span className="v">{location}</span>
          </div>
          <div className="contact-item">
            <div className="k">Socials</div>
            {socials.linkedin ? (
              <a
                className="v"
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            ) : (
              <span className="v">—</span>
            )}
          </div>
        </div>

        <div className="contact-socials">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

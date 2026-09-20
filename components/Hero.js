export default function Hero({ about = {}, site = {} }) {
  const marquee = site.marquee || [
    "Web Development",
    "UI / UX Design",
    "Full-Stack",
    "Branding",
    "Next.js",
  ];
  const words = [...marquee, ...marquee];
  const anonymous = site.heroMode === "anonymous";
  const name = about.name || "Haroon Rashid";
  const nameParts = name.split(" ");
  const portrait = about.portrait || "/images/portrait.png";
  const year = site.year || "2026";

  return (
    <section id="home" className="hero">
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-top">
          <p className="hero-tag">
            <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              &gt; whoami_
            </span>
            <br />
            {anonymous
              ? "Developer & designer operating from the shadows of Kashmir, India — building modern web experiences in silence."
              : `Developer & designer based in ${about.location || "Kashmir, India"} — building modern, expressive web experiences.`}
          </p>
          <div className="hero-avail">
            <span className="dot" />
            {site.availability || "Available for work"}
            <br />
            <span style={{ color: "var(--ink)" }}>{year}</span>
          </div>
        </div>

        <div className="hero-mini">
          {site.tagline
            ? site.tagline
            : "Designing Digital Experiences That Inspire"}
        </div>

        <div className="hero-name-row">
          <h1 className="hero-name">
            {anonymous ? (
              <>
                <span className="accent">Anonymous</span> Dev
              </>
            ) : (
              <>
                {nameParts[0]}{" "}
                <span className="accent">{nameParts.slice(1).join(" ")}</span>
              </>
            )}
          </h1>
          <span className="hero-year">{year}</span>
        </div>
      </div>

      <div className="hero-portrait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portrait} alt={anonymous ? "Anonymous developer" : name} />
      </div>

      <div className="hero-marquee">
        <div className="marquee-track">
          {words.map((w, i) => (
            <span key={i}>
              {w} <span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

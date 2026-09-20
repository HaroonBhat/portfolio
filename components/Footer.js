export default function Footer({ about = {} }) {
  const name = about.name || "Haroon Rashid";
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#home" className="logo">
          <span className="star" style={{ color: "var(--accent)" }}>
            ✦
          </span>
          {name.split(" ")[0]}
        </a>
        <div>
          © {new Date().getFullYear()} {name}. Built with Next.js.
        </div>
      </div>
    </footer>
  );
}

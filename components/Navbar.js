"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-pill">
          <a href="#home" className="logo">
            <span className="star">✦</span>Haroon
          </a>

          <div className={`nav-links ${open ? "open" : ""}`}>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
              Contact
            </a>
          </div>

          <button
            className="menu-btn"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span
              style={{
                transform: open ? "rotate(45deg) translate(4px,4px)" : "none",
              }}
            />
            <span style={{ opacity: open ? 0 : 1 }} />
            <span
              style={{
                transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none",
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

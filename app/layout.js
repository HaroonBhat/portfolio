import "./globals.css";
import { readContent } from "@/lib/content";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"


export async function generateMetadata() {
  let site = {};
  try {
    site = await readContent("site");
  } catch {}
  const title = site.siteTitle || "Haroon Rashid — Designer & Developer";
  const description =
    site.siteDescription ||
    "Designing digital experiences that inspire. Modern web development with Next.js & React.";
  return {
    title,
    description,
    keywords: [
      "Haroon Rashid",
      "Web Developer",
      "Next.js Developer",
      "React Developer",
      "UI UX Designer",
      "Kashmir",
    ],
    authors: [{ name: "Haroon Rashid" }],
    openGraph: { title, description, type: "website" },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=cabinet-grotesk@700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

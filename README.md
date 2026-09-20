# Haroon Rashid — Portfolio + Git-backed CMS

A Next.js (JavaScript) portfolio with a **protected `/admin` dashboard**. Content lives
in JSON files in the repo and is edited through the admin, which **commits changes via the
GitHub API** (which triggers a Vercel redeploy). Images go to **Cloudinary**. **No database.**

```
Admin panel → Next.js server API → content/*.json (GitHub commit) → Vercel deploy → Public site
Images      → Cloudinary (unsigned upload) → secure_url stored in the JSON
```

## How it works

- **Public site** (`app/page.js`) reads `content/*.json` server-side and renders everything
  with `.map()`. Add a project in `/admin` → it appears on the site after redeploy. No
  frontend code changes needed. Same for skills, services, experience, testimonials, etc.
- **Admin** (`/admin`) is protected by `middleware.js`. Login issues a signed JWT stored in
  an **httpOnly cookie**. All `/admin` pages and `/api/admin/*` routes require it.
- **Writes** go through `lib/content.js`:
  - If `GITHUB_TOKEN` is set → commits the JSON file via the GitHub Contents API.
  - If not → writes the local file (so dev/preview works with zero config).
- **Images** upload straight from the browser to Cloudinary using an **unsigned upload
  preset**; only the returned `secure_url` is saved into the JSON. Large files never touch Git.

## Content files (`content/`)

`projects.json`, `skills.json`, `services.json`, `experience.json`, `education.json`,
`testimonials.json`, `about.json`, `blog.json`, `site.json`

## Environment variables

Copy `.env.example` → `.env.local` (dev) or set in Vercel (prod).

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs the admin session JWT (long random string) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (recommended) |
| `ADMIN_PASSWORD` | Plaintext fallback if no hash set |
| `GITHUB_TOKEN` | Fine-grained PAT, **Contents: Read & write** on this repo only |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | Where to commit content |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (public) |
| `CLOUDINARY_UPLOAD_PRESET` | **Unsigned** upload preset name (public) |
| `CLOUDINARY_FOLDER` | Optional folder for uploads |

> The GitHub token and `AUTH_SECRET` are **server-only** and never sent to the browser.
> Cloudinary uses an unsigned preset, so no API secret is needed anywhere.

Generate a password hash:
```bash
node scripts/hash-password.js "your-password"
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000  (admin at /admin, default password: admin123)
```

Without GitHub/Cloudinary configured, edits save to local files and image "uploads" show a
temporary local preview — the whole flow is exercisable offline.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import into Vercel.
3. Add all env vars above in **Project → Settings → Environment Variables**.
4. Create a Cloudinary **unsigned** upload preset and set the two Cloudinary vars.
5. Deploy. Editing content in `/admin` commits to GitHub → Vercel redeploys automatically.

## Setup checklist

- [ ] `AUTH_SECRET` set to a long random string
- [ ] `ADMIN_PASSWORD_HASH` set (run the hash script)
- [ ] Fine-grained GitHub PAT (Contents R/W, this repo only) → `GITHUB_TOKEN`
- [ ] `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` set
- [ ] Cloudinary unsigned preset → `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_UPLOAD_PRESET`

## Notes / trade-offs (Git as the database)

- **Propagation delay:** a save commits to GitHub, then Vercel redeploys (~30–60s) before
  the public site updates. The admin itself always reads the latest immediately.
- **SHA handling:** each write does GET (sha) → PUT, with a retry on the rare 409 conflict.
- **Rate limit:** 5,000 authenticated requests/hour — far beyond single-owner usage.
- If you ever need instant updates or concurrent editors, move to a headless CMS or KV store;
  for a single-owner portfolio, Git-as-content is simpler, free, versioned, and auditable.
```

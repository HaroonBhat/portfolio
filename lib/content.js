// Content access layer.
// - READS: local filesystem (build-time + preview). In production the JSON files
//   are part of the deployed repo, so reads are just local file reads — fast, no API.
// - WRITES: GitHub Contents API when GITHUB_TOKEN is set (commits the file, which
//   triggers a Vercel redeploy). Falls back to writing the local file when no token
//   is configured, so the whole flow works in local dev / this preview.
//
// The GitHub token is only ever read here (server-side). It is never sent to the browser.

import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

const GH = {
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH || "main",
};

export function githubConfigured() {
  return Boolean(GH.token && GH.owner && GH.repo);
}

const VALID = new Set([
  "projects",
  "skills",
  "services",
  "testimonials",
  "about",
  "experience",
  "education",
  "blog",
  "site",
]);

function assertValid(name) {
  if (!VALID.has(name)) {
    throw new Error(`Unknown content file: ${name}`);
  }
}

function localPath(name) {
  return path.join(CONTENT_DIR, `${name}.json`);
}

function ghPath(name) {
  return `content/${name}.json`;
}

// ---------- READ ----------
export async function readContent(name) {
  assertValid(name);
  const raw = await fs.readFile(localPath(name), "utf8");
  return JSON.parse(raw);
}

export async function readAll() {
  const names = [...VALID];
  const entries = await Promise.all(
    names.map(async (n) => {
      try {
        return [n, await readContent(n)];
      } catch {
        return [n, null];
      }
    })
  );
  return Object.fromEntries(entries);
}

// ---------- WRITE ----------
export async function writeContent(name, data, message) {
  assertValid(name);
  const json = JSON.stringify(data, null, 2) + "\n";

  // Always keep the local copy in sync so preview + subsequent reads are fresh.
  await fs.writeFile(localPath(name), json, "utf8");

  if (!githubConfigured()) {
    return { ok: true, mode: "local", persisted: false };
  }

  await commitToGitHub(ghPath(name), json, message || `chore: update ${name}.json via admin`);
  return { ok: true, mode: "github", persisted: true };
}

async function ghApi(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GH.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

async function getFileSha(filePath) {
  const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${filePath}?ref=${GH.branch}`;
  const res = await ghApi(url);
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub GET failed (${res.status}): ${t}`);
  }
  const json = await res.json();
  return json.sha;
}

async function commitToGitHub(filePath, contentStr, message, attempt = 0) {
  const sha = await getFileSha(filePath);
  const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${filePath}`;
  const body = {
    message,
    content: Buffer.from(contentStr, "utf8").toString("base64"),
    branch: GH.branch,
    ...(sha ? { sha } : {}),
  };
  const res = await ghApi(url, { method: "PUT", body: JSON.stringify(body) });

  // Handle the occasional SHA race: refetch and retry once.
  if (res.status === 409 && attempt < 2) {
    return commitToGitHub(filePath, contentStr, message, attempt + 1);
  }
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub PUT failed (${res.status}): ${t}`);
  }
  return res.json();
}

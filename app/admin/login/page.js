"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../admin.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Login failed");
      }
      const next = params.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-card" onSubmit={submit}>
      <h1>
        <span style={{ color: "#7df9c4" }}>✦</span> Admin Login
      </h1>
      <p>Enter your password to manage your portfolio content.</p>

      {error && (
        <div className="admin-banner err" style={{ marginBottom: 18 }}>
          {error}
        </div>
      )}

      <div className="field">
        <label>Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
        />
      </div>

      <button className="btn-a primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="admin">
      <div className="login-wrap">
        <Suspense fallback={<div className="login-card">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

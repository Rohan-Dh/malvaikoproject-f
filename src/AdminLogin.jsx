import { useState } from "react";
import { login } from "./api";
import "./AdminLogin.css";

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) onSuccess();
    else setError(res.message || "Login failed.");
  }

  return (
    <div className="al-root">
      <div className="al-noise" />

      <div className="al-card">
        <div className="al-card-bar" />

        <div className="al-brand">WhroBroKit</div>
        <div className="al-sub">ADMIN ACCESS</div>

        <form className="al-form" onSubmit={handleSubmit}>
          <label className="al-label">
            Email
            <input
              className="al-input"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>

          <label className="al-label">
            Password
            <input
              className="al-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>

          {error && <div className="al-error">{error}</div>}

          <button className="al-btn" type="submit" disabled={loading}>
            {loading ? <span className="al-spinner" /> : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

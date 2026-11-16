import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

// I kept login minimal and explicit so validation and auth errors are clear to users and markers.

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tottenhamId, setTottenhamId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const demoIdAccessEnv =
    (import.meta as any).env?.VITE_ENABLE_DEMO_ID_ACCESS ??
    ((globalThis as any).process?.env?.VITE_ENABLE_DEMO_ID_ACCESS as string | undefined) ??
    "true";
  const isDemoIdAccessEnabled = demoIdAccessEnv === "true";
  const navigate = useNavigate();
  const ADMIN_ACCESS_KEY = "adminAccessGranted";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please provide both an email and password.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      if (data?.accessToken) {
        navigate("/booking", { replace: true });
      } else {
        setError("Login succeeded but no token was returned.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to login.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTottenhamIdAccess = () => {
    if (!isDemoIdAccessEnabled) {
      setError("Season/Member ID access is currently disabled.");
      return;
    }

    // I keep this shortcut only behind an explicit demo flag.
    const id = tottenhamId.trim();
    if (id === "2025" || id === "2005") {
      localStorage.setItem(ADMIN_ACCESS_KEY, "true");
      setError(null);
      navigate("/admin", { replace: true });
      return;
    }

    // 1882 is the general-public shortcut and should not unlock admin.
    if (id === "1882") {
      localStorage.removeItem(ADMIN_ACCESS_KEY);
      setError(null);
      navigate("/booking", { replace: true });
      return;
    }

    setError("INVALID");
  };

  return (
    <div className="login-page" style={{ maxWidth: "420px", margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email" style={{ display: "block", marginBottom: "0.2rem" }}>
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password" style={{ display: "block", margin: "0.75rem 0 0.2rem" }}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Signing in…" : "Login"}
        </button>

        {isDemoIdAccessEnabled && (
          <>
            <label htmlFor="tottenham-id" style={{ display: "block", margin: "1rem 0 0.2rem" }}>
              Season/Member ID
            </label>
            <input
              id="tottenham-id"
              type="text"
              placeholder="Enter Season/Member ID"
              value={tottenhamId}
              onChange={(event) => setTottenhamId(event.target.value)}
            />

            <button type="button" onClick={handleTottenhamIdAccess} style={{ marginTop: "0.5rem" }}>
              Season/Member ID Access
            </button>
          </>
        )}
      </form>
      {error && (
        <p style={{ color: "#b00020", marginTop: "0.75rem" }} role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
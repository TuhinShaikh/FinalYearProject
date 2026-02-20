import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      </form>
      {error && (
        <p style={{ color: "#b00020", marginTop: "0.75rem" }} role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
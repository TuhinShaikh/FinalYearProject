import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

// I made registration straightforward so users can join quickly before booking travel and parking.

export default function RegisterUser(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/login", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-name" style={{ display: "block", marginBottom: "0.2rem" }}>
          Name
        </label>
        <input
          id="register-name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label htmlFor="register-email" style={{ display: "block", margin: "0.75rem 0 0.2rem" }}>
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label htmlFor="register-password" style={{ display: "block", margin: "0.75rem 0 0.2rem" }}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
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
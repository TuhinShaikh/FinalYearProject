import React, { useState } from "react";
import axios from "axios";

export default function RegisterUser(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { name, email, password });
      alert("Registration successful!");
      window.location.href = "/login";
    } catch {
      alert("Registration failed.");
    }
  };
  return (
    <div className="register-page" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

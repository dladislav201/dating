"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful");
        router.push("/login");
      } else {
        console.error("Error during registration:", data.error);
        setError(data.error || "An unknown error occurred");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
    </div>
  );
};

export default Register;

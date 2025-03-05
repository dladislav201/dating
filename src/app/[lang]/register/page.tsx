"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword, validateEmail } from "@/utils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long, contain one uppercase letter and one special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nickName, password }),
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
    <main className="main">
      <section className="section">
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
            type="text"
            name="nickname"
            placeholder="@nickname"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
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
      </section>
    </main>
  );
};

export default Register;

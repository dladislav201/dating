"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (
    email: string,
    password: string,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      console.error("Login failed", result.error);
      setError(result.error);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          handleLogin(email, password, e);
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLoading ? "Logging In..." : "Log In"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;

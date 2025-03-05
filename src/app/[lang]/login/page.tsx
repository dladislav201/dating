"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetSessionQuery } from "@/services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLogginLoading, setIsLogginLoading] = useState(false);
  const { data, isLoading, refetch } = useGetSessionQuery();
  const user = data?.user || null;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  const handleLogin = async (
    email: string,
    password: string,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setIsLogginLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    refetch();
    setIsLogginLoading(false);

    if (result?.error) {
      console.error("Login failed", result.error);
      setError(result.error);
    } else {
      router.push("/profile");
    }
  };

  return (
    <main className="main">
      <section className="section">
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
          <button type="submit">
            {isLogginLoading ? "Logging In..." : "Log In"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register">Register here</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { RootState } from "@/store/store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Отримуємо поточного юзера зі стору
  const currentUser = useSelector((state: RootState) => state.user);

  // Якщо юзер вже залогінений → переадресація на /profile
  useEffect(() => {
    if (currentUser.id) {
      router.push("/profile");
    }
  }, [currentUser, router]);

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
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user) {
        dispatch(setUser({ id: session.user.id, email: session.user.email }));
        console.log(session.user.id, session.user.email);
        // router.push("/profile");
      } else {
        setError("No session found after login");
      }
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
            {isLoading ? "Logging In..." : "Log In"}
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

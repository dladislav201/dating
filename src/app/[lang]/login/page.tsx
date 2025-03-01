"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

const Login = () => {
  const handleLogin = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error("Login failed", result.error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.target as HTMLFormElement);
          const email = form.get("email") as string;
          const password = form.get("password") as string;
          handleLogin(email, password);
        }}
      >
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;

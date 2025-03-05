"use client";

import "./Userbox.scss";
import { User } from "@/models";
import { Button } from "@/components/Button/Button";
import { useEffect, useState } from "react";
import { useUpdateUserMutation } from "@/services";
import { useSession } from "next-auth/react";
import { validatePassword, validateEmail } from "@/utils";

interface UserboxProps {
  user: User;
}

export const Userbox = ({ user }: UserboxProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateUser] = useUpdateUserMutation();
  const [email, setEmail] = useState(user.email || "");
  const [nickName, setNickName] = useState(user.nickName || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/sessionR");
      const data = await res.json();

      if (data.user) {
        setNickName(data.user.nickName);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);

    if (user.email === email && user.nickName === nickName && password === "") {
      setError("Please provide a new data if you wish to update it.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password !== "" && !validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long, contain one uppercase letter and one special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      await updateUser({
        email,
        nickName,
        password,
      }).unwrap();

      await update({ email, nickName });

      setError(null);
      alert("🟢 Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="userbox">
      <div className="userbox__section">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="userbox__section">
        <label>Nickname:</label>
        <input
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          required
        />
      </div>
      <div className="userbox__section">
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <Button variant="primary" size="small" onClick={handleUpdate}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

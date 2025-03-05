import "./Button.scss";
import React from "react";
import Link from "next/link";
import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant: "primary" | "secondary" | "danger";
  size: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  onClick,
  href,
  variant = "primary",
  size = "medium",
  disabled = false,
  className,
  type = "button",
}: ButtonProps) => {
  const buttonClass = classNames(
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    className,
    { "btn--disabled": disabled }
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

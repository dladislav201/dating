import "./Button.scss";
import React from "react";
import Link from "next/link";
import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type: "primary" | "secondary" | "danger";
  size: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  href,
  type = "primary",
  size = "medium",
  disabled = false,
  className,
}: ButtonProps) => {
  const buttonClass = classNames(
    "btn",
    `btn--${type}`,
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
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

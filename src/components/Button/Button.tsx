import "./Button.scss";
import React from "react";
import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type: "primary" | "secondary" | "danger";
  size: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
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
  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

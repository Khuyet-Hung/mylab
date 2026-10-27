import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  const classes = ["ui-button", className].filter(Boolean).join(" ");
  return <button {...props} className={classes} />;
}

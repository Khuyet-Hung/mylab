import type { ReactNode } from "react";

type EyebrowProps = {
  as?: "p" | "span";
  children: ReactNode;
};

export function Eyebrow({ as = "p", children }: EyebrowProps) {
  const Tag = as;
  return <Tag className="eyebrow">{children}</Tag>;
}

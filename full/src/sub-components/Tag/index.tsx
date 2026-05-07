import type { ComponentChildren } from "preact";

interface Props {
  type: "discounted" | "new" | "dark";
  size?: "s" | "m";
  children: ComponentChildren;
}

export default function Tag({ type, size = "s", children }: Props) {
  const typoClass = size === "s" ? "text-xs-semibold" : "text-md-semibold";
  const typeClass =
    type === "discounted"
      ? "kombos-tag--discounted"
      : type === "dark"
        ? "kombos-tag--dark"
        : "kombos-tag--new";

  return (
    <span className={`kombos-tag ${typeClass} ${typoClass}`}>{children}</span>
  );
}

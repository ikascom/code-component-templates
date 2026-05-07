import { Props } from "./types";

export function Announcement({ text }: Props) {
  if (!text) return null;

  return (
    <span className="kombos-announcement text-sm-medium">{text}</span>
  );
}

export default Announcement;

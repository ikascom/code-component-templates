import { cx } from "../../utils/cx";
import { SpinnerSVG } from "../icons";

interface Props {
  className?: string;
}

export default function SpinnerIcon({ className }: Props) {
  return <SpinnerSVG className={cx("kombos-spinner", className)} />;
}

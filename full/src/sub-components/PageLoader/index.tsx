import { cx } from "../../utils/cx";
import SpinnerIcon from "../SpinnerIcon";

interface Props {
  className?: string;
}

export default function PageLoader({ className }: Props) {
  return (
    <div className={cx("page-loader", className)}>
      <SpinnerIcon />
    </div>
  );
}

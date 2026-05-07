import { ComponentChildren } from "preact";

interface Props {
  icon: ComponentChildren;
  children: ComponentChildren;
  onClick: () => void;
}

export default function SocialLoginButton({
  icon,
  children,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      className="kombos-social-login-btn text-sm-medium"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

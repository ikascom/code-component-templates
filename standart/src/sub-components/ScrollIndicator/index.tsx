import { observer } from "@ikas/component-utils";

interface Props {
  onClick: () => void;
  label: string;
}

const ScrollIndicator = observer(function ScrollIndicator({ onClick, label }: Props) {
  return (
    <button
      type="button"
      class="scroll-indicator"
      onClick={onClick}
      aria-label={label}
    >
      <span class="scroll-indicator-track" aria-hidden="true">
        <svg
          class="scroll-indicator-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>
  );
});

export default ScrollIndicator;

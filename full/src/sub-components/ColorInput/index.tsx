import { XSVG } from "../icons";

interface Props {
  value: string;
  onInput: (e: Event) => void;
  onClear?: () => void;
  status?: "default" | "error" | "success";
  id?: string;
}

export default function ColorInput({ value, onInput, onClear, status = "default", id }: Props) {
  return (
    <div className="kombos-color-input__row" data-state={status !== "default" ? status : undefined}>
      <input
        id={id}
        type="color"
        className="kombos-color-input__picker"
        value={value}
        onInput={onInput}
      />
      <span className="kombos-color-input__value text-sm-regular">{value}</span>
      {onClear && (
        <button
          type="button"
          className="kombos-color-input__clear"
          onClick={onClear}
        >
          <XSVG />
        </button>
      )}
    </div>
  );
}

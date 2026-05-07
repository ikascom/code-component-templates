export function showToast(message: string, variant: "success" | "error") {
  window.dispatchEvent(
    new CustomEvent("ikas:show-toast", { detail: { message, variant } })
  );
}

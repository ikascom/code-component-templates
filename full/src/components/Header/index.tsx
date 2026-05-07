// import { IkasComponentRenderer } from "@ikas/bp-storefront";
import { useEffect, useCallback } from "preact/hooks";
import { Props } from "./types";
import { ToastContainer } from "../../sub-components/Toast";
import { useToast } from "../../hooks/useToast";
import { IkasComponentRenderer } from "@ikas/bp-storefront";

export function Header(props: Props) {
  const { components } = props;

  const toast = useToast();

  const handleShowToast = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        message: string;
        variant: "success" | "error";
      };
      toast.show(detail.message, detail.variant);
    },
    [toast.show],
  );

  useEffect(() => {
    window.addEventListener("ikas:show-toast", handleShowToast);
    return () => window.removeEventListener("ikas:show-toast", handleShowToast);
  }, [handleShowToast]);

  return (
    <>
      <section
        className="kombos-header"
        style={{ display: "contents" }}
      >
        <IkasComponentRenderer
          id="header"
          components={components}
          parentProps={props}
        />
      </section>
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </>
  );
}

export default Header;

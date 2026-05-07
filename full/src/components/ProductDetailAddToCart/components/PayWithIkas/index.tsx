import { IkasProduct } from "@ikas/bp-storefront";
import { usePayWithIkas } from "../../../../hooks/usePayWithIkas";

interface Props {
  product: IkasProduct;
  quantity: number;
  isEnabled: boolean;
  payWithIkasUrl: string;
}

export default function PayWithIkas({
  product,
  quantity,
  isEnabled,
  payWithIkasUrl,
}: Props) {
  const { iframeRef, iframeSrc, iframeHeight } = usePayWithIkas({
    product,
    quantity,
    isEnabled,
    payWithIkasUrl,
  });

  return (
    <iframe
      ref={iframeRef}
      className="kombos-pd-atc__ikas-pay"
      title="Pay with ikas"
      src={iframeSrc}
      width="100%"
      height={iframeHeight}
    />
  );
}

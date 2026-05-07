import { Router } from "@ikas/bp-storefront";
import { Handbag1SVG } from "../../../../sub-components/icons";
import Button from "../../../../sub-components/Button";

interface Props {
  emptyCartText: string;
  continueShoppingText: string;
}

export default function EmptyState({
  emptyCartText,
  continueShoppingText,
}: Props) {
  const handleContinueShopping = () => {
    Router.navigate("/");
  };

  return (
    <div className="cart-page__empty">
      <span className="cart-page__empty-icon">
        <Handbag1SVG />
      </span>
      <p className="cart-page__empty-text text-xl-semibold md:display-xs-semibold">
        {emptyCartText}
      </p>
      <Button variant="primary" size="s" onClick={handleContinueShopping}>
        {continueShoppingText}
      </Button>
    </div>
  );
}

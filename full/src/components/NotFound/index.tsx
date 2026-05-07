import { Router } from "@ikas/bp-storefront";

import { Props } from "./types";
import Button from "../../sub-components/Button";

export function NotFound({ title, description, button }: Props) {
  return (
    <section className="not-found">
      <div className="not-found__wrapper kombos-container">
        <div className="not-found__content">
          <h1 className="not-found__title display-sm-semibold">{title}</h1>
          <p className="not-found__description text-md-regular">
            {description}
          </p>
          {button?.href && button?.label && (
            <Button
              variant="primary"
              size="s"
              onClick={() =>
                Router.navigate(
                  button.href,
                  false,
                  button.openInNewTab ?? false,
                )
              }
              style={{
                minWidth: 200,
              }}
            >
              {button.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default NotFound;

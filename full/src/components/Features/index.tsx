// import { IkasComponentRenderer } from "@ikas/bp-storefront";

import { IkasComponentRenderer } from "@ikas/bp-storefront";
import { Props } from "./types";

export function Features(props: Props) {
  const { backgroundColor, components } = props;

  return (
    <section
      className="kombos-features"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="kombos-container kombos-features__container">
        <IkasComponentRenderer
          id="features"
          components={components}
          parentProps={props}
        />
      </div>
    </section>
  );
}

export default Features;

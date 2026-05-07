// import { IkasComponentRenderer } from "@ikas/bp-storefront";
import { IkasComponentRenderer } from "@ikas/bp-storefront";
import { Props } from "./types";

const COLUMNS_MAP: Record<Props["desktopColumns"] & string, number> = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
};

export function CategoryImages(props: Props) {
  const {
    title,
    titleColor,
    backgroundColor,
    desktopColumns,
    mobileColumns,
    components,
  } = props;

  const count = components?.length ?? 0;
  if (count === 0) return null;

  const desktopCols = desktopColumns ? COLUMNS_MAP[desktopColumns] : count;
  const mobileCols = mobileColumns ? COLUMNS_MAP[mobileColumns] : 1;

  return (
    <section
      className="kombos-category-images"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="kombos-category-images__container kombos-container">
        {title && (
          <h2
            className="kombos-category-images__title text-xl-medium md:display-xs-medium"
            style={titleColor ? { color: titleColor } : undefined}
          >
            {title}
          </h2>
        )}

        <div
          className="kombos-category-images__grid"
          style={{
            "--desktop-cols": String(desktopCols),
            "--mobile-cols": String(mobileCols),
          }}
        >
          <IkasComponentRenderer
            id="category-images"
            components={components}
            parentProps={props}
          />
        </div>
      </div>
    </section>
  );
}

export default CategoryImages;

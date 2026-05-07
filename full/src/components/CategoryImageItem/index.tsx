import { Props } from "./types";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import Card from "./components/Card";

export function CategoryImageItem({
  image,
  link,
  overlay = false,
  aspectRatio,
  objectFit,
  mobileImage,
  mobileLink,
  mobileOverlay,
  mobileAspectRatio,
  mobileObjectFit,
}: Props) {
  const desktopImg = image || mobileImage;
  const mobileImg = mobileImage || image;

  if (!desktopImg && !mobileImg) return null;

  const desktopFit = resolveObjectFit(objectFit);
  const mobileFit = mobileObjectFit
    ? resolveObjectFit(mobileObjectFit)
    : desktopFit;

  const desktopAR = aspectRatio ? resolveAspectRatio(aspectRatio) : undefined;
  const mobileAR = mobileAspectRatio
    ? resolveAspectRatio(mobileAspectRatio)
    : desktopAR;

  const mobOverlay = mobileOverlay ?? overlay;

  return (
    <div className="kombos-category-image-item">
      {desktopImg && (
        <Card
          img={desktopImg}
          cssClass="kombos-category-image-item__card--desktop"
          objectFit={desktopFit}
          aspectRatio={desktopAR}
          overlay={overlay}
          label={link?.label}
          href={link?.href || undefined}
          openInNewTab={link?.openInNewTab}
        />
      )}
      {mobileImg && (
        <Card
          img={mobileImg}
          cssClass="kombos-category-image-item__card--mobile"
          objectFit={mobileFit}
          aspectRatio={mobileAR}
          overlay={mobOverlay}
          label={mobileLink?.label}
          href={mobileLink?.href || undefined}
          openInNewTab={mobileLink?.openInNewTab}
        />
      )}
    </div>
  );
}

export default CategoryImageItem;

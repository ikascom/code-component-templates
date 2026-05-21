import { Props } from "./types";
import MediaLinkCard from "../../sub-components/MediaLinkCard";
import type { MediaLinkGridLayout } from "../../global-types";

const LAYOUT_CARD_COUNT: Record<string, number> = {
  "bento-6": 6,
  "featured-3": 3,
  "grid-4": 4,
  "grid-6": 6,
};

const LAYOUT_CARD_SIZES: Record<string, string[]> = {
  "bento-6": [
    "(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw",
  ],
  "featured-3": [
    "(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw",
  ],
  "grid-4": [
    "(max-width: 767px) 100vw, 50vw",
    "(max-width: 767px) 100vw, 50vw",
    "(max-width: 767px) 100vw, 50vw",
    "(max-width: 767px) 100vw, 50vw",
  ],
  "grid-6": [
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  ],
};

export function MediaLinkGrid({
  gridLayout,
  backgroundColor = "#FAF8F5",
  card1Image,
  card1Title,
  card1Link,
  card1ImageAlt,
  card2Image,
  card2Title,
  card2Link,
  card2ImageAlt,
  card3Image,
  card3Title,
  card3Link,
  card3ImageAlt,
  card4Image,
  card4Title,
  card4Link,
  card4ImageAlt,
  card5Image,
  card5Title,
  card5Link,
  card5ImageAlt,
  card6Image,
  card6Title,
  card6Link,
  card6ImageAlt,
}: Props) {
  const layout: MediaLinkGridLayout = (gridLayout || "bento-6") as MediaLinkGridLayout;
  const cardCount = LAYOUT_CARD_COUNT[layout] ?? 6;
  const sizesList = LAYOUT_CARD_SIZES[layout] ?? LAYOUT_CARD_SIZES["bento-6"];

  const cards = [
    { image: card1Image, title: card1Title, link: card1Link, imageAlt: card1ImageAlt },
    { image: card2Image, title: card2Title, link: card2Link, imageAlt: card2ImageAlt },
    { image: card3Image, title: card3Title, link: card3Link, imageAlt: card3ImageAlt },
    { image: card4Image, title: card4Title, link: card4Link, imageAlt: card4ImageAlt },
    { image: card5Image, title: card5Title, link: card5Link, imageAlt: card5ImageAlt },
    { image: card6Image, title: card6Title, link: card6Link, imageAlt: card6ImageAlt },
  ];

  const activeCards = cards.slice(0, cardCount);

  const sectionStyle = backgroundColor
    ? { backgroundColor }
    : undefined;

  return (
    <section
      class={`media-link-grid media-link-grid--${layout}`}
      style={sectionStyle}
    >
      <div class={`media-link-grid__grid media-link-grid__grid--${layout}`}>
        {activeCards.map((card, idx) => (
          <MediaLinkCard
            key={idx}
            className={`media-link-grid__cell media-link-grid__cell--${idx + 1}`}
            image={card.image}
            title={card.title}
            link={card.link}
            imageAlt={card.imageAlt}
            delayIndex={idx}
            sizes={sizesList[idx]}
          />
        ))}
      </div>
    </section>
  );
}

export default MediaLinkGrid;

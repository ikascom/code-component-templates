import { Props } from "./types";

export function RichText({ title, content }: Props) {
  if (!title && !content) return null;

  return (
    <section className="kombos-rich-text">
      <div className="kombos-container">
        {title && (
          <h2 className="kombos-rich-text__title display-xs-semibold">
            {title}
          </h2>
        )}
        {content && (
          <div
            className="kombos-rich-text__content text-md-regular kombos-richtext"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}

export default RichText;

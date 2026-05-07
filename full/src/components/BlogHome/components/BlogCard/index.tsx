import {
  IkasBlog,
  getIkasBlogHref,
  getIkasBlogFormattedDate,
  getIkasBlogCategoryHref,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import { resolveAspectRatio, resolveObjectFit } from "../../../../utils/media";
import { getFullName } from "../../../../utils/fullName";
import { CaretRightSVG } from "../../../../sub-components/icons";
import type { AspectRatio, ObjectFit } from "../../../../global-types";

interface Props {
  blog: IkasBlog;
  readMoreText: string;
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

export default function BlogCard({
  blog,
  readMoreText,
  aspectRatio,
  objectFit,
}: Props) {
  const href = getIkasBlogHref(blog);
  const imageSrc = blog.image ? getDefaultSrc(blog.image) : "";
  const writerName = blog.writer
    ? getFullName(blog.writer.firstName, blog.writer.lastName)
    : "";

  return (
    <div className="kombos-blog-card">
      <a href={href} className="kombos-blog-card__image-link">
        <div
          className="kombos-blog-card__image-wrap"
          style={{ aspectRatio: resolveAspectRatio(aspectRatio) }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={blog.title}
              className="kombos-blog-card__image"
              loading="lazy"
              style={{ objectFit: resolveObjectFit(objectFit) }}
            />
          )}
        </div>
      </a>
      <div className="kombos-blog-card__content">
        {blog.category?.name && (
          <a
            href={getIkasBlogCategoryHref(blog.category)}
            className="kombos-blog-card__category text-xs-semibold"
          >
            {blog.category.name}
          </a>
        )}
        <h2 className="kombos-blog-card__title text-md-semibold md:text-lg-semibold">
          {blog.title}
        </h2>
        {blog.shortDescription && (
          <p className="kombos-blog-card__desc text-sm-regular">
            {blog.shortDescription}
          </p>
        )}
        <div className="kombos-blog-card__footer">
          <div className="kombos-blog-card__meta text-xs-regular">
            <time>{getIkasBlogFormattedDate(blog)}</time>
            {writerName && (
              <>
                <span className="kombos-blog-card__dot">&middot;</span>
                <span>{writerName}</span>
              </>
            )}
          </div>
          <a
            href={href}
            className="kombos-blog-card__read-more text-sm-semibold"
            aria-label={`${readMoreText} - ${blog.title}`}
          >
            {readMoreText}
            <CaretRightSVG />
          </a>
        </div>
      </div>
    </div>
  );
}

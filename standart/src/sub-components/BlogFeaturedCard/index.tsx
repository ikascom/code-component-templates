import { observer } from "@ikas/component-utils";
import {
  IkasBlog,
  getIkasBlogHref,
  getIkasBlogFormattedDate,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";

interface Props {
  blog: IkasBlog;
  readMoreLabel?: string;
  loading?: "lazy" | "eager";
}

const BlogFeaturedCard = observer(function BlogFeaturedCard({
  blog,
  readMoreLabel = "Read Article",
  loading = "eager",
}: Props) {
  if (!blog) return null;

  const href = getIkasBlogHref(blog);
  const date = getIkasBlogFormattedDate(blog);
  const image = blog.image ?? null;
  const imgSrc = image ? getDefaultSrc(image) : null;
  const srcSet = image ? createMediaSrcset(image) : "";
  const category = blog.category?.name;

  return (
    <article class="blog-featured-card">
      <a class="blog-featured-card-media" href={href}>
        {imgSrc ? (
          <img
            class="blog-featured-card-image"
            src={imgSrc}
            srcSet={srcSet || undefined}
            sizes="(max-width: 1023px) 100vw, 55vw"
            alt={blog.title}
            loading={loading}
          />
        ) : (
          <div
            class="blog-featured-card-image blog-featured-card-image--empty"
            aria-hidden="true"
          />
        )}
      </a>

      <div class="blog-featured-card-content">
        {category && (
          <span class="blog-featured-card-category">{category}</span>
        )}
        <h2 class="blog-featured-card-title">
          <a href={href}>{blog.title}</a>
        </h2>
        {blog.shortDescription && (
          <p class="blog-featured-card-excerpt">{blog.shortDescription}</p>
        )}
        {date && <span class="blog-featured-card-date">{date}</span>}
        {readMoreLabel && (
          <a
            class="blog-featured-card-cta"
            href={href}
            aria-label={`${readMoreLabel}: ${blog.title}`}
          >
            <span>{readMoreLabel}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
});

export default BlogFeaturedCard;

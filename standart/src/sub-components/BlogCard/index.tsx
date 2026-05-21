import { observer } from "@ikas/component-utils";
import {
  IkasBlog,
  getIkasBlogHref,
  getIkasBlogFormattedDate,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";

export type BlogCardAspectRatio = "1/1" | "4/3" | "3/4" | "2/3";

interface Props {
  blog: IkasBlog;
  imageAltPrefix?: string;
  loading?: "lazy" | "eager";
  aspectRatio?: BlogCardAspectRatio;
}

const BlogCard = observer(function BlogCard({
  blog,
  imageAltPrefix = "Blog post:",
  loading = "lazy",
  aspectRatio = "1/1",
}: Props) {
  if (!blog) return null;

  const href = getIkasBlogHref(blog);
  const date = getIkasBlogFormattedDate(blog);
  const image = blog.image ?? null;
  const imgSrc = image ? getDefaultSrc(image) : null;
  const srcSet = image ? createMediaSrcset(image) : "";
  const category = blog.category?.name;
  const excerpt = blog.shortDescription;

  const mediaStyle = { aspectRatio: aspectRatio.replace("/", " / ") };

  return (
    <a class="blog-card" href={href}>
      <div class="blog-card-media" style={mediaStyle}>
        {imgSrc ? (
          <img
            class="blog-card-image"
            src={imgSrc}
            srcSet={srcSet || undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={`${imageAltPrefix} ${blog.title}`}
            loading={loading}
          />
        ) : (
          <div class="blog-card-image blog-card-image--empty" aria-hidden="true" />
        )}
      </div>

      <div class="blog-card-body">
        {category && <span class="blog-card-category">{category}</span>}
        <h3 class="blog-card-title">{blog.title}</h3>
        {excerpt && <p class="blog-card-excerpt">{excerpt}</p>}
        {date && <span class="blog-card-date">{date}</span>}
      </div>
    </a>
  );
});

export default BlogCard;

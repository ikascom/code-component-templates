import {
  getIkasBlogFormattedDate,
  getIkasBlogCategoryHref,
  getDefaultSrc,
} from "@ikas/bp-storefront";

import { Props } from "./types";
import Breadcrumb, { BreadcrumbItem } from "../../sub-components/Breadcrumb";
import { resolveAspectRatio, resolveObjectFit } from "../../utils/media";
import { getFullName } from "../../utils/fullName";

export function BlogPost({
  blogPost,
  homeText = "Home",
  blogText = "Blog Posts",
  tagsTitle = "Tags",
  aspectRatio,
  objectFit,
}: Props) {
  if (!blogPost) return null;

  const heroSrc = blogPost.image ? getDefaultSrc(blogPost.image) : "";
  const date = getIkasBlogFormattedDate(blogPost);
  const categoryName = blogPost.category?.name;
  const categoryHref = blogPost.category
    ? getIkasBlogCategoryHref(blogPost.category)
    : "";
  const tags = blogPost.tags ?? [];
  const hasContent = blogPost.blogContent?.content;

  const writerName = getFullName(blogPost.writer?.firstName, blogPost.writer?.lastName);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: homeText, href: "/" },
    { label: blogText, href: "/blog" },
  ];
  if (categoryName && categoryHref) {
    breadcrumbItems.push({ label: categoryName, href: categoryHref });
  }
  breadcrumbItems.push({ label: blogPost.title });

  return (
    <section className="kombos-bp">
      <div className="kombos-container">
        <div className="kombos-bp__article">
          <Breadcrumb items={breadcrumbItems} size="xs" />

          {heroSrc && (
            <div className="kombos-bp__hero-wrap">
              <img
                src={heroSrc}
                alt={blogPost.title}
                className="kombos-bp__hero-img"
                style={{
                  aspectRatio: resolveAspectRatio(aspectRatio),
                  objectFit: resolveObjectFit(objectFit),
                }}
              />
            </div>
          )}

          <div className="kombos-bp__header">
            <div className="kombos-bp__meta">
              {categoryName && categoryHref && (
                <a
                  href={categoryHref}
                  className="kombos-bp__category text-xs-semibold"
                >
                  {categoryName}
                </a>
              )}
              {date && (
                <span className="kombos-bp__date text-xs-regular">{date}</span>
              )}
              {writerName && (
                <span className="kombos-bp__author text-xs-regular">
                  {writerName}
                </span>
              )}
            </div>

            <h1 className="kombos-bp__title text-xl-semibold md:display-xs-semibold">
              {blogPost.title}
            </h1>

            {blogPost.shortDescription && (
              <p className="kombos-bp__desc text-md-regular">
                {blogPost.shortDescription}
              </p>
            )}
          </div>

          {hasContent && (
            <div
              className="kombos-bp__content kombos-richtext"
              dangerouslySetInnerHTML={{
                __html: blogPost.blogContent.content,
              }}
            />
          )}

          {tags.length > 0 && (
            <>
              <hr className="kombos-bp__divider" />
              <div className="kombos-bp__tags">
                <span className="kombos-bp__tags-label text-sm-semibold">
                  {tagsTitle}
                </span>
                <div className="kombos-bp__tags-list">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="kombos-bp__tag text-xs-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default BlogPost;

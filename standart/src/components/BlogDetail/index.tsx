import { useEffect, useMemo, useState } from "preact/hooks";
import {
  getIkasBlogFormattedDate,
  getIkasBlogHref,
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import BlogCard from "../../sub-components/BlogCard";

export function BlogDetail(props: Props) {
  const {
    blogPost,
    blogList,
    relatedPostsTitle = "You Might Also Like",
    showRelatedPosts = true,
    relatedPostsCount = 3,
    showReadTime = true,
    readTimeSuffix = "min read",
    showAuthor = true,
    authorLabel = "Written by",
    showShareButtons = true,
    showBreadcrumb = true,
    breadcrumbHomeLabel = "Home",
    breadcrumbBlogLabel = "Journal",
    breadcrumbBlogUrl = "/blog",
    copyLinkLabel = "Copy link",
    copiedLabel = "Link copied",
    twitterLabel = "Share on X",
    whatsappLabel = "Share on WhatsApp",
    backgroundColor,
    breadcrumbAriaLabel = "Breadcrumb",
  } = props;

  if (!blogPost) return null;

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [blogPost.id]);

  const heroImage = blogPost.image ?? null;
  const heroSrc = heroImage ? getDefaultSrc(heroImage) : null;
  const heroSrcSet = heroImage ? createMediaSrcset(heroImage) : "";

  const formattedDate = getIkasBlogFormattedDate(blogPost);
  const category = blogPost.category;
  const categoryName = category?.name;
  const writerName = useMemo(() => {
    const w = blogPost.writer;
    if (!w) return "";
    return [w.firstName, w.lastName].filter(Boolean).join(" ").trim();
  }, [blogPost.writer]);

  const rawContent = blogPost.blogContent?.content ?? "";
  const readTime = useMemo(() => {
    if (!rawContent) return 0;
    const stripped = rawContent.replace(/<[^>]*>/g, " ");
    const words = stripped.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [rawContent]);

  const related = useMemo(() => {
    const all = blogList?.data ?? [];
    const candidates = all.filter((b) => b.id !== blogPost.id);
    const inCategory = candidates.filter(
      (b) => b.categoryId === blogPost.categoryId
    );
    const others = candidates.filter(
      (b) => b.categoryId !== blogPost.categoryId
    );
    const sortByDate = (arr: typeof candidates) =>
      [...arr].sort((a, b) => {
        const aDate = a.publishedAt ?? a.createdAt ?? 0;
        const bDate = b.publishedAt ?? b.createdAt ?? 0;
        return bDate - aDate;
      });
    const merged = [...sortByDate(inCategory), ...sortByDate(others)];
    const count = Math.max(1, relatedPostsCount ?? 3);
    return merged.slice(0, count);
  }, [blogList?.data, blogPost.id, blogPost.categoryId, relatedPostsCount]);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedTitle = encodeURIComponent(blogPost.title || "");
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappHref = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const breadcrumbItems = [
    { label: breadcrumbHomeLabel, href: "/" },
    { label: breadcrumbBlogLabel, href: breadcrumbBlogUrl },
  ];
  if (categoryName) {
    breadcrumbItems.push({
      label: categoryName,
      href: category ? `/blog?category=${category.id}` : "",
    });
  }

  const sectionStyle = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section class="blog-detail" style={sectionStyle}>
      <div class="blog-detail-inner">
        <article class="blog-detail-article">
          {showBreadcrumb && (
            <nav class="blog-detail-breadcrumb" aria-label={breadcrumbAriaLabel}>
              <ol>
                {breadcrumbItems.map((item, idx) => (
                  <li key={`${item.label}-${idx}`}>
                    {item.href ? (
                      <a href={item.href}>{item.label}</a>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    {idx < breadcrumbItems.length && (
                      <span class="blog-detail-breadcrumb-sep" aria-hidden="true">
                        /
                      </span>
                    )}
                  </li>
                ))}
                <li aria-current="page">
                  <span>{blogPost.title}</span>
                </li>
              </ol>
            </nav>
          )}

          {heroSrc && (
            <div class="blog-detail-hero">
              <img
                class="blog-detail-hero-image"
                src={heroSrc}
                srcSet={heroSrcSet || undefined}
                sizes="(max-width: 1024px) 100vw, 1200px"
                alt={blogPost.title}
                loading="eager"
              />
            </div>
          )}

          <header class="blog-detail-header">
            {categoryName && (
              <span class="blog-detail-category">{categoryName}</span>
            )}
            <h1 class="blog-detail-title">{blogPost.title}</h1>
            <div class="blog-detail-meta">
              {formattedDate && <span>{formattedDate}</span>}
              {showReadTime && readTime > 0 && (
                <>
                  <span class="blog-detail-meta-dot" aria-hidden="true">·</span>
                  <span>
                    {readTime} {readTimeSuffix}
                  </span>
                </>
              )}
            </div>
          </header>

          {rawContent && (
            <div
              class="blog-detail-content blog-content"
              dangerouslySetInnerHTML={{ __html: rawContent }}
            />
          )}

          {(showAuthor || showShareButtons) && (
            <>
              <hr class="blog-detail-divider" />
              <footer class="blog-detail-footer">
                {showAuthor && writerName && (
                  <div class="blog-detail-author">
                    <div
                      class="blog-detail-author-avatar"
                      aria-hidden="true"
                    >
                      {writerName.charAt(0)}
                    </div>
                    <div class="blog-detail-author-text">
                      <span class="blog-detail-author-label">
                        {authorLabel}
                      </span>
                      <span class="blog-detail-author-name">{writerName}</span>
                    </div>
                  </div>
                )}

                {showShareButtons && (
                  <div class="blog-detail-share">
                    <button
                      type="button"
                      class="blog-detail-share-btn"
                      aria-label={copyLinkLabel}
                      onClick={handleCopy}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1" />
                        <path d="M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />
                      </svg>
                      {copied && (
                        <span class="blog-detail-share-tooltip" role="status">
                          {copiedLabel}
                        </span>
                      )}
                    </button>
                    <a
                      class="blog-detail-share-btn"
                      href={twitterHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={twitterLabel}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2H21l-6.52 7.45L22 22h-6.95l-4.6-6.04L4.93 22H2.17l7.02-8.02L2 2h7.05l4.2 5.55L18.24 2zm-1.2 18h1.62L7.04 4H5.4l11.64 16z" />
                      </svg>
                    </a>
                    <a
                      class="blog-detail-share-btn"
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={whatsappLabel}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M20.52 3.48A11.93 11.93 0 0012.05 0C5.5 0 .18 5.32.18 11.87c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.66a11.85 11.85 0 005.69 1.45h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.24-6.16-3.41-8.44zM12.06 21.5h-.01a9.62 9.62 0 01-4.9-1.34l-.35-.21-3.77.99 1-3.67-.23-.38a9.6 9.6 0 01-1.46-5.02c0-5.31 4.32-9.63 9.63-9.63 2.57 0 4.99 1 6.81 2.82a9.55 9.55 0 012.82 6.81c0 5.31-4.32 9.63-9.54 9.63zm5.27-7.21c-.29-.14-1.71-.84-1.97-.94-.26-.1-.45-.14-.65.14-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.14-1.21-.45-2.31-1.43-.85-.76-1.43-1.7-1.6-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43s1.04 2.82 1.19 3.02c.14.19 2.05 3.13 4.97 4.39.69.3 1.23.48 1.66.62.7.22 1.33.19 1.83.12.56-.08 1.71-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
                      </svg>
                    </a>
                  </div>
                )}
              </footer>
            </>
          )}
        </article>

        {showRelatedPosts && related.length > 0 && (
          <section class="blog-detail-related" aria-labelledby="related-heading">
            <h2 class="blog-detail-related-title" id="related-heading">
              {relatedPostsTitle}
            </h2>
            <div class="blog-detail-related-grid">
              {related.map((blog, i) => (
                <div
                  class="blog-detail-related-item"
                  key={blog.id}
                  style={{
                    ["--blog-related-delay" as any]: `${i * 80}ms`,
                  }}
                >
                  <BlogCard blog={blog} aspectRatio="1/1" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default BlogDetail;

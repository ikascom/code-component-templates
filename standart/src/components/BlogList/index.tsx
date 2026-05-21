import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import {
  IkasBlog,
  IkasBlogCategory,
  getBlogListNextPage,
  hasBlogListNextPage,
  getIkasBlogCategoryHref,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import BlogCard from "../../sub-components/BlogCard";
import BlogFeaturedCard from "../../sub-components/BlogFeaturedCard";

export function BlogList(props: Props) {
  const {
    blogList,
    blogCategoryList,
    pageTitle = "Journal",
    showPageTitle = true,
    pageSubtitle = "Stories, tips & inspiration",
    showPageSubtitle = true,
    allCategoryLabel = "All",
    postsPerPage = 7,
    loadMoreCount = 6,
    loadMoreLabel = "Load More Articles",
    loadingLabel = "Loading...",
    readMoreLabel = "Read Article",
    emptyStateText = "No posts yet — check back soon.",
    backgroundColor,
    cardAspectRatio = "1/1",
    categoriesNavAriaLabel = "Blog categories",
  } = props;

  if (!blogList) {
    return (
      <section
        class="blog-list"
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div class="blog-list-inner">
          <p class="blog-list-empty">{emptyStateText}</p>
        </div>
      </section>
    );
  }

  return (
    <BlogListInner
      blogList={blogList}
      blogCategoryList={blogCategoryList}
      pageTitle={pageTitle}
      showPageTitle={!!showPageTitle}
      pageSubtitle={pageSubtitle}
      showPageSubtitle={!!showPageSubtitle}
      allCategoryLabel={allCategoryLabel}
      postsPerPage={Math.max(1, postsPerPage ?? 7)}
      loadMoreCount={Math.max(1, loadMoreCount ?? 6)}
      loadMoreLabel={loadMoreLabel}
      loadingLabel={loadingLabel}
      readMoreLabel={readMoreLabel}
      emptyStateText={emptyStateText}
      backgroundColor={backgroundColor}
      cardAspectRatio={cardAspectRatio}
      categoriesNavAriaLabel={categoriesNavAriaLabel}
    />
  );
}

interface InnerProps {
  blogList: NonNullable<Props["blogList"]>;
  blogCategoryList?: Props["blogCategoryList"];
  pageTitle: string;
  showPageTitle: boolean;
  pageSubtitle: string;
  showPageSubtitle: boolean;
  allCategoryLabel: string;
  postsPerPage: number;
  loadMoreCount: number;
  loadMoreLabel: string;
  loadingLabel: string;
  readMoreLabel: string;
  emptyStateText: string;
  backgroundColor?: string;
  cardAspectRatio: NonNullable<Props["cardAspectRatio"]>;
  categoriesNavAriaLabel: string;
}

const BlogListInner = observer(function BlogListInner({
  blogList,
  blogCategoryList,
  pageTitle,
  showPageTitle,
  pageSubtitle,
  showPageSubtitle,
  allCategoryLabel,
  postsPerPage,
  loadMoreCount,
  loadMoreLabel,
  loadingLabel,
  readMoreLabel,
  emptyStateText,
  backgroundColor,
  cardAspectRatio,
  categoriesNavAriaLabel,
}: InnerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(postsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [gridFade, setGridFade] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const allBlogs = useMemo(() => {
    const data = blogList.data ?? [];
    return [...data].sort((a, b) => {
      const aDate = a.publishedAt ?? a.createdAt ?? 0;
      const bDate = b.publishedAt ?? b.createdAt ?? 0;
      return bDate - aDate;
    });
  }, [blogList.data]);

  const categories = blogCategoryList?.data ?? [];

  const isCategoryPage = !!blogList.filterCategoryId;
  const serverCategory: IkasBlogCategory | null = useMemo(() => {
    if (!isCategoryPage) return null;
    const fromProps = categories.find(
      (c) => c.id === blogList.filterCategoryId
    );
    if (fromProps) return fromProps;
    const fromPost = (blogList.data ?? []).find(
      (b) => b.categoryId === blogList.filterCategoryId
    );
    return fromPost?.category ?? null;
  }, [isCategoryPage, categories, blogList.filterCategoryId, blogList.data]);

  const effectiveTitle = serverCategory?.name ?? pageTitle;

  const filteredBlogs = useMemo(() => {
    if (isCategoryPage || !activeCategoryId) return allBlogs;
    return allBlogs.filter((b) => b.categoryId === activeCategoryId);
  }, [allBlogs, activeCategoryId, isCategoryPage]);

  const featured = filteredBlogs[0] ?? null;
  const remaining = filteredBlogs.slice(1);
  const gridVisible = remaining.slice(0, Math.max(0, visibleCount - 1));
  const hasMoreInMemory = remaining.length > gridVisible.length;
  const hasMoreInApi = hasBlogListNextPage(blogList);
  const showLoadMore = hasMoreInMemory || hasMoreInApi;

  const handleCategorySelect = (id: string | null) => {
    if (id === activeCategoryId) return;
    setGridFade(true);
    window.setTimeout(() => {
      setActiveCategoryId(id);
      setVisibleCount(postsPerPage);
      setGridFade(false);
    }, 200);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    if (hasMoreInMemory) {
      setVisibleCount((v) => v + loadMoreCount);
      return;
    }
    if (hasMoreInApi) {
      setIsLoadingMore(true);
      try {
        await getBlogListNextPage(blogList);
        setVisibleCount((v) => v + loadMoreCount);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    setVisibleCount(postsPerPage);
  }, [postsPerPage]);

  const sectionStyle = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section class="blog-list" style={sectionStyle}>
      <div class="blog-list-inner">
        {(showPageTitle || (showPageSubtitle && !isCategoryPage)) && (
          <header class="blog-list-header">
            {showPageTitle && effectiveTitle && (
              <h1 class="blog-list-title">{effectiveTitle}</h1>
            )}
            {showPageSubtitle && !isCategoryPage && pageSubtitle && (
              <p class="blog-list-subtitle">{pageSubtitle}</p>
            )}
          </header>
        )}

        {categories.length > 0 && (
          <nav class="blog-list-categories" aria-label={categoriesNavAriaLabel}>
            {isCategoryPage ? (
              <a
                class="blog-list-cat-btn"
                href="/blog"
              >
                {allCategoryLabel}
              </a>
            ) : (
              <button
                type="button"
                class={`blog-list-cat-btn ${
                  !activeCategoryId ? "is-active" : ""
                }`}
                aria-pressed={!activeCategoryId ? "true" : "false"}
                onClick={() => handleCategorySelect(null)}
              >
                {allCategoryLabel}
              </button>
            )}
            {categories.map((cat) => {
              const isActive = isCategoryPage
                ? blogList.filterCategoryId === cat.id
                : activeCategoryId === cat.id;
              if (isCategoryPage) {
                return (
                  <a
                    key={cat.id}
                    class={`blog-list-cat-btn ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    href={getIkasBlogCategoryHref(cat)}
                  >
                    {cat.name}
                  </a>
                );
              }
              return (
                <button
                  type="button"
                  key={cat.id}
                  class={`blog-list-cat-btn ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive ? "true" : "false"}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>
        )}

        {filteredBlogs.length === 0 ? (
          <p class="blog-list-empty">{emptyStateText}</p>
        ) : (
          <div
            class={`blog-list-content ${gridFade ? "is-fading" : ""}`}
            aria-live="polite"
          >
            {featured && (
              <div class="blog-list-featured">
                <BlogFeaturedCard
                  blog={featured}
                  readMoreLabel={readMoreLabel}
                  loading="eager"
                />
              </div>
            )}

            {gridVisible.length > 0 && (
              <div class="blog-list-grid" ref={gridRef}>
                {gridVisible.map((blog: IkasBlog, i: number) => (
                  <div
                    class="blog-list-grid-item"
                    key={blog.id}
                    style={{
                      ["--blog-grid-delay" as any]: `${
                        (i % loadMoreCount) * 80
                      }ms`,
                    }}
                  >
                    <BlogCard blog={blog} aspectRatio={cardAspectRatio} />
                  </div>
                ))}
              </div>
            )}

            {showLoadMore && (
              <div class="blog-list-load-more-wrap">
                <button
                  type="button"
                  class="blog-list-load-more"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? loadingLabel : loadMoreLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default BlogList;

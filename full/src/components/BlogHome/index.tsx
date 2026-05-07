import {
  IkasBlogList,
  IkasBlog,
  getBlogListPage,
  getBlogListPageCount,
  hasBlogListPrevPage,
  hasBlogListNextPage,
  getIkasBlogCategoryHref,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import Pagination from "../../sub-components/Pagination";
import BlogCard from "./components/BlogCard";
import { Props } from "./types";

export function BlogHome({
  blogList,
  blogCategoryList,
  title = "Blog",
  description,
  allCategoriesText = "View All",
  readMoreText = "Read More",
  emptyMessage = "No blog posts found yet.",
  aspectRatio,
  objectFit,
}: Props) {
  if (!blogList) return null;

  const activeCategoryId = blogList.filterCategoryId;
  const categories = blogCategoryList?.data ?? [];
  const blogs = blogList.data ?? [];

  return (
    <section className="kombos-blog-home">
      <div className="kombos-container">
        <div className="kombos-blog-home__header">
          <h1 className="kombos-blog-home__title text-xl-semibold md:display-xs-semibold">
            {title}
          </h1>
          {description && (
            <p className="kombos-blog-home__description text-md-regular">
              {description}
            </p>
          )}
        </div>

        {categories.length > 0 && (
          <div className="kombos-blog-home__categories">
            <a
              href="/blog"
              className={cx(
                "kombos-blog-home__cat-btn",
                "text-sm-medium",
                !activeCategoryId && "kombos-blog-home__cat-btn--active",
              )}
            >
              {allCategoriesText}
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={getIkasBlogCategoryHref(cat)}
                className={cx(
                  "kombos-blog-home__cat-btn",
                  "text-sm-medium",
                  activeCategoryId === cat.id &&
                    "kombos-blog-home__cat-btn--active",
                )}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {blogs.length === 0 ? (
          <p className="kombos-blog-home__empty text-md-semibold">
            {emptyMessage}
          </p>
        ) : (
          <div className="kombos-blog-home__grid">
            {blogs.map((blog: IkasBlog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                readMoreText={readMoreText}
                aspectRatio={aspectRatio}
                objectFit={objectFit}
              />
            ))}
          </div>
        )}

        <BlogPagination blogList={blogList} />
      </div>
    </section>
  );
}

const BlogPagination = observer(function BlogPagination({
  blogList,
}: {
  blogList: IkasBlogList;
}) {
  const currentPage = blogList.page ?? 1;
  const totalPages = getBlogListPageCount(blogList);

  const goToPage = (page: number) => {
    getBlogListPage(blogList, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      hasPrev={hasBlogListPrevPage(blogList)}
      hasNext={hasBlogListNextPage(blogList)}
      onPageChange={goToPage}
    />
  );
});

export default BlogHome;

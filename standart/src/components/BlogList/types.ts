// This file is auto-generated — do not edit manually.
import type { IkasBlogList, IkasBlogCategoryList } from "@ikas/bp-storefront";
import type { BlogCardRatio } from "../../global-types";

export interface Props {
  blogList: IkasBlogList;
  blogCategoryList?: IkasBlogCategoryList;
  pageTitle?: string;
  showPageTitle?: boolean;
  pageSubtitle?: string;
  showPageSubtitle?: boolean;
  allCategoryLabel?: string;
  postsPerPage?: number;
  loadMoreCount?: number;
  loadMoreLabel?: string;
  loadingLabel?: string;
  readMoreLabel?: string;
  emptyStateText?: string;
  backgroundColor?: string;
  cardAspectRatio?: BlogCardRatio;
  categoriesNavAriaLabel?: string;
}

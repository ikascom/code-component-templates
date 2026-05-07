import { observer } from "@ikas/component-utils";
import { cx } from "../../utils/cx";
import { getPageNumbers } from "../../utils/pagination";
import {
  CaretDoubleLeftSVG,
  CaretLeftSVG,
  CaretRightSVG,
  CaretDoubleRightSVG,
  DotsThreeSVG,
} from "../icons";

interface Props {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = observer(function Pagination({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const showFirstBtn = totalPages > 5 && currentPage >= 5;
  const showLastBtn = totalPages > 5 && currentPage <= totalPages - 4;

  return (
    <nav className="kombos-pagination" aria-label="Pagination">
      <div className="kombos-pagination__nav-group">
        {showFirstBtn && (
          <button
            type="button"
            className="kombos-pagination__nav-btn"
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            <CaretDoubleLeftSVG />
          </button>
        )}
        <button
          type="button"
          className="kombos-pagination__nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <CaretLeftSVG />
        </button>
      </div>

      <div className="kombos-pagination__pages">
        {pages.map((page, i) =>
          page === "dots" ? (
            <span key={`dots-${i}`} className="kombos-pagination__dots">
              <DotsThreeSVG />
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={cx(
                "kombos-pagination__page",
                "text-md-semibold",
                page === currentPage && "kombos-pagination__page--active"
              )}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <div className="kombos-pagination__nav-group">
        <button
          type="button"
          className="kombos-pagination__nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <CaretRightSVG />
        </button>
        {showLastBtn && (
          <button
            type="button"
            className="kombos-pagination__nav-btn"
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            <CaretDoubleRightSVG />
          </button>
        )}
      </div>
    </nav>
  );
});

export default Pagination;

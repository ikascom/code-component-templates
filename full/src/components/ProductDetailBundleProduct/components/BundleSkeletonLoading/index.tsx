interface Props {
  count?: number;
  variant?: "card" | "table";
}

export default function BundleSkeletonLoading({ count = 3, variant = "card" }: Props) {
  if (variant === "table") {
    return (
      <div className="kombos-bundle-skeleton-table">
        <div className="kombos-bundle-skeleton-table__header kombos-bundle-skeleton__shimmer" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="kombos-bundle-skeleton-table__row">
            <div className="kombos-bundle-skeleton__bar kombos-bundle-skeleton__bar--wide kombos-bundle-skeleton__shimmer" />
            <div className="kombos-bundle-skeleton__bar kombos-bundle-skeleton__bar--price kombos-bundle-skeleton__shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="kombos-bundle-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kombos-bundle-skeleton__item">
          <div className="kombos-bundle-skeleton__image kombos-bundle-skeleton__shimmer" />
          <div className="kombos-bundle-skeleton__info">
            <div className="kombos-bundle-skeleton__bar kombos-bundle-skeleton__bar--wide kombos-bundle-skeleton__shimmer" />
            <div className="kombos-bundle-skeleton__bar kombos-bundle-skeleton__bar--medium kombos-bundle-skeleton__shimmer" />
            <div className="kombos-bundle-skeleton__bar kombos-bundle-skeleton__bar--narrow kombos-bundle-skeleton__shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

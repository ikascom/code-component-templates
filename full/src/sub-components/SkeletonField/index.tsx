interface Props {
  labelWidth?: string;
}

export default function SkeletonField({ labelWidth = "40%" }: Props) {
  return (
    <div className="kombos-skeleton-field">
      <div className="kombos-skeleton-field__label" style={{ width: labelWidth }} />
      <div className="kombos-skeleton-field__input" />
    </div>
  );
}

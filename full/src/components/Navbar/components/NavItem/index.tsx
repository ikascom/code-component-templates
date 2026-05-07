import { IkasNavigationLink } from "@ikas/bp-storefront";
import { CaretDownSVG, CaretRightSVG } from "../../../../sub-components/icons";

interface Props {
  link: IkasNavigationLink;
  linkColor?: string;
}

export default function NavItem({ link, linkColor }: Props) {
  const hasSubLinks = link.subLinks && link.subLinks.length > 0;

  return (
    <div className="kombos-header__nav-item">
      <a
        href={link.href}
        className="kombos-header__nav-link text-md-medium"
        style={{ color: linkColor ?? "var(--kombos-gray-700)" }}
        target={link.openInNewTab ? "_blank" : undefined}
      >
        {link.label}
        {hasSubLinks && <CaretDownSVG className="kombos-header__chevron" />}
      </a>
      {hasSubLinks && (
        <div className="kombos-header__dropdown">
          {link.subLinks!.map((sub: IkasNavigationLink, j: number) => {
            const hasNestedLinks = sub.subLinks && sub.subLinks.length > 0;
            return (
              <div key={j} className="kombos-header__dropdown-item">
                <a
                  href={sub.href}
                  className="kombos-header__dropdown-link text-md-medium"
                  target={sub.openInNewTab ? "_blank" : undefined}
                >
                  <span>{sub.label}</span>
                  {hasNestedLinks && (
                    <CaretRightSVG className="kombos-header__caret-right" />
                  )}
                </a>
                {hasNestedLinks && (
                  <div className="kombos-header__dropdown kombos-header__dropdown--nested">
                    {sub.subLinks!.map(
                      (child: IkasNavigationLink, k: number) => (
                        <div key={k} className="kombos-header__dropdown-item">
                          <a
                            href={child.href}
                            className="kombos-header__dropdown-link text-md-medium"
                            target={
                              child.openInNewTab ? "_blank" : undefined
                            }
                          >
                            <span>{child.label}</span>
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

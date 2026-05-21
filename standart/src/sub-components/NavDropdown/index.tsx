import { observer } from "@ikas/component-utils";
import { IkasNavigationLink } from "@ikas/bp-storefront";

interface Props {
  links: IkasNavigationLink[];
  visible: boolean;
}

const NavDropdown = observer(function NavDropdown({ links, visible }: Props) {
  if (!links.length) return null;

  return (
    <div class={`nav-dropdown${visible ? " nav-dropdown--visible" : ""}`} role="region">
      <ul class="nav-dropdown-list" role="list">
        {links.map((link, i) => (
          <li key={`${i}-${link.href}`} class="nav-dropdown-item">
            <a
              href={link.href}
              class="nav-dropdown-link"
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
            {link.subLinks?.length > 0 && (
              <ul class="nav-dropdown-sub-list" role="list">
                {link.subLinks.map((sub, j) => (
                  <li key={`${j}-${sub.href}`} class="nav-dropdown-sub-item">
                    <a
                      href={sub.href}
                      class="nav-dropdown-sub-link"
                      target={sub.openInNewTab ? "_blank" : undefined}
                      rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                    >
                      {sub.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default NavDropdown;

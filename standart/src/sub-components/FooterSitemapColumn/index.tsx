import { observer } from "@ikas/component-utils";
import { useState, useId } from "preact/hooks";
import { IkasNavigationLink } from "@ikas/bp-storefront";

interface Props {
  title: string;
  links: IkasNavigationLink[];
}

const ChevronIcon = () => (
  <svg
    class="footer-column__chevron"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FooterSitemapColumn = observer(function FooterSitemapColumn({ title, links }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `footer-col-${useId()}`;

  if (!title || !links.length) return null;

  return (
    <div class="footer-column" data-open={isOpen ? "true" : "false"}>
      <h3 class="footer-column__heading">
        <button
          type="button"
          class="footer-column__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span class="footer-column__title">{title}</span>
          <ChevronIcon />
        </button>
      </h3>
      <ul id={panelId} class="footer-column__panel" role="list">
        {links.map((link) => (
          <li key={link.href + link.label} class="footer-column__item">
            <a
              href={link.href}
              class="footer-column__link"
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default FooterSitemapColumn;

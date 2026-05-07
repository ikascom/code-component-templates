import {
  IkasNavigationLink,
  IkasComponentRenderer,
  createMediaSrcset,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import { IkasLogoSVG } from "../../sub-components/icons";

export function Footer(props: Props) {
  const {
    logo,
    description,
    copyrightText = "© 2026 ikas Store. All Rights Reserved",
    linkColor,
    linkHoverColor,
    contactTitle = "Contact Information",
    contactEmail,
    contactPhone,
    footerLinks,
    socialMediaIcons,
  } = props;

  const columns = footerLinks?.links ?? [];
  const hasContact = !!(contactEmail || contactPhone);
  const hasSocials = socialMediaIcons?.length > 0;

  return (
    <footer
      className="kombos-footer"
      style={{
...(linkColor ? { "--footer-link-color": linkColor } : {}),
        ...(linkHoverColor
          ? { "--footer-link-hover-color": linkHoverColor }
          : {}),
      }}
    >
      <div className="kombos-footer__wrapper kombos-container">
        <div className="kombos-footer__top">
          {/* Brand column */}
          <div className="kombos-footer__brand">
            {logo && (
              <div className="kombos-footer__logo-wrap">
                <img
                  src={getDefaultSrc(logo)}
                  srcSet={createMediaSrcset(logo)}
                  sizes="96px"
                  alt={logo?.altText || "Logo"}
                  className="kombos-footer__logo-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            {description && (
              <div
                className="kombos-footer__desc text-sm-regular"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {hasSocials && (
              <div className="kombos-footer__socials">
                <IkasComponentRenderer
                  id="footer-socials"
                  components={socialMediaIcons}
                  parentProps={props}
                />
              </div>
            )}
          </div>

          {/* Link columns */}
          {(columns.length > 0 || hasContact) && (
            <div className="kombos-footer__columns">
              {columns.map((column: IkasNavigationLink, i: number) => (
                <div key={i} className="kombos-footer__col">
                  <p className="kombos-footer__col-title text-sm-medium">
                    {column.label}
                  </p>
                  {column.subLinks?.length > 0 && (
                    <nav className="kombos-footer__col-links">
                      {column.subLinks.map(
                        (link: IkasNavigationLink, j: number) => (
                          <a
                            key={j}
                            href={link.href}
                            className="kombos-footer__col-link text-sm-regular"
                            target={link.openInNewTab ? "_blank" : undefined}
                            rel={
                              link.openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {link.label}
                          </a>
                        ),
                      )}
                    </nav>
                  )}
                </div>
              ))}

              {/* Contact column */}
              {hasContact && (
                <div className="kombos-footer__col">
                  <p className="kombos-footer__col-title text-sm-medium">
                    {contactTitle}
                  </p>
                  <div className="kombos-footer__col-links">
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="kombos-footer__col-link text-sm-regular"
                      >
                        {contactEmail}
                      </a>
                    )}
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone.replace(/\s/g, "")}`}
                        className="kombos-footer__col-link text-sm-regular"
                      >
                        {contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="kombos-footer__bottom">
          <div
            className="kombos-footer__copyright text-xs-regular"
            dangerouslySetInnerHTML={{ __html: copyrightText }}
          />
          <div className="kombos-footer__badge">
            <IkasLogoSVG className="kombos-footer__badge-logo" />
            <span className="kombos-footer__badge-text text-xs-medium">
              Powered by ikas E-Commerce.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { getDefaultSrc, createMediaSrcset, IkasNavigationLink } from "@ikas/bp-storefront";
import { Props } from "./types";
import FooterSitemapColumn from "../../sub-components/FooterSitemapColumn";
import FooterContactBlock from "../../sub-components/FooterContactBlock";
import FooterBottomBar from "../../sub-components/FooterBottomBar";

const PLACEHOLDER_LINKS: Record<1 | 2 | 3, IkasNavigationLink[]> = {
  1: [
    { href: "/collections/all", label: "All Products", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/collections/skincare", label: "Skincare", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/collections/wellness", label: "Wellness", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/collections/new-arrivals", label: "New Arrivals", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/collections/gift-sets", label: "Gift Sets", subLinks: [], type: "PAGE" as any, openInNewTab: false },
  ],
  2: [
    { href: "/about", label: "Our Story", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/sustainability", label: "Sustainability", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/journal", label: "The Journal", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/stockists", label: "Stockists", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/careers", label: "Careers", subLinks: [], type: "PAGE" as any, openInNewTab: false },
  ],
  3: [
    { href: "/help/shipping", label: "Shipping & Delivery", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/help/returns", label: "Returns & Exchanges", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/help/faq", label: "FAQ", subLinks: [], type: "PAGE" as any, openInNewTab: false },
    { href: "/contact", label: "Contact Us", subLinks: [], type: "PAGE" as any, openInNewTab: false },
  ],
};

function resolveColumnLinks(
  slot: 1 | 2 | 3 | 4,
  list?: { links: IkasNavigationLink[] }
): IkasNavigationLink[] {
  if (list?.links?.length) return list.links;
  if (slot === 4) return [];
  return PLACEHOLDER_LINKS[slot];
}

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 4c.5 2.4 2.4 4 4.5 4" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="2.5" y="6" width="19" height="12" rx="3" />
    <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 8h2.5V5H14a3 3 0 0 0-3 3v2H9v3h2v8h3v-8h2.3l.7-3H14V8.5c0-.3.2-.5.5-.5Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m4 4 16 16M20 4 4 20" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M11.5 7.5c2.2-.3 4.5 1 4.5 3.5 0 2.5-1.7 4-3.5 4-1 0-1.7-.5-2-1.2M11 11l-1.5 8" />
  </svg>
);

export function Footer(props: Props) {
  const {
    logoImage,
    logoText = "Congara",
    tagline,
    instagramUrl,
    tiktokUrl,
    youtubeUrl,
    facebookUrl,
    xUrl,
    pinterestUrl,
    column1Title = "Shop",
    column1Links,
    column2Title = "Company",
    column2Links,
    column3Title = "Support",
    column3Links,
    column4Title,
    column4Links,
    contactTitle = "Contact",
    contactAddress,
    contactPhone,
    contactEmail,
    contactHours,
    copyrightText = "© 2026 Brand Name. All rights reserved.",
    privacyPolicyLink,
    termsLink,
    cookieLink,
    showVisa,
    showMastercard,
    showTroy,
    showIyzico,
    showPaytr,
    showBankTransfer,
    backgroundColor,
    bottomBarBackgroundColor,
    legalNavAriaLabel,
    paymentsAriaLabel,
  } = props;

  const sitemapColumns = [
    { title: column1Title, links: resolveColumnLinks(1, column1Links) },
    { title: column2Title, links: resolveColumnLinks(2, column2Links) },
    { title: column3Title, links: resolveColumnLinks(3, column3Links) },
    { title: column4Title ?? "", links: resolveColumnLinks(4, column4Links) },
  ].filter((c) => c.title && c.links.length > 0);

  const socials: { url?: string; label: string; Icon: () => any }[] = [
    { url: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { url: tiktokUrl, label: "TikTok", Icon: TikTokIcon },
    { url: youtubeUrl, label: "YouTube", Icon: YouTubeIcon },
    { url: facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { url: xUrl, label: "X (Twitter)", Icon: XIcon },
    { url: pinterestUrl, label: "Pinterest", Icon: PinterestIcon },
  ].filter((s) => !!s.url);

  const logoSrc = logoImage ? getDefaultSrc(logoImage) : null;

  return (
    <section
      className="footer-section"
      style={backgroundColor ? { backgroundColor } : undefined}
      aria-labelledby="footer-brand-title"
    >
      <div className="footer-section__main">
        <div className="footer-section__container footer-section__grid">
          <div className="footer-section__brand">
            {logoSrc ? (
              <img
                src={logoSrc}
                srcSet={createMediaSrcset(logoImage)}
                sizes="160px"
                alt={logoImage?.altText || logoText || "Logo"}
                className="footer-section__logo-img"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span id="footer-brand-title" className="footer-section__logo-text">
                {logoText}
              </span>
            )}

            {tagline && <p className="footer-section__tagline">{tagline}</p>}

            {socials.length > 0 && (
              <ul className="footer-section__socials" role="list">
                {socials.map(({ url, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={url}
                      className="footer-section__social-link"
                      aria-label={label}
                      target={url && url !== "#" ? "_blank" : undefined}
                      rel={url && url !== "#" ? "noopener noreferrer" : undefined}
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="footer-section__columns">
            {sitemapColumns.map((col) => (
              <FooterSitemapColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>

          <div className="footer-section__contact">
            <FooterContactBlock
              title={contactTitle}
              address={contactAddress}
              phone={contactPhone}
              email={contactEmail}
              hours={contactHours}
            />
          </div>
        </div>
      </div>

      <div
        className="footer-section__bottom"
        style={bottomBarBackgroundColor ? { backgroundColor: bottomBarBackgroundColor } : undefined}
      >
        <div className="footer-section__container">
          <FooterBottomBar
            copyrightText={copyrightText}
            legalLinks={[privacyPolicyLink, termsLink, cookieLink]}
            payments={{
              showVisa,
              showMastercard,
              showTroy,
              showIyzico,
              showPaytr,
              showBankTransfer,
            }}
            legalNavAriaLabel={legalNavAriaLabel}
            paymentsAriaLabel={paymentsAriaLabel}
          />
        </div>
      </div>
    </section>
  );
}

export default Footer;

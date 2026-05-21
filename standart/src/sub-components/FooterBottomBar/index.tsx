import { observer } from "@ikas/component-utils";
import { Fragment } from "preact";
import { IkasNavigationLink } from "@ikas/bp-storefront";
import {
  PaymentVisa,
  PaymentMastercard,
  PaymentTroy,
  PaymentIyzico,
  PaymentPaytr,
  PaymentBank,
} from "./payment-icons";

interface PaymentFlags {
  showVisa?: boolean;
  showMastercard?: boolean;
  showTroy?: boolean;
  showIyzico?: boolean;
  showPaytr?: boolean;
  showBankTransfer?: boolean;
}

interface Props {
  copyrightText: string;
  legalLinks: (IkasNavigationLink | null | undefined)[];
  payments: PaymentFlags;
  legalNavAriaLabel?: string;
  paymentsAriaLabel?: string;
}

const FooterBottomBar = observer(function FooterBottomBar({
  copyrightText,
  legalLinks,
  payments,
  legalNavAriaLabel = "Legal",
  paymentsAriaLabel = "Accepted payment methods",
}: Props) {
  const visibleLegal = legalLinks.filter(
    (l): l is IkasNavigationLink => !!l && !!l.label && !!l.href
  );
  const paymentMethods: { key: string; show: boolean; alt: string; Icon: () => any }[] = [
    { key: "visa", show: !!payments.showVisa, alt: "Visa", Icon: PaymentVisa },
    { key: "mc", show: !!payments.showMastercard, alt: "Mastercard", Icon: PaymentMastercard },
    { key: "troy", show: !!payments.showTroy, alt: "Troy", Icon: PaymentTroy },
    { key: "iyzico", show: !!payments.showIyzico, alt: "iyzico", Icon: PaymentIyzico },
    { key: "paytr", show: !!payments.showPaytr, alt: "PayTR", Icon: PaymentPaytr },
    { key: "bank", show: !!payments.showBankTransfer, alt: "Havale / EFT", Icon: PaymentBank },
  ].filter((p) => p.show);

  return (
    <div class="footer-bottom__inner">
      <p class="footer-bottom__copyright">{copyrightText}</p>

      {visibleLegal.length > 0 && (
        <nav class="footer-bottom__legal" aria-label={legalNavAriaLabel}>
          {visibleLegal.map((link, idx) => (
            <Fragment key={link.href + link.label}>
              <a
                href={link.href}
                class="footer-bottom__legal-link"
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
              {idx < visibleLegal.length - 1 && (
                <span class="footer-bottom__legal-sep" aria-hidden="true">
                  ·
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      )}

      {paymentMethods.length > 0 && (
        <ul class="footer-bottom__payments" role="list" aria-label={paymentsAriaLabel}>
          {paymentMethods.map(({ key, alt, Icon }) => (
            <li key={key} class="footer-bottom__pay" title={alt} aria-label={alt}>
              <Icon />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default FooterBottomBar;

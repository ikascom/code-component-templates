import { observer } from "@ikas/component-utils";

interface Props {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 1.6,
  "stroke-linecap": "round" as const,
  "stroke-linejoin": "round" as const,
  "aria-hidden": "true" as const,
};

const MapPinIcon = () => (
  <svg {...iconProps} class="footer-contact__icon">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps} class="footer-contact__icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps} class="footer-contact__icon">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps} class="footer-contact__icon">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);

const FooterContactBlock = observer(function FooterContactBlock({
  title,
  address,
  phone,
  email,
  hours,
}: Props) {
  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "";

  return (
    <div class="footer-contact">
      <h3 class="footer-contact__title">{title}</h3>
      <ul class="footer-contact__list" role="list">
        {address && (
          <li class="footer-contact__row">
            <MapPinIcon />
            <span class="footer-contact__text">{address}</span>
          </li>
        )}
        {phone && (
          <li class="footer-contact__row">
            <PhoneIcon />
            <a href={telHref} class="footer-contact__link">
              {phone}
            </a>
          </li>
        )}
        {email && (
          <li class="footer-contact__row">
            <MailIcon />
            <a href={`mailto:${email}`} class="footer-contact__link">
              {email}
            </a>
          </li>
        )}
        {hours && (
          <li class="footer-contact__row">
            <ClockIcon />
            <span class="footer-contact__text">{hours}</span>
          </li>
        )}
      </ul>
    </div>
  );
});

export default FooterContactBlock;

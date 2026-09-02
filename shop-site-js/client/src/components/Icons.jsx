/**
 * Inline SVG icon set (no icon library dependency).
 *
 * RTL note: directional icons are defined by their *meaning*, not their shape.
 * `ChevronBack` points to the right because in an RTL layout "back / previous"
 * lives on the right-hand side. Non-directional icons are unaffected.
 */
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
};

const Icon = ({ children, className = 'h-5 w-5', ...rest }) => (
  <svg {...base} className={className} {...rest}>
    {children}
  </svg>
);

export const CartIcon = (props) => (
  <Icon {...props}>
    <path d="M2.5 3.5h2.2l2.1 11.1a1.8 1.8 0 0 0 1.77 1.46h8.3a1.8 1.8 0 0 0 1.76-1.42L20.2 7.2H6" />
    <circle cx="9.5" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </Icon>
);

export const UserIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.6-3.6" />
  </Icon>
);

/** "Go back" — in RTL this points right. */
export const ChevronBack = (props) => (
  <Icon {...props}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
);

/** "Go forward / next" — in RTL this points left. */
export const ChevronNext = (props) => (
  <Icon {...props}>
    <path d="m15 5-7 7 7 7" />
  </Icon>
);

export const ChevronDown = (props) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <path d="M4 6.5h16M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" />
    <path d="M10.5 10.5v6M13.5 10.5v6" />
  </Icon>
);

export const EditIcon = (props) => (
  <Icon {...props}>
    <path d="M16.5 3.9a2 2 0 0 1 2.8 2.8L8 18l-4 1 1-4Z" />
    <path d="m14.8 5.6 3.6 3.6" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Icon>
);

export const AlertIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.3v.2" />
  </Icon>
);

export const InfoIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.7v.2" />
  </Icon>
);

export const BoxIcon = (props) => (
  <Icon {...props}>
    <path d="M20.5 8.2v7.6a1.6 1.6 0 0 1-.85 1.42l-6.9 3.6a1.6 1.6 0 0 1-1.5 0l-6.9-3.6A1.6 1.6 0 0 1 3.5 15.8V8.2a1.6 1.6 0 0 1 .85-1.42l6.9-3.6a1.6 1.6 0 0 1 1.5 0l6.9 3.6A1.6 1.6 0 0 1 20.5 8.2Z" />
    <path d="m3.8 7.4 8.2 4.3 8.2-4.3M12 20.7v-9" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3 5 6v5.5c0 4.3 2.9 7.9 7 9.5 4.1-1.6 7-5.2 7-9.5V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const LogoutIcon = (props) => (
  <Icon {...props}>
    <path d="M14 4.5h3.5A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 8.5 6 12l4 3.5M6 12h9" />
  </Icon>
);

export const TruckIcon = (props) => (
  <Icon {...props}>
    <path d="M2.5 6.5h10.2v10H2.5zM12.7 10h3.6l3.2 3.1v3.4h-6.8z" />
    <circle cx="6.5" cy="18.5" r="1.6" />
    <circle cx="16.5" cy="18.5" r="1.6" />
  </Icon>
);

export const SupportIcon = (props) => (
  <Icon {...props}>
    <path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" />
    <path d="M4.5 13h1.8a1 1 0 0 1 1 1v3.2a1 1 0 0 1-1 1H5.6a1.1 1.1 0 0 1-1.1-1.1Zm15 0h-1.8a1 1 0 0 0-1 1v3.2a1 1 0 0 0 1 1h.7a1.1 1.1 0 0 0 1.1-1.1Z" />
  </Icon>
);

export const ReturnIcon = (props) => (
  <Icon {...props}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 3.5V8h-4.5" />
  </Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const SparkIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9Z" />
  </Icon>
);

export const ImageIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
    <circle cx="8.8" cy="9.8" r="1.6" />
    <path d="m4.5 17 4.6-4.4a1.6 1.6 0 0 1 2.2 0l4.3 4.1m-1.5-1.4 1.6-1.5a1.6 1.6 0 0 1 2.2 0l2.6 2.5" />
  </Icon>
);

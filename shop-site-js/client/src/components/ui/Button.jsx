import { Link } from 'react-router-dom';
import Spinner from './Spinner.jsx';

const VARIANTS = {
  primary:
    'bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300',
  accent:
    'bg-accent-400 text-ink-900 shadow-soft hover:bg-accent-300 active:bg-accent-500 disabled:bg-accent-200',
  outline:
    'border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:text-ink-300',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:text-ink-300',
  danger: 'bg-rose-600 text-white shadow-soft hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:text-brand-300',
};

const SIZES = {
  sm: 'h-9 gap-1.5 px-3.5 text-[13px]',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2.5 px-7 text-[15px]',
  icon: 'h-10 w-10 justify-center',
};

/**
 * The single button primitive used everywhere.
 * Renders an `<a>`/`<Link>` when `to`/`href` is supplied, otherwise a `<button>`.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  to,
  href,
  type = 'button',
  ...rest
}) => {
  const classes = [
    'relative inline-flex shrink-0 items-center justify-center rounded-xl font-semibold',
    'transition-all duration-200 ease-out select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
    'disabled:cursor-not-allowed disabled:shadow-none',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    loading ? 'pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className="h-5 w-5" />
        </span>
      )}
      <span className={`inline-flex items-center ${size === 'icon' ? '' : 'gap-2'} ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
};

export default Button;

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CartIcon,
  ChevronDown,
  CloseIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from '../Icons.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { toPersianDigits } from '../../lib/format.js';

const NAV_LINKS = [
  { to: '/', label: 'فروشگاه', end: true },
  { to: '/cart', label: 'سبد خرید' },
  { to: '/profile', label: 'حساب کاربری' },
];

const linkClasses = ({ isActive }) =>
  [
    'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200',
    isActive ? 'text-brand-700' : 'text-ink-600 hover:text-ink-900',
  ].join(' ');

/** Small dot under the active nav link. */
const ActiveDot = () => (
  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-pill bg-brand-500" />
);

const UserMenu = ({ user, isAdmin, onLogout }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const initial = user.name?.trim()?.[0] ?? '؟';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pe-2 ps-1.5 transition hover:border-brand-300 hover:bg-brand-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-24 truncate text-[13px] font-semibold text-ink-700 sm:block">
          {user.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-scale-in absolute end-0 top-[calc(100%+0.6rem)] z-50 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-panel"
        >
          <div className="border-b border-ink-100 px-3 pt-2 pb-3">
            <p className="truncate text-sm font-bold text-ink-900">{user.name}</p>
            <p dir="ltr" className="mt-0.5 truncate text-start text-xs text-ink-400">
              {user.email}
            </p>
            {isAdmin && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-accent-100 px-2 py-0.5 text-[11px] font-bold text-accent-700">
                <ShieldIcon className="h-3.5 w-3.5" />
                مدیر فروشگاه
              </span>
            )}
          </div>

          <nav className="pt-1.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
              role="menuitem"
            >
              <UserIcon className="h-4.5 w-4.5 text-ink-400" />
              پروفایل و سفارش‌ها
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                role="menuitem"
              >
                <ShieldIcon className="h-4.5 w-4.5 text-ink-400" />
                پنل مدیریت
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              role="menuitem"
            >
              <LogoutIcon className="h-4.5 w-4.5" />
              خروج از حساب
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount, openDrawer } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.info('از حساب خود خارج شدید.');
    navigate('/');
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    navigate(term ? `/?search=${encodeURIComponent(term)}` : '/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="بازارک، صفحهٔ اصلی">
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight text-ink-900">بازارک</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <ActiveDot />}
                </>
              )}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldIcon className="h-4 w-4" />
                    مدیریت
                  </span>
                  {isActive && <ActiveDot />}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* Search */}
        <form onSubmit={submitSearch} className="mx-auto hidden max-w-sm flex-1 lg:block">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4.5 w-4.5 text-ink-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جست‌وجو در محصولات…"
              aria-label="جست‌وجو در محصولات"
              className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50/70 ps-10 pe-4 text-sm text-ink-800 transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        </form>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          {/* Cart button with live item-count badge */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            aria-label={`سبد خرید${itemsCount ? `، ${toPersianDigits(itemsCount)} کالا` : ' خالی'}`}
          >
            <CartIcon />
            {itemsCount > 0 && (
              <span className="num absolute -top-1.5 -end-1.5 grid h-5 min-w-5 place-items-center rounded-pill bg-accent-400 px-1 text-[11px] font-extrabold text-ink-900 ring-2 ring-white">
                {toPersianDigits(itemsCount)}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <UserMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button to="/login" variant="ghost" size="sm">
                ورود
              </Button>
              <Button to="/register" size="sm">
                ثبت‌نام
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-700 transition hover:bg-ink-50 md:hidden"
            aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="animate-fade-up border-t border-ink-100 bg-white px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4.5 w-4.5 text-ink-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجو در محصولات…"
                aria-label="جست‌وجو در محصولات"
                className="h-11 w-full rounded-xl border border-ink-200 bg-ink-50/70 ps-10 pe-4 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </div>
          </form>

          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                پنل مدیریت
              </NavLink>
            )}
          </nav>

          {!isAuthenticated && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-100 pt-3">
              <Button to="/login" variant="outline" fullWidth>
                ورود
              </Button>
              <Button to="/register" fullWidth>
                ثبت‌نام
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

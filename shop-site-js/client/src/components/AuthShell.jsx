import { Link } from 'react-router-dom';
import { ReturnIcon, ShieldIcon, TruckIcon } from './Icons.jsx';

const HIGHLIGHTS = [
  { Icon: ShieldIcon, text: 'ضمانت اصالت کالا' },
  { Icon: TruckIcon, text: 'ارسال سریع به سراسر ایران' },
  { Icon: ReturnIcon, text: 'بازگشت آسان تا ۷ روز' },
];

/** Shared two-column frame for the login and signup pages. */
export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-16">
    {/* Form column */}
    <div className="order-2 flex flex-col justify-center lg:order-1">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink-900">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-ink-500">{subtitle}</p>

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-ink-500">{footer}</div>}
      </div>
    </div>

    {/* Brand column — decorative, hidden on small screens. */}
    <div className="order-1 lg:order-2">
      <div className="relative overflow-hidden rounded-card bg-brand-800 p-8 sm:p-10">
        <div
          className="pointer-events-none absolute -top-20 -end-16 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -start-12 h-56 w-56 rounded-full bg-brand-400/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <span className="text-xl font-extrabold text-white">بازارک</span>
          </Link>

          <p className="mt-6 text-lg leading-9 font-bold text-white sm:text-xl sm:leading-10">
            به جمع مشتریان بازارک بپیوندید و خریدی مطمئن را تجربه کنید.
          </p>

          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-brand-100">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {/* Handy during the demo: the seeded accounts are right there. */}
          <div className="mt-8 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs font-bold text-white">حساب‌های آمادهٔ آزمایش</p>
            <dl dir="ltr" className="mt-2.5 space-y-1.5 text-start text-xs text-brand-100">
              <div className="flex justify-between gap-3">
                <dt className="font-semibold text-white">admin@shop.com</dt>
                <dd>admin123</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-semibold text-white">user@shop.com</dt>
                <dd>user123</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthShell;

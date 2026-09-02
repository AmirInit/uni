import { Link } from 'react-router-dom';
import { ReturnIcon, SupportIcon, TruckIcon } from '../Icons.jsx';
import { toPersianDigits } from '../../lib/format.js';

const SERVICES = [
  { Icon: TruckIcon, title: 'ارسال سریع', text: 'تحویل به سراسر کشور طی ۲ تا ۵ روز کاری' },
  { Icon: ReturnIcon, title: 'ضمانت بازگشت', text: 'هفت روز مهلت بازگشت کالا بدون قید و شرط' },
  { Icon: SupportIcon, title: 'پشتیبانی', text: 'پاسخ‌گویی همه‌روزه از ۹ صبح تا ۸ شب' },
];

const LINK_GROUPS = [
  {
    title: 'فروشگاه',
    links: [
      { label: 'همهٔ محصولات', to: '/' },
      { label: 'سبد خرید', to: '/cart' },
      { label: 'حساب کاربری', to: '/profile' },
    ],
  },
  {
    title: 'راهنما',
    links: [
      { label: 'شیوهٔ ارسال', to: '/' },
      { label: 'رویهٔ بازگشت کالا', to: '/' },
      { label: 'پرسش‌های پرتکرار', to: '/' },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-20 border-t border-ink-100 bg-white">
    {/* Service strip */}
    <div className="border-b border-ink-100">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {SERVICES.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-800">{title}</p>
              <p className="mt-0.5 text-xs leading-6 text-ink-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            <span className="text-lg font-extrabold text-ink-900">بازارک</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-ink-500">
            بازارک یک فروشگاه اینترنتی نمونه است که در قالب پروژهٔ درسی توسعهٔ وب ساخته شده و
            کالای دیجیتال، لوازم خانه، پوشاک و اقلام ورزشی را عرضه می‌کند.
          </p>
        </div>

        {LINK_GROUPS.map((group) => (
          <nav key={group.title}>
            <h3 className="text-sm font-bold text-ink-800">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-center sm:flex-row sm:text-start">
        <p className="num text-xs text-ink-400">
          © {toPersianDigits(1405)} بازارک — تمامی حقوق محفوظ است.
        </p>
        <p className="text-xs text-ink-400">ساخته‌شده با React، Express و SQLite</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BoxIcon, CheckIcon, ShieldIcon } from '../components/Icons.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { TextField } from '../components/ui/Field.jsx';
import { LoadingBlock } from '../components/ui/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fetchOrders } from '../services/orderService.js';
import { fetchProfile } from '../services/authService.js';
import { formatDateTime, formatPrice, toPersianDigits } from '../lib/format.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TABS = [
  { id: 'profile', label: 'اطلاعات حساب' },
  { id: 'orders', label: 'سفارش‌های من' },
];

/* ------------------------------ profile form ------------------------------ */

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [values, setValues] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const wantsPasswordChange = Boolean(values.newPassword || values.currentPassword);

  const validate = () => {
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) next.name = 'وارد کردن نام الزامی است.';
    else if (name.length < 3) next.name = 'نام باید حداقل ۳ نویسه باشد.';

    if (!email) next.email = 'وارد کردن ایمیل الزامی است.';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'قالب ایمیل معتبر نیست.';

    if (wantsPasswordChange) {
      if (!values.currentPassword) next.currentPassword = 'رمز عبور فعلی را وارد کنید.';
      if (!values.newPassword) next.newPassword = 'رمز عبور جدید را وارد کنید.';
      else if (values.newPassword.length < 6) {
        next.newPassword = 'رمز عبور باید حداقل ۶ نویسه باشد.';
      }
      if (values.confirmPassword !== values.newPassword) {
        next.confirmPassword = 'تکرار رمز عبور جدید یکسان نیست.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await updateProfile({
        name: values.name.trim(),
        email: values.email.trim(),
        ...(wantsPasswordChange
          ? { currentPassword: values.currentPassword, newPassword: values.newPassword }
          : {}),
      });
      toast.success(result.message || 'پروفایل شما به‌روزرسانی شد.');
      // Never leave typed passwords sitting in state after a successful save.
      setValues((current) => ({
        ...current,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section className="rounded-card border border-ink-100 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-base font-bold text-ink-900">اطلاعات شخصی</h2>
        <p className="mt-1 text-xs text-ink-500">نام و ایمیل حساب کاربری خود را ویرایش کنید.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField
            label="نام و نام خانوادگی"
            value={values.name}
            onChange={setField('name')}
            error={errors.name}
            autoComplete="name"
          />
          <TextField
            label="ایمیل"
            type="email"
            dir="ltr"
            className="[&_input]:text-start"
            value={values.email}
            onChange={setField('email')}
            error={errors.email}
            autoComplete="email"
          />
        </div>
      </section>

      <section className="rounded-card border border-ink-100 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-base font-bold text-ink-900">تغییر رمز عبور</h2>
        <p className="mt-1 text-xs text-ink-500">
          اگر قصد تغییر رمز عبور را ندارید، این بخش را خالی بگذارید.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <TextField
            label="رمز عبور فعلی"
            type="password"
            dir="ltr"
            className="[&_input]:text-start"
            value={values.currentPassword}
            onChange={setField('currentPassword')}
            error={errors.currentPassword}
            autoComplete="current-password"
          />
          <TextField
            label="رمز عبور جدید"
            type="password"
            dir="ltr"
            className="[&_input]:text-start"
            value={values.newPassword}
            onChange={setField('newPassword')}
            error={errors.newPassword}
            autoComplete="new-password"
          />
          <TextField
            label="تکرار رمز جدید"
            type="password"
            dir="ltr"
            className="[&_input]:text-start"
            value={values.confirmPassword}
            onChange={setField('confirmPassword')}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>
      </section>

      <div className="flex justify-start">
        <Button type="submit" size="lg" loading={submitting}>
          ذخیرهٔ تغییرات
        </Button>
      </div>
    </form>
  );
};

/* -------------------------------- orders --------------------------------- */

const OrderCard = ({ order, highlighted }) => (
  <article
    className={`overflow-hidden rounded-card border bg-white shadow-soft transition ${
      highlighted ? 'border-brand-300 ring-2 ring-brand-100' : 'border-ink-100'
    }`}
  >
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/60 px-5 py-3.5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <div>
          <p className="text-[11px] text-ink-400">شمارهٔ سفارش</p>
          <p className="num text-sm font-bold text-ink-900">{toPersianDigits(order.id)}#</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">تاریخ ثبت</p>
          <p className="num text-sm font-semibold text-ink-700">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
        <CheckIcon className="h-4 w-4" />
        {order.status}
      </span>
    </header>

    <ul className="divide-y divide-ink-100 px-5">
      {order.items.map((item) => (
        <li key={item.id} className="flex items-center gap-3.5 py-3.5">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-100">
            <ProductImage src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2-fa text-[13px] leading-6 font-semibold text-ink-800">
              {item.name}
            </p>
            <p className="num mt-0.5 text-xs text-ink-500">
              {toPersianDigits(item.quantity)} × {formatPrice(item.price)}
            </p>
          </div>
          <p className="num shrink-0 text-[13px] font-bold text-ink-900">
            {formatPrice(item.lineTotal)}
          </p>
        </li>
      ))}
    </ul>

    <footer className="flex items-center justify-between border-t border-ink-100 px-5 py-3.5">
      <span className="num text-xs text-ink-500">
        {toPersianDigits(order.itemsCount)} کالا
      </span>
      <span className="num text-base font-extrabold text-ink-900">{formatPrice(order.total)}</span>
    </footer>
  </article>
);

const OrdersTab = ({ highlightOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setOrders(data.orders ?? []);
      })
      .catch((error) => {
        if (error?.name !== 'AbortError' && !controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingBlock label="در حال دریافت سفارش‌ها…" />;

  if (failed) {
    return (
      <EmptyState
        icon={BoxIcon}
        title="سفارش‌ها بارگذاری نشدند"
        description="ارتباط با سرور برقرار نشد. لطفاً صفحه را دوباره بارگذاری کنید."
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={BoxIcon}
        title="هنوز سفارشی ثبت نکرده‌اید"
        description="پس از تکمیل نخستین خرید، سفارش‌های شما در این بخش نمایش داده می‌شوند."
        action={<Button to="/">شروع خرید</Button>}
      />
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} highlighted={order.id === highlightOrderId} />
      ))}
    </div>
  );
};

/* --------------------------------- page ---------------------------------- */

export const ProfilePage = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const highlightOrderId = location.state?.highlightOrderId;

  // Land on the orders tab right after a successful checkout.
  const [tab, setTab] = useState(highlightOrderId ? 'orders' : 'profile');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setStats(data.stats ?? null);
      })
      .catch(() => {
        /* The summary tiles are decorative — a failure here is not worth a toast. */
      });
    return () => controller.abort();
  }, [tab]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header card */}
      <section className="mb-8 overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft">
        <div className="flex flex-wrap items-center gap-5 p-6">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-600 text-2xl font-extrabold text-white">
            {user?.name?.trim()?.[0] ?? '؟'}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-ink-900">{user?.name}</h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-accent-100 px-2.5 py-1 text-[11px] font-bold text-accent-700">
                  <ShieldIcon className="h-3.5 w-3.5" />
                  مدیر فروشگاه
                </span>
              )}
            </div>
            <p dir="ltr" className="mt-1 text-start text-sm text-ink-500">
              {user?.email}
            </p>
          </div>

          {stats && (
            <dl className="flex gap-3">
              <div className="rounded-2xl bg-ink-50 px-5 py-3 text-center">
                <dt className="text-[11px] text-ink-500">سفارش‌ها</dt>
                <dd className="num mt-0.5 text-lg font-extrabold text-ink-900">
                  {toPersianDigits(stats.ordersCount)}
                </dd>
              </div>
              <div className="rounded-2xl bg-ink-50 px-5 py-3 text-center">
                <dt className="text-[11px] text-ink-500">مجموع خرید</dt>
                <dd className="num mt-0.5 text-sm font-extrabold text-ink-900">
                  {formatPrice(stats.totalSpent)}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-accent-50/60 px-6 py-3.5">
            <p className="text-xs text-accent-700">
              شما به پنل مدیریت محصولات دسترسی دارید.
            </p>
            <Button to="/admin" variant="outline" size="sm">
              <ShieldIcon className="h-4 w-4" />
              ورود به پنل مدیریت
            </Button>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div
        role="tablist"
        className="mb-6 inline-flex gap-1 rounded-xl border border-ink-200 bg-white p-1"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === item.id
                ? 'bg-brand-600 text-white shadow-soft'
                : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? <ProfileForm /> : <OrdersTab highlightOrderId={highlightOrderId} />}
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartIcon, CheckIcon, ChevronBack, TrashIcon, UserIcon } from '../components/Icons.jsx';
import ProductImage from '../components/ProductImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice, toPersianDigits } from '../lib/format.js';

const SHIPPING_THRESHOLD = 500_000;
const SHIPPING_COST = 49_000;

const CartRow = ({ line, busy, onQuantityChange, onRemove }) => (
  <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
    <Link
      to={`/products/${line.productId}`}
      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100"
    >
      <ProductImage src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
    </Link>

    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold text-brand-600">{line.category}</p>
      <Link
        to={`/products/${line.productId}`}
        className="line-clamp-2-fa mt-1 block text-sm leading-7 font-bold text-ink-900 transition hover:text-brand-700"
      >
        {line.name}
      </Link>
      <p className="num mt-1 text-xs text-ink-500">
        قیمت واحد: {formatPrice(line.price)}
      </p>
    </div>

    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
      <QuantityStepper
        value={line.quantity}
        max={line.stock}
        busy={busy}
        onChange={onQuantityChange}
        size="sm"
      />
      <div className="flex items-center gap-3">
        <p className="num text-sm font-extrabold text-ink-900">
          {formatPrice(line.price * line.quantity)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
          aria-label={`حذف ${line.name} از سبد خرید`}
        >
          <TrashIcon className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  </li>
);

/** Full cart page: editable lines plus the order summary and checkout button. */
export const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const {
    items,
    subtotal,
    itemsCount,
    loading,
    pendingIds,
    setQuantity,
    removeItem,
    clear,
    checkout,
  } = useCart();

  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const freeShipping = subtotal >= SHIPPING_THRESHOLD;
  const shipping = items.length === 0 || freeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید.');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setPlacingOrder(true);
    try {
      const { order, message } = await checkout();
      toast.success(message || 'سفارش شما با موفقیت ثبت شد.');
      navigate('/profile', { state: { highlightOrderId: order?.id } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    await clear();
    setClearing(false);
    setConfirmClear(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="skeleton mb-8 h-8 w-40 rounded-pill" />
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4 rounded-card border border-ink-100 bg-white p-5">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex gap-4 py-3">
                <div className="skeleton h-24 w-24 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-4 w-3/4 rounded-pill" />
                  <div className="skeleton h-3.5 w-1/3 rounded-pill" />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton h-72 rounded-card" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={CartIcon}
          title="سبد خرید شما خالی است"
          description="هنوز کالایی به سبد خرید اضافه نکرده‌اید. از میان محصولات متنوع فروشگاه انتخاب کنید و خرید را آغاز کنید."
          action={
            <Button to="/" size="lg">
              مشاهدهٔ محصولات
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">سبد خرید</h1>
          <p className="num mt-1.5 text-sm text-ink-500">
            {toPersianDigits(itemsCount)} کالا در سبد شما قرار دارد
          </p>
        </div>
        <Button variant="ghost" size="sm" to="/">
          <ChevronBack className="h-4 w-4" />
          ادامهٔ خرید
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* Lines */}
        <section className="rounded-card border border-ink-100 bg-white px-5 shadow-soft">
          <ul className="divide-y divide-ink-100">
            {items.map((line) => (
              <CartRow
                key={line.productId}
                line={line}
                busy={pendingIds.includes(line.productId)}
                onQuantityChange={(quantity) => setQuantity(line.productId, quantity)}
                onRemove={() => removeItem(line.productId)}
              />
            ))}
          </ul>

          <div className="border-t border-ink-100 py-4">
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
              <TrashIcon className="h-4 w-4" />
              خالی کردن سبد خرید
            </Button>
          </div>
        </section>

        {/* Summary */}
        <aside className="rounded-card border border-ink-100 bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-ink-900">خلاصهٔ سفارش</h2>

          <dl className="mt-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">جمع کالاها</dt>
              <dd className="num font-semibold text-ink-800">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">هزینهٔ ارسال</dt>
              <dd className={`num font-semibold ${freeShipping ? 'text-brand-600' : 'text-ink-800'}`}>
                {freeShipping ? 'رایگان' : formatPrice(SHIPPING_COST)}
              </dd>
            </div>

            <div className="flex items-center justify-between border-t border-ink-100 pt-3.5">
              <dt className="font-bold text-ink-900">مبلغ قابل پرداخت</dt>
              <dd className="num text-lg font-extrabold text-ink-900">{formatPrice(total)}</dd>
            </div>
          </dl>

          {/* Free-shipping progress nudge */}
          {!freeShipping && (
            <div className="mt-5 rounded-xl bg-accent-50 p-3.5">
              <p className="num text-xs leading-6 text-accent-700">
                تا <span className="font-bold">{formatPrice(SHIPPING_THRESHOLD - subtotal)}</span>{' '}
                دیگر تا ارسال رایگان فاصله دارید.
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-accent-200">
                <div
                  className="h-full rounded-pill bg-accent-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {freeShipping && (
            <p className="mt-5 flex items-center gap-2 rounded-xl bg-brand-50 p-3.5 text-xs font-semibold text-brand-700">
              <CheckIcon className="h-4 w-4 shrink-0" />
              سفارش شما شامل ارسال رایگان می‌شود.
            </p>
          )}

          <Button
            fullWidth
            size="lg"
            className="mt-5"
            onClick={handleCheckout}
            loading={placingOrder}
          >
            {isAuthenticated ? 'ثبت نهایی سفارش' : 'ورود و ثبت سفارش'}
          </Button>

          {!isAuthenticated && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-ink-500">
              <UserIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              سبد خرید شما پس از ورود به حساب کاربری حفظ می‌شود.
            </p>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="خالی کردن سبد خرید"
        message="آیا مطمئن هستید که می‌خواهید همهٔ کالاها را از سبد خرید حذف کنید؟ این کار قابل بازگشت نیست."
        confirmLabel="بله، خالی کن"
        loading={clearing}
        onConfirm={handleClear}
        onClose={() => setConfirmClear(false)}
      />
    </div>
  );
};

export default CartPage;

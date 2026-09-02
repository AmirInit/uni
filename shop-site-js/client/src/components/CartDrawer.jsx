import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartIcon, CloseIcon, TrashIcon } from './Icons.jsx';
import ProductImage from './ProductImage.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import Button from './ui/Button.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, toPersianDigits } from '../lib/format.js';

const CartLine = ({ line, busy, onQuantityChange, onRemove }) => (
  <li className="flex gap-3 py-4">
    <Link
      to={`/products/${line.productId}`}
      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100"
    >
      <ProductImage
        src={line.imageUrl}
        alt={line.name}
        className="h-full w-full object-cover"
      />
    </Link>

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/products/${line.productId}`}
          className="line-clamp-2-fa text-[13px] leading-6 font-bold text-ink-800 hover:text-brand-700"
        >
          {line.name}
        </Link>
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className="-mt-1 shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
          aria-label={`حذف ${line.name} از سبد خرید`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
        <QuantityStepper
          value={line.quantity}
          max={line.stock}
          busy={busy}
          onChange={onQuantityChange}
          size="sm"
        />
        <p className="num text-[13px] font-extrabold text-ink-900">
          {formatPrice(line.price * line.quantity)}
        </p>
      </div>
    </div>
  </li>
);

/**
 * Slide-over cart panel opened from the navbar.
 * Enters from the inline-start edge, which the browser mirrors to the right in RTL.
 */
export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    itemsCount,
    drawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
    pendingIds,
    loading,
  } = useCart();

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => event.key === 'Escape' && closeDrawer();
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const goToCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-[75]">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        className="animate-drawer-in absolute inset-y-0 start-0 flex w-full max-w-md flex-col bg-white shadow-panel"
      >
        <header className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <CartIcon />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink-900">سبد خرید</h2>
              <p className="num text-xs text-ink-500">
                {itemsCount > 0 ? `${toPersianDigits(itemsCount)} کالا` : 'خالی'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label="بستن سبد خرید"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="scroll-slim flex-1 overflow-y-auto px-5">
          {loading ? (
            <ul className="divide-y divide-ink-100">
              {[0, 1, 2].map((index) => (
                <li key={index} className="flex gap-3 py-4">
                  <div className="skeleton h-20 w-20 rounded-xl" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="skeleton h-3.5 w-3/4 rounded-pill" />
                    <div className="skeleton h-3.5 w-1/2 rounded-pill" />
                    <div className="skeleton h-8 w-28 rounded-xl" />
                  </div>
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <EmptyState
              className="mt-8 border-0 bg-transparent"
              icon={CartIcon}
              title="سبد خرید شما خالی است"
              description="هنوز کالایی به سبد خرید اضافه نکرده‌اید. از میان محصولات فروشگاه انتخاب کنید."
              action={
                <Button onClick={closeDrawer} to="/" variant="primary">
                  مشاهدهٔ محصولات
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {items.map((line) => (
                <CartLine
                  key={line.productId}
                  line={line}
                  busy={pendingIds.includes(line.productId)}
                  onQuantityChange={(quantity) => setQuantity(line.productId, quantity)}
                  onRemove={() => removeItem(line.productId)}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-ink-100 bg-ink-50/70 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-600">جمع سبد خرید</span>
              <span className="num text-lg font-extrabold text-ink-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-ink-400">هزینهٔ ارسال در مرحلهٔ پرداخت محاسبه می‌شود.</p>
            <Button fullWidth size="lg" onClick={goToCart}>
              مشاهدهٔ سبد و تسویه حساب
            </Button>
          </footer>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;

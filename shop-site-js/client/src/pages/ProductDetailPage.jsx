import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BoxIcon,
  CartIcon,
  CheckIcon,
  ChevronBack,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from '../components/Icons.jsx';
import ProductImage from '../components/ProductImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { fetchProduct } from '../services/productService.js';
import { formatPrice, toPersianDigits } from '../lib/format.js';

const GUARANTEES = [
  { Icon: ShieldIcon, text: 'ضمانت اصالت و سلامت فیزیکی کالا' },
  { Icon: TruckIcon, text: 'ارسال به سراسر ایران طی ۲ تا ۵ روز کاری' },
  { Icon: ReturnIcon, text: 'هفت روز مهلت بازگشت کالا' },
];

const DetailSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
    <div className="skeleton aspect-square w-full rounded-card" />
    <div className="space-y-4 py-2">
      <div className="skeleton h-4 w-24 rounded-pill" />
      <div className="skeleton h-8 w-4/5 rounded-pill" />
      <div className="skeleton h-4 w-full rounded-pill" />
      <div className="skeleton h-4 w-full rounded-pill" />
      <div className="skeleton h-4 w-2/3 rounded-pill" />
      <div className="skeleton mt-6 h-20 w-full rounded-2xl" />
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  </div>
);

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, pendingIds, quantityOf, openDrawer } = useCart();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setQuantity(1);

    fetchProduct(id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setProduct(data.product);
        setStatus('ready');
      })
      .catch((error) => {
        if (error?.name === 'AbortError' || controller.signal.aborted) return;
        setStatus(error.status === 404 ? 'missing' : 'error');
      });

    return () => controller.abort();
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (status !== 'ready' || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={BoxIcon}
          title={status === 'missing' ? 'این محصول پیدا نشد' : 'محصول بارگذاری نشد'}
          description={
            status === 'missing'
              ? 'ممکن است این کالا حذف شده باشد یا نشانی آن اشتباه وارد شده باشد.'
              : 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.'
          }
          action={<Button to="/">بازگشت به فروشگاه</Button>}
        />
      </div>
    );
  }

  const busy = pendingIds.includes(product.id);
  const inCart = quantityOf(product.id);
  const soldOut = product.stock <= 0;

  const handleAdd = async () => {
    await addItem(product, quantity);
    openDrawer();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb — the chevron points right, the RTL "back" direction. */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-500" aria-label="مسیر صفحه">
        <Link to="/" className="transition hover:text-brand-700">
          فروشگاه
        </Link>
        <ChevronNextSeparator />
        <Link
          to={`/?category=${encodeURIComponent(product.category)}`}
          className="transition hover:text-brand-700"
        >
          {product.category}
        </Link>
        <ChevronNextSeparator />
        <span className="truncate font-medium text-ink-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft">
          <div className="aspect-square w-full bg-ink-100">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Link
            to={`/?category=${encodeURIComponent(product.category)}`}
            className="inline-flex w-fit rounded-pill bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
          >
            {product.category}
          </Link>

          <h1 className="mt-4 text-2xl leading-[1.5] font-extrabold text-ink-900 sm:text-3xl sm:leading-[1.45]">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {soldOut ? (
              <span className="rounded-pill bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-500">
                ناموجود
              </span>
            ) : (
              <span className="num inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                <CheckIcon className="h-4 w-4" />
                {toPersianDigits(product.stock)} عدد موجود در انبار
              </span>
            )}
            {inCart > 0 && (
              <span className="num rounded-pill bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">
                {toPersianDigits(inCart)} عدد در سبد خرید شما
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-8 whitespace-pre-line text-ink-600">
            {product.description || 'برای این محصول توضیحاتی ثبت نشده است.'}
          </p>

          {/* Purchase box */}
          <div className="mt-8 rounded-card border border-ink-100 bg-white p-5 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-ink-400">قیمت واحد</p>
                <p className="num mt-1 text-2xl font-extrabold text-ink-900">
                  {formatPrice(product.price)}
                </p>
              </div>

              {!soldOut && (
                <div>
                  <p className="mb-1.5 text-xs text-ink-400">تعداد</p>
                  <QuantityStepper
                    value={quantity}
                    max={product.stock}
                    onChange={(next) => setQuantity(Math.max(1, Math.min(next, product.stock)))}
                  />
                </div>
              )}
            </div>

            {!soldOut && quantity > 1 && (
              <p className="num mt-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
                جمع کل:{' '}
                <span className="font-extrabold text-ink-900">
                  {formatPrice(product.price * quantity)}
                </span>
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button
                size="lg"
                fullWidth
                onClick={handleAdd}
                loading={busy}
                disabled={soldOut}
              >
                <CartIcon className="h-5 w-5" />
                {soldOut ? 'ناموجود' : 'افزودن به سبد خرید'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/')} className="sm:w-auto">
                ادامهٔ خرید
              </Button>
            </div>
          </div>

          {/* Guarantees */}
          <ul className="mt-6 grid gap-3">
            {GUARANTEES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[13px] text-ink-600">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/** Breadcrumb separator — points left, i.e. "onward" in an RTL reading order. */
const ChevronNextSeparator = () => (
  <ChevronBack className="h-3.5 w-3.5 rotate-180 text-ink-300" aria-hidden="true" />
);

export default ProductDetailPage;

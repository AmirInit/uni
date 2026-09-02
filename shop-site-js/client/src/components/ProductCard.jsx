import { Link } from 'react-router-dom';
import { CartIcon, CheckIcon } from './Icons.jsx';
import ProductImage from './ProductImage.jsx';
import { formatPrice, toPersianDigits } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';
import Spinner from './ui/Spinner.jsx';

const LOW_STOCK_THRESHOLD = 5;

export const ProductCard = ({ product }) => {
  const { addItem, pendingIds, quantityOf } = useCart();
  const busy = pendingIds.includes(product.id);
  const inCart = quantityOf(product.id);
  const soldOut = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-ink-100"
        aria-label={product.name}
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Status ribbons sit at the inline-start corner (right in RTL). */}
        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && (
            <span className="rounded-pill bg-ink-900/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              ناموجود
            </span>
          )}
          {!soldOut && product.stock <= LOW_STOCK_THRESHOLD && (
            <span className="num rounded-pill bg-accent-400 px-2.5 py-1 text-[11px] font-bold text-ink-900">
              تنها {toPersianDigits(product.stock)} عدد باقی مانده
            </span>
          )}
        </div>

        {inCart > 0 && (
          <span className="num absolute end-3 top-3 inline-flex items-center gap-1 rounded-pill bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
            <CheckIcon className="h-3.5 w-3.5" />
            {toPersianDigits(inCart)} در سبد
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1.5 text-[11px] font-semibold text-brand-600">{product.category}</p>

        <h3 className="mb-2 text-[15px] leading-7 font-bold text-ink-900">
          <Link
            to={`/products/${product.id}`}
            className="line-clamp-2-fa transition-colors hover:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2-fa mb-4 text-[13px] leading-6 text-ink-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-[11px] text-ink-400">قیمت</p>
            <p className="num text-base font-extrabold text-ink-900">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={soldOut || busy}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-soft transition-all duration-200 hover:bg-brand-700 hover:shadow-lift active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 disabled:shadow-none"
            aria-label={soldOut ? `${product.name} ناموجود است` : `افزودن ${product.name} به سبد خرید`}
            title={soldOut ? 'این کالا ناموجود است' : 'افزودن به سبد خرید'}
          >
            {busy ? <Spinner className="h-5 w-5" /> : <CartIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  );
};

/** Matching placeholder shown while the grid's first page is loading. */
export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft">
    <div className="skeleton aspect-square w-full" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-3 w-16 rounded-pill" />
      <div className="skeleton h-4 w-full rounded-pill" />
      <div className="skeleton h-4 w-2/3 rounded-pill" />
      <div className="flex items-center justify-between pt-3">
        <div className="skeleton h-5 w-28 rounded-pill" />
        <div className="skeleton h-11 w-11 rounded-xl" />
      </div>
    </div>
  </div>
);

export default ProductCard;

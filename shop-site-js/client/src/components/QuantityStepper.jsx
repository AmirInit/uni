import { MinusIcon, PlusIcon } from './Icons.jsx';
import { toPersianDigits } from '../lib/format.js';
import Spinner from './ui/Spinner.jsx';

/**
 * − / value / + control for cart quantities.
 *
 * The minus button sits at the inline-start edge (right in RTL) and the plus at
 * the end, matching how Persian shoppers read the row.
 */
export const QuantityStepper = ({ value, max = 99, onChange, busy = false, size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'h-9 [&_button]:w-9 [&_button]:h-9' : 'h-11 [&_button]:w-11 [&_button]:h-11';

  const atMax = value >= max;

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-xl border border-ink-200 bg-white ${dimensions}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={busy}
        className="grid place-items-center text-ink-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={value <= 1 ? 'حذف از سبد خرید' : 'کاهش تعداد'}
      >
        <MinusIcon className="h-4 w-4" />
      </button>

      <span
        className="num grid min-w-10 place-items-center border-x border-ink-100 text-sm font-bold text-ink-800 tabular-nums"
        aria-live="polite"
      >
        {busy ? <Spinner className="h-4 w-4 text-brand-500" /> : toPersianDigits(value)}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={busy || atMax}
        className="grid place-items-center text-ink-500 transition hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={atMax ? 'به حداکثر موجودی رسیده‌اید' : 'افزایش تعداد'}
        title={atMax ? 'بیشتر از این در انبار موجود نیست' : undefined}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantityStepper;

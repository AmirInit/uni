import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from './Icons.jsx';
import { useToastQueue } from '../context/ToastContext.jsx';

const VARIANTS = {
  success: {
    Icon: CheckIcon,
    ring: 'ring-brand-200',
    iconWrap: 'bg-brand-100 text-brand-700',
    bar: 'bg-brand-500',
  },
  error: {
    Icon: AlertIcon,
    ring: 'ring-rose-200',
    iconWrap: 'bg-rose-100 text-rose-600',
    bar: 'bg-rose-500',
  },
  info: {
    Icon: InfoIcon,
    ring: 'ring-ink-200',
    iconWrap: 'bg-ink-100 text-ink-600',
    bar: 'bg-ink-400',
  },
};

/** Fixed toast stack. Anchored to the inline-start edge, which is the right in RTL. */
export const Toaster = () => {
  const { toasts, dismiss } = useToastQueue();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:start-6 sm:top-6 sm:items-start"
      role="status"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const variant = VARIANTS[item.variant] ?? VARIANTS.info;
        const { Icon } = variant;
        return (
          <div
            key={item.id}
            className={`animate-toast-in pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl bg-white p-3.5 shadow-lift ring-1 ${variant.ring}`}
          >
            <span className={`absolute inset-y-0 start-0 w-1 ${variant.bar}`} aria-hidden="true" />
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${variant.iconWrap}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="flex-1 pt-1 text-sm leading-6 font-medium text-ink-800">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="-me-1 -mt-1 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              aria-label="بستن پیام"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;

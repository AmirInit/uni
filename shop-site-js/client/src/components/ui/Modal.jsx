import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons.jsx';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Accessible modal dialog: closes on Escape / backdrop click, locks body scroll
 * and keeps Tab focus inside the panel while it is open.
 */
export const Modal = ({ open, onClose, title, description, size = 'md', children, footer }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Focus the first control so keyboard users land inside the dialog.
    const timer = setTimeout(() => {
      const target = panelRef.current?.querySelector(
        'input, textarea, select, button:not([data-close])',
      );
      target?.focus();
    }, 40);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink-900/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-scale-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-panel sm:rounded-3xl ${SIZES[size] ?? SIZES.md}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            type="button"
            data-close
            onClick={onClose}
            className="-me-2 -mt-1 rounded-xl p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label="بستن"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="scroll-slim flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-col-reverse gap-2.5 border-t border-ink-100 bg-ink-50/60 px-6 py-4 sm:flex-row sm:justify-start">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

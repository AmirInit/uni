/** Inline loading spinner used inside buttons and small placeholders. */
export const Spinner = ({ className = 'h-6 w-6' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2.6" />
    <path
      d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

/** Full-block loading state used while a page's first data request is in flight. */
export const LoadingBlock = ({ label = 'در حال بارگذاری…', className = 'py-24' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 text-ink-400 ${className}`}>
    <Spinner className="h-8 w-8 text-brand-500" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;

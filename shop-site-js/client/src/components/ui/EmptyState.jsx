/**
 * Friendly placeholder shown instead of a blank screen — empty cart, no search
 * results, no orders yet, empty admin catalogue.
 */
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-14 text-center ${className}`}
  >
    {Icon && (
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon className="h-8 w-8" />
      </span>
    )}
    <h3 className="text-base font-bold text-ink-800">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-sm leading-7 text-ink-500">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;

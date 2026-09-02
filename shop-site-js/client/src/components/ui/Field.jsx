import { useId } from 'react';
import { AlertIcon } from '../Icons.jsx';

const baseControl =
  'w-full rounded-xl border bg-white px-4 text-sm text-ink-800 transition-colors duration-200 ' +
  'placeholder:text-ink-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-ink-50';

const stateClasses = (hasError) =>
  hasError
    ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
    : 'border-ink-200 hover:border-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100';

const Label = ({ htmlFor, children, optional }) => (
  <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
    {children}
    {optional && <span className="text-xs font-normal text-ink-400">(اختیاری)</span>}
  </label>
);

const ErrorText = ({ id, children }) =>
  children ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
      <AlertIcon className="h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  ) : null;

const HintText = ({ children }) =>
  children ? <p className="mt-1.5 text-xs text-ink-400">{children}</p> : null;

/** Labelled text input with inline validation message. */
export const TextField = ({
  label,
  error,
  hint,
  optional,
  icon: LeadingIcon,
  className = '',
  ...rest
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <Label htmlFor={id} optional={optional}>{label}</Label>}
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-5 w-5 text-ink-400" />
        )}
        <input
          id={id}
          className={`${baseControl} h-11 ${stateClasses(Boolean(error))} ${LeadingIcon ? 'ps-11' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      </div>
      <ErrorText id={errorId}>{error}</ErrorText>
      {!error && <HintText>{hint}</HintText>}
    </div>
  );
};

export const TextAreaField = ({ label, error, hint, optional, rows = 4, className = '', ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <Label htmlFor={id} optional={optional}>{label}</Label>}
      <textarea
        id={id}
        rows={rows}
        className={`${baseControl} resize-y py-3 leading-7 ${stateClasses(Boolean(error))}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      <ErrorText id={errorId}>{error}</ErrorText>
      {!error && <HintText>{hint}</HintText>}
    </div>
  );
};

export const SelectField = ({ label, error, hint, children, className = '', ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <select
          id={id}
          className={`${baseControl} h-11 cursor-pointer appearance-none pe-10 ${stateClasses(Boolean(error))}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {children}
        </select>
        {/* Custom chevron: the native one sits on the wrong side in RTL. */}
        <svg
          className="pointer-events-none absolute inset-y-0 end-3.5 my-auto h-4 w-4 text-ink-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <ErrorText id={errorId}>{error}</ErrorText>
      {!error && <HintText>{hint}</HintText>}
    </div>
  );
};

export default TextField;

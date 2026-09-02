import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 0;

/**
 * Lightweight toast queue. `toast.success(...)` / `.error(...)` / `.info(...)`
 * are used across the app to confirm actions and surface API errors.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, variant = 'info', duration = 4000) => {
      if (!message) return null;
      const id = ++nextId;
      setToasts((current) => [...current.slice(-2), { id, message, variant }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error', 5000),
      info: (message) => push(message, 'info'),
    }),
    [push],
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context.toast;
};

export const useToastQueue = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastQueue must be used inside <ToastProvider>');
  return context;
};

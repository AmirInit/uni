import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as cartService from '../services/cartService.js';
import * as orderService from '../services/orderService.js';
import { fetchProduct } from '../services/productService.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'shop.guestCart';

/* ------------------------------------------------------------------ *
 * Guest cart — kept in localStorage so it survives a page reload even
 * before the visitor has an account.
 * ------------------------------------------------------------------ */

const readGuestCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => Number.isFinite(Number(line?.productId)))
      .map((line) => ({
        productId: Number(line.productId),
        name: String(line.name ?? ''),
        price: Number(line.price) || 0,
        imageUrl: String(line.imageUrl ?? ''),
        stock: Number(line.stock) || 0,
        category: String(line.category ?? ''),
        quantity: Math.max(1, Number(line.quantity) || 1),
      }));
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    /* Storage can be unavailable (private mode) — the cart is then per-session. */
  }
};

/**
 * Re-reads every stored line from the API so prices, names and stock stay
 * truthful after an admin edits the catalogue. Lines whose product no longer
 * exists are silently dropped.
 */
const refreshGuestCart = async (signal) => {
  const stored = readGuestCart();
  if (stored.length === 0) return [];

  const results = await Promise.all(
    stored.map(async (line) => {
      try {
        const { product } = await fetchProduct(line.productId, signal);
        if (!product || product.stock <= 0) return null;
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          category: product.category,
          quantity: Math.min(line.quantity, product.stock),
        };
      } catch (error) {
        if (error?.name === 'AbortError') throw error;
        return null;
      }
    }),
  );

  const fresh = results.filter(Boolean);
  writeGuestCart(fresh);
  return fresh;
};

const withLineTotals = (items) =>
  items.map((line) => ({ ...line, lineTotal: line.price * line.quantity }));

/* ------------------------------------------------------------------ */

export const CartProvider = ({ children }) => {
  const { isAuthenticated, initialising, user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const markPending = useCallback((productId, isPending) => {
    setPendingIds((current) =>
      isPending
        ? [...new Set([...current, productId])]
        : current.filter((id) => id !== productId),
    );
  }, []);

  /** Load (or, right after login, merge) the cart whenever the session changes. */
  useEffect(() => {
    if (initialising) return undefined;
    const controller = new AbortController();

    const sync = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const guestLines = readGuestCart();
          const data = guestLines.length
            ? await cartService.mergeCart(
                guestLines.map(({ productId, quantity }) => ({ productId, quantity })),
              )
            : await cartService.fetchCart(controller.signal);
          if (guestLines.length) writeGuestCart([]);
          if (!controller.signal.aborted) setItems(data.items ?? []);
        } else {
          const guestItems = await refreshGuestCart(controller.signal);
          if (!controller.signal.aborted) setItems(withLineTotals(guestItems));
        }
      } catch (error) {
        if (error?.name !== 'AbortError' && !controller.signal.aborted) {
          setItems([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    sync();
    return () => controller.abort();
  }, [initialising, isAuthenticated, user?.id]);

  /* ---------------- mutations ---------------- */

  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (!product) return;
      if (product.stock <= 0) {
        toast.error(`«${product.name}» در حال حاضر موجود نیست.`);
        return;
      }
      markPending(product.id, true);
      try {
        if (isAuthenticated) {
          const data = await cartService.addToCart(product.id, quantity);
          setItems(data.items ?? []);
          toast.success(data.message || `«${product.name}» به سبد خرید اضافه شد.`);
        } else {
          let capped = false;
          const next = (() => {
            const existing = items.find((line) => line.productId === product.id);
            const desired = (existing?.quantity ?? 0) + quantity;
            const clamped = Math.min(desired, product.stock);
            capped = clamped < desired;
            if (existing) {
              return items.map((line) =>
                line.productId === product.id ? { ...line, quantity: clamped } : line,
              );
            }
            return [
              ...items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
                category: product.category,
                quantity: clamped,
              },
            ];
          })();

          writeGuestCart(next);
          setItems(withLineTotals(next));
          toast.success(
            capped
              ? 'بیشتر از موجودی انبار نمی‌توانید سفارش دهید؛ تعداد به حداکثر موجودی تغییر کرد.'
              : `«${product.name}» به سبد خرید اضافه شد.`,
          );
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        if (mounted.current) markPending(product.id, false);
      }
    },
    [isAuthenticated, items, markPending, toast],
  );

  const setQuantity = useCallback(
    async (productId, quantity) => {
      markPending(productId, true);
      try {
        if (isAuthenticated) {
          const data =
            quantity <= 0
              ? await cartService.removeCartItem(productId)
              : await cartService.updateCartItem(productId, quantity);
          setItems(data.items ?? []);
          if (data.message) toast.info(data.message);
        } else {
          const next =
            quantity <= 0
              ? items.filter((line) => line.productId !== productId)
              : items.map((line) =>
                  line.productId === productId
                    ? { ...line, quantity: Math.min(quantity, line.stock) }
                    : line,
                );
          writeGuestCart(next);
          setItems(withLineTotals(next));
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        if (mounted.current) markPending(productId, false);
      }
    },
    [isAuthenticated, items, markPending, toast],
  );

  const removeItem = useCallback((productId) => setQuantity(productId, 0), [setQuantity]);

  const clear = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (isAuthenticated) {
          const data = await cartService.clearCart();
          setItems(data.items ?? []);
          if (!silent) toast.info(data.message || 'سبد خرید خالی شد.');
        } else {
          writeGuestCart([]);
          setItems([]);
          if (!silent) toast.info('سبد خرید خالی شد.');
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
    [isAuthenticated, toast],
  );

  /** Turns the cart into an order. Only reachable for signed-in users. */
  const checkout = useCallback(async () => {
    const data = await orderService.checkout();
    setItems([]);
    setDrawerOpen(false);
    return data;
  }, []);

  /* ---------------- derived ---------------- */

  const { subtotal, itemsCount } = useMemo(
    () =>
      items.reduce(
        (acc, line) => ({
          subtotal: acc.subtotal + line.price * line.quantity,
          itemsCount: acc.itemsCount + line.quantity,
        }),
        { subtotal: 0, itemsCount: 0 },
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      subtotal,
      itemsCount,
      loading,
      pendingIds,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      quantityOf: (productId) =>
        items.find((line) => line.productId === productId)?.quantity ?? 0,
      addItem,
      setQuantity,
      removeItem,
      clear,
      checkout,
    }),
    [
      items,
      subtotal,
      itemsCount,
      loading,
      pendingIds,
      drawerOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      checkout,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
};

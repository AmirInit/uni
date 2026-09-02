/**
 * Thin fetch wrapper around the REST API.
 *
 * In development Vite proxies `/api` to the Express server (see vite.config.js),
 * so no absolute URL or CORS configuration is needed. `VITE_API_URL` can still
 * point the build at a different host if the app is ever deployed separately.
 */
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = 'shop.token';

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* Private-mode browsers block localStorage; the app still works per-session. */
    }
  },
  clear: () => tokenStorage.set(null),
};

/** An API error carrying the server's Persian message and per-field errors. */
export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/** Called by AuthContext so a 401 anywhere can log the user out globally. */
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const request = async (path, { method = 'GET', body, auth = true, signal } = {}) => {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = auth ? tokenStorage.get() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    // Network-level failure: the API isn't running, or the machine is offline.
    throw new ApiError(
      'ارتباط با سرور برقرار نشد. مطمئن شوید سرور در حال اجراست و دوباره تلاش کنید.',
      { status: 0 },
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized?.();
    throw new ApiError(payload?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.', {
      status: response.status,
      errors: payload?.errors ?? null,
    });
  }

  // The server's Persian success message rides along under `message` so callers
  // can feed it straight into a toast. No endpoint puts a `message` key inside
  // `data`, so there is nothing to collide with.
  return { ...(payload?.data ?? {}), message: payload?.message };
};

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export default api;

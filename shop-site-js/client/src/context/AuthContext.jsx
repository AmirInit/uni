import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler, tokenStorage } from '../services/apiClient.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Holds the signed-in user and the JWT.
 *
 * The token lives in localStorage so a page refresh keeps the session; on boot
 * it is verified against `GET /api/auth/me` before the app renders, so a stale
 * or tampered token never produces a half-logged-in UI.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Any 401 from any request drops the session — the token has expired.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear();
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const restoreSession = async () => {
      if (!tokenStorage.get()) {
        setInitialising(false);
        return;
      }
      try {
        const { user: currentUser } = await authService.fetchCurrentUser(controller.signal);
        setUser(currentUser ?? null);
      } catch (error) {
        if (error?.name !== 'AbortError') tokenStorage.clear();
      } finally {
        if (!controller.signal.aborted) setInitialising(false);
      }
    };

    restoreSession();
    return () => controller.abort();
  }, []);

  const applySession = useCallback(({ user: nextUser, token }) => {
    if (token) tokenStorage.set(token);
    setUser(nextUser ?? null);
    return nextUser;
  }, []);

  const login = useCallback(
    async (credentials) => applySession(await authService.login(credentials)),
    [applySession],
  );

  const register = useCallback(
    async (payload) => applySession(await authService.register(payload)),
    [applySession],
  );

  const updateProfile = useCallback(
    async (payload) => {
      const result = await authService.updateProfile(payload);
      applySession(result);
      return result;
    },
    [applySession],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      initialising,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, initialising, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};

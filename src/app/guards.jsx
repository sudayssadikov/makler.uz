import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Login talab qiladigan sahifalar uchun himoya.
 * Auth holati aniqlanmaguncha (isLoading) hech narsa chizmaydi,
 * login qilinmagan bo'lsa login modalini ochib, bosh sahifaga yo'naltiradi.
 */
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading, openLoginModal } = useAuthStore();
  const location = useLocation();
  // Modalni bir marta ochish himoyasi — ref renderni qaytadan boshlamaydi,
  // shu sababli effect ichida setState chaqirish shart emas.
  const promptedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !promptedRef.current) {
      promptedRef.current = true;
      openLoginModal();
    }
  }, [isLoading, isAuthenticated, openLoginModal]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return children;
};

/**
 * Faqat ADMIN roli uchun himoya.
 */
export const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, openLoginModal } = useAuthStore();
  // Modalni bir marta ochish himoyasi — ref renderni qaytadan boshlamaydi,
  // shu sababli effect ichida setState chaqirish shart emas.
  const promptedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !promptedRef.current) {
      promptedRef.current = true;
      openLoginModal();
    }
  }, [isLoading, isAuthenticated, openLoginModal]);

  if (isLoading) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;
  return children;
};
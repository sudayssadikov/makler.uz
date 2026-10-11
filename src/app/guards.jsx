import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';

/**
 * 1. PrivateRoute / RequireAuth
 * Login qilinmagan bo'lsa login modalini ochadi va bosh sahifaga yo'naltiradi.
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, openLoginModal } = useAuthStore();
  const location = useLocation();
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

export const RequireAuth = PrivateRoute;

/**
 * 2. PublicOnlyRoute
 * Faqat mehmonlar uchun (agar login qilingan bo'lsa, asosiy sahifaga yo'naltiradi).
 */
export const PublicOnlyRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
};

/**
 * 3. RoleRoute
 * Muayan rollar (masalan 'ADMIN', 'SUPER_ADMIN', 'AGENT') uchun himoya.
 */
export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading, openLoginModal } = useAuthStore();
  const promptedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !promptedRef.current) {
      promptedRef.current = true;
      openLoginModal();
    }
  }, [isLoading, isAuthenticated, openLoginModal]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(role);
  if (!hasAccess) return <Navigate to="/403" replace />;

  return children;
};

/**
 * 4. RequireAdmin
 * Admin huquqlari (ADMIN, SUPER_ADMIN, MODERATOR, FINANCE, SUPPORT)
 */
export const RequireAdmin = ({ children }) => {
  return (
    <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'FINANCE', 'SUPPORT']}>
      {children}
    </RoleRoute>
  );
};

/**
 * 5. VerifiedRoute
 * Faqat shaxsi tasdiqlangan (JSHSHIR VERIFIED) foydalanuvchilar e'lon qo'ya oladi yoki zayavka yubora oladi.
 */
export const VerifiedRoute = ({ children }) => {
  const { isAuthenticated, status, isLoading, openLoginModal } = useAuthStore();
  const location = useLocation();
  const notifiedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal();
    } else if (!isLoading && isAuthenticated && status !== 'VERIFIED' && !notifiedRef.current) {
      notifiedRef.current = true;
      toast.warning('Eʼlon berish uchun avval shaxsingizni tasdiqlang (JSHSHIR / Pasport).');
    }
  }, [isLoading, isAuthenticated, status, openLoginModal]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location.pathname }} />;

  if (status !== 'VERIFIED') {
    return <Navigate to="/" replace state={{ showVerificationPrompt: true }} />;
  }

  return children;
};
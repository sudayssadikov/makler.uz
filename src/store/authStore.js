import { create } from 'zustand';
import { sendOtp, verifyOtp, loginWithGoogleAccount, registerUser, resubmitVerificationDocs, logoutApi } from '../services/api/authService';
import { getProfileApi } from '../services/api/userService';
import { getAccessToken, decodeJwt, isTokenExpired, clearTokens } from '../utils/tokenUtils';
import { toast } from './toastStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  status: null, // 'PHONE_VERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'BLOCKED'
  isAuthenticated: false,
  isLoading: true,
  sessionExpiresAt: null,
  isSessionExpiredModalOpen: false,

  // Modal controls
  isLoginModalOpen: false,
  isRegisterModalOpen: false,

  openLoginModal: () => set({ isLoginModalOpen: true, isRegisterModalOpen: false }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openRegisterModal: () => set({ isRegisterModalOpen: true, isLoginModalOpen: false }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  closeSessionExpiredModal: () => set({ isSessionExpiredModalOpen: false }),

  // 1. Dastur yuklanganda sessiyani tiklash (Bootstrap)
  initAuth: async () => {
    try {
      const token = getAccessToken();
      if (!token || isTokenExpired(token)) {
        clearTokens();
        set({ user: null, role: null, status: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const decoded = decodeJwt(token);
      const res = await getProfileApi();

      if (res.data) {
        const u = res.data;
        set({
          user: u,
          role: u.role || 'USER',
          status: u.status || u.verificationStatus || 'PHONE_VERIFIED',
          isAuthenticated: true,
          sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
          isLoading: false
        });
      } else {
        clearTokens();
        set({ user: null, role: null, status: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      clearTokens();
      set({ user: null, role: null, status: null, isAuthenticated: false, isLoading: false });
    }
  },

  // 2. OTP yuborish
  sendSmsCode: async (phone) => {
    const res = await sendOtp(phone);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }
    return res.data;
  },

  // 3. OTP tasdiqlash va Kirish
  loginWithOtp: async ({ phone, code, rememberMe }) => {
    const res = await verifyOtp({ phone, code, rememberMe });
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);

    set({
      user,
      role: user.role,
      status: user.status || user.verificationStatus,
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      isLoginModalOpen: false
    });

    toast.success(`Hush kelibsiz, ${user.firstName}!`);
    return user;
  },

  // 4. Google bilan kirish
  loginWithGoogle: async (googleProfile, rememberMe = true) => {
    const res = await loginWithGoogleAccount(googleProfile, rememberMe);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);

    set({
      user,
      role: user.role,
      status: user.status || user.verificationStatus,
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      isLoginModalOpen: false
    });

    toast.success('Google orqali tizimga kirdingiz!');
    return user;
  },

  // 5. Ko'p bosqichli ro'yxatdan o'tish
  register: async (formData) => {
    const res = await registerUser(formData);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);

    set({
      user,
      role: user.role,
      status: user.status,
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      isRegisterModalOpen: false
    });

    toast.success('Roʻyxatdan oʻtildi! Hujjatlaringiz tekshiruvga yuborildi.');
    return user;
  },

  // 6. Hujjatlarni qayta yuborish
  resubmitDocs: async (docs) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const res = await resubmitVerificationDocs(currentUser.id, docs);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }
    set({ user: res.data, status: 'PENDING_REVIEW' });
    toast.success('Hujjatlar qayta tekshiruvga yuborildi!');
  },

  // 7. Logout
  logout: async () => {
    await logoutApi();
    clearTokens();
    set({
      user: null,
      role: null,
      status: null,
      isAuthenticated: false,
      sessionExpiresAt: null
    });
    toast.info('Tizimdan chiqdingiz');
    // Boshqa tablarni xabardor qilish
    localStorage.setItem('makler_tab_logout', Date.now().toString());
  },

  // Demo Switcher
  switchRole: (targetRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: targetRole,
      status: targetRole === 'ADMIN' ? 'VERIFIED' : currentUser.status
    };
    set({
      user: updated,
      role: targetRole,
      status: updated.status
    });
    toast.success(`Rol almashtirildi: ${targetRole}`);
  }
}));

// Multi-tab logout listener
window.addEventListener('storage', (e) => {
  if (e.key === 'makler_tab_logout') {
    useAuthStore.setState({
      user: null,
      role: null,
      status: null,
      isAuthenticated: false,
      sessionExpiresAt: null
    });
  }
});

// Session expired listener
window.addEventListener('makler:session_expired', () => {
  useAuthStore.setState({
    user: null,
    role: null,
    status: null,
    isAuthenticated: false,
    sessionExpiresAt: null,
    isSessionExpiredModalOpen: true
  });
});

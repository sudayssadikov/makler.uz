import { create } from 'zustand';
import {
  sendOtp,
  verifyOtp,
  loginWithGoogleAccount,
  registerUser,
  resubmitVerificationDocs,
  logoutApi,
  loginStaff as loginStaffApi,
  verifyStaffOtp as verifyStaffOtpApi
} from '../services/api/authService';
import { getProfileApi } from '../services/api/userService';
import { getAccessToken, decodeJwt, isTokenExpired, clearTokens } from '../utils/tokenUtils';
import { toast } from './toastStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  status: null, // 'PHONE_VERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'BLOCKED'
  isAdmin: false,
  isAgent: false,
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
        set({ user: null, role: null, status: null, isAdmin: false, isAgent: false, isAuthenticated: false, isLoading: false });
        return;
      }

      const decoded = decodeJwt(token);
      const res = await getProfileApi();

      if (res.data) {
        const u = res.data;
        const role = u.role || 'USER';
        set({
          user: u,
          role,
          status: u.status || u.verificationStatus || 'PHONE_VERIFIED',
          isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MODERATOR' || role === 'FINANCE' || role === 'SUPPORT',
          isAgent: role === 'AGENT',
          isAuthenticated: true,
          sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
          isLoading: false
        });
      } else {
        clearTokens();
        set({ user: null, role: null, status: null, isAdmin: false, isAgent: false, isAuthenticated: false, isLoading: false });
      }
    } catch {
      clearTokens();
      set({ user: null, role: null, status: null, isAdmin: false, isAgent: false, isAuthenticated: false, isLoading: false });
    }
  },

  // 2. OTP yuborish
  requestOtp: async (phone) => {
    return get().sendSmsCode(phone);
  },

  sendSmsCode: async (phone) => {
    const res = await sendOtp(phone);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }
    return res.data;
  },

  // 3. OTP tasdiqlash va Kirish: loginWithPhone
  loginWithPhone: async (phone, code, rememberMe = true) => {
    const res = await verifyOtp({ phone, code, rememberMe });
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);
    const role = user.role || 'USER';

    set({
      user,
      role,
      status: user.status || user.verificationStatus,
      isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MODERATOR' || role === 'FINANCE' || role === 'SUPPORT',
      isAgent: role === 'AGENT',
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      isLoginModalOpen: false
    });

    toast.success(`Xush kelibsiz, ${user.firstName || 'Foydalanuvchi'}!`);
    return user;
  },

  // Alias eski nomlar uchun
  loginPhone: async (phone, code, rememberMe = true) => {
    return get().loginWithPhone(phone, code, rememberMe);
  },

  loginWithOtp: async ({ phone, code, rememberMe = true }) => {
    return get().loginWithPhone(phone, code, rememberMe);
  },

  // 4. Google bilan kirish
  loginGoogle: async (profile) => {
    const defaultProfile = {
      email: 'user.demo@makler.uz',
      name: 'Jasur Mansurov',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
    };
    return get().loginWithGoogle(profile || defaultProfile);
  },

  loginWithGoogle: async (googleProfile, rememberMe = true) => {
    const profile = googleProfile || {
      email: 'user.demo@makler.uz',
      name: 'Jasur Mansurov',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
    };
    const res = await loginWithGoogleAccount(profile, rememberMe);
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);
    const role = user.role || 'USER';

    set({
      user,
      role,
      status: user.status || user.verificationStatus,
      isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MODERATOR' || role === 'FINANCE' || role === 'SUPPORT',
      isAgent: role === 'AGENT',
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
      isLoginModalOpen: false
    });

    toast.success('Google orqali tizimga kirdingiz!');
    return user;
  },

  // 4b. Xodimlar kirishi: Login + Parol (1-bosqich)
  loginStaff: async ({ identifier, password }) => {
    const res = await loginStaffApi({ identifier, password });
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }
    return res.data;
  },

  // 4c. Xodimlar 2-bosqichli OTP tasdiqlashi (2-bosqich)
  verifyStaffOtp: async ({ phone, code, rememberMe = true }) => {
    const res = await verifyStaffOtpApi({ phone, code, rememberMe });
    if (res.error) {
      toast.error(res.error.message);
      throw res.error;
    }

    const { user, tokens } = res.data;
    const decoded = decodeJwt(tokens.accessToken);
    const role = user.role;

    set({
      user,
      role,
      status: user.status || user.verificationStatus,
      isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MODERATOR' || role === 'FINANCE' || role === 'SUPPORT',
      isAgent: role === 'AGENT',
      isAuthenticated: true,
      sessionExpiresAt: decoded?.exp ? decoded.exp * 1000 : null
    });

    toast.success(`Xush kelibsiz, ${user.firstName || 'Xodim'}!`);
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
      isAdmin: false,
      isAgent: false,
      isAuthenticated: false,
      sessionExpiresAt: null
    });
    toast.info('Tizimdan chiqdingiz');
    // Boshqa tablarni xabardor qilish
    localStorage.setItem('makler_tab_logout', Date.now().toString());
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

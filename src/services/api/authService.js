import { mockApiResponse } from './httpClient';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '../storage';
import { createMockJwt, saveTokens, clearTokens } from '../../utils/tokenUtils';

const OTP_STORE_KEY = 'makler_active_otps';
const ATTEMPTS_STORE_KEY = 'makler_otp_attempts';

/**
 * 1. Telefon raqamga OTP yuborish
 */
export const sendOtp = async (phone) => {
  return mockApiResponse(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      const err = new Error('Telefon raqami notoʻgʻri kiritildi');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // 5 marta xato urinishlar va 15 min bloklanish tekshiruvi
    const attemptsDb = getFromStorage(ATTEMPTS_STORE_KEY, {});
    const userAttempts = attemptsDb[cleanPhone] || { count: 0, blockedUntil: 0 };
    const now = Date.now();

    if (userAttempts.blockedUntil > now) {
      const remainingMinutes = Math.ceil((userAttempts.blockedUntil - now) / 60000);
      const err = new Error(`Urinishlar limiti oshdi. Iltimos, ${remainingMinutes} daqiqadan soʻng qayta urinib koʻring.`);
      err.code = 'TOO_MANY_ATTEMPTS';
      err.details = { remainingMinutes };
      throw err;
    }

    // Foydalanuvchi bazada bormi?
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const existing = users.find((u) => u.phone.replace(/\D/g, '') === cleanPhone);

    const mockCode = '123456';
    const otpData = {
      phone: cleanPhone,
      code: mockCode,
      createdAt: now,
      expiresAt: now + 5 * 60 * 1000 // 5 daqiqada eskiradi
    };

    const otps = getFromStorage(OTP_STORE_KEY, {});
    otps[cleanPhone] = otpData;
    setToStorage(OTP_STORE_KEY, otps);

    return {
      sent: true,
      phone: cleanPhone,
      retryAfterSeconds: 60,
      expiresInSeconds: 300,
      isRegistered: !!existing,
      devMockCode: mockCode // Development test uchun
    };
  }, 400);
};

/**
 * 2. OTP kodni tekshirish va kirish
 */
export const verifyOtp = async ({ phone, code, rememberMe = true }) => {
  return mockApiResponse(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    const otps = getFromStorage(OTP_STORE_KEY, {});
    const activeOtp = otps[cleanPhone];
    const now = Date.now();

    // Urinishlarni hisoblash
    const attemptsDb = getFromStorage(ATTEMPTS_STORE_KEY, {});
    const userAttempts = attemptsDb[cleanPhone] || { count: 0, blockedUntil: 0 };

    if (userAttempts.blockedUntil > now) {
      const remainingMinutes = Math.ceil((userAttempts.blockedUntil - now) / 60000);
      const err = new Error(`Raqamingiz 15 daqiqaga bloklangan. Qolgan vaqt: ${remainingMinutes} daqiqa.`);
      err.code = 'TOO_MANY_ATTEMPTS';
      err.details = { remainingMinutes };
      throw err;
    }

    if (!activeOtp || activeOtp.expiresAt < now) {
      const err = new Error('SMS kod eskirgan. Yangi kod soʻrang.');
      err.code = 'OTP_EXPIRED';
      throw err;
    }

    if (activeOtp.code !== code.trim()) {
      userAttempts.count = (userAttempts.count || 0) + 1;
      if (userAttempts.count >= 5) {
        userAttempts.blockedUntil = now + 15 * 60 * 1000; // 15 daqiqa blok
        userAttempts.count = 0;
        attemptsDb[cleanPhone] = userAttempts;
        setToStorage(ATTEMPTS_STORE_KEY, attemptsDb);

        const err = new Error('5 marta notoʻgʻri kod kiritildi. Raqam 15 daqiqaga bloklandi.');
        err.code = 'TOO_MANY_ATTEMPTS';
        err.details = { remainingMinutes: 15 };
        throw err;
      }
      attemptsDb[cleanPhone] = userAttempts;
      setToStorage(ATTEMPTS_STORE_KEY, attemptsDb);

      const err = new Error(`SMS kod notoʻgʻri. Qolgan urinishlar: ${5 - userAttempts.count}`);
      err.code = 'INVALID_OTP';
      err.details = { remainingAttempts: 5 - userAttempts.count };
      throw err;
    }

    // Kod to'g'ri bo'lsa urinishlarni tozalash
    delete attemptsDb[cleanPhone];
    delete otps[cleanPhone];
    setToStorage(ATTEMPTS_STORE_KEY, attemptsDb);
    setToStorage(OTP_STORE_KEY, otps);

    // Foydalanuvchini topish yoki yaratish
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    let user = users.find((u) => u.phone.replace(/\D/g, '') === cleanPhone);

    if (!user) {
      const err = new Error('Ushbu raqam bilan foydalanuvchi topilmadi. Avval roʻyxatdan oʻting.');
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    // Agar hisob bloklangan bo'lsa (ACCOUNT_BLOCKED)
    if (user.status === 'BLOCKED') {
      const err = new Error(`Sizning hisobingiz bloklangan. Sabab: ${user.blockReason || 'Qoidalarni buzish'}`);
      err.code = 'ACCOUNT_BLOCKED';
      err.details = { reason: user.blockReason, blockedAt: user.blockedAt };
      throw err;
    }

    // Mock JWT tokenlar (access: 15 min, refresh: 7 kun)
    const accessToken = createMockJwt({ userId: user.id, role: user.role, status: user.status }, 900);
    const refreshToken = createMockJwt({ userId: user.id, type: 'refresh' }, 7 * 86400);

    saveTokens({ accessToken, refreshToken, rememberMe });
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);

    return {
      user,
      tokens: { accessToken, refreshToken, expiresIn: 900 }
    };
  }, 500);
};

/**
 * 3. Google OAuth orqali kirish
 */
export const loginWithGoogleAccount = async (googleProfile, rememberMe = true) => {
  return mockApiResponse(() => {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    let user = users.find((u) => u.email === googleProfile.email);

    if (!user) {
      user = {
        id: 'user_g_' + Date.now(),
        email: googleProfile.email,
        phone: googleProfile.phone || '+998901234567',
        firstName: googleProfile.name.split(' ')[0] || 'Google',
        lastName: googleProfile.name.split(' ')[1] || 'User',
        role: 'USER',
        status: 'PHONE_VERIFIED',
        verificationStatus: 'PENDING',
        avatar: googleProfile.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250',
        rating: 5.0,
        dealsCount: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      setToStorage(STORAGE_KEYS.USERS, users);
    }

    if (user.status === 'BLOCKED') {
      const err = new Error(`Hisob bloklangan. Sabab: ${user.blockReason || 'Nomaʼlum'}`);
      err.code = 'ACCOUNT_BLOCKED';
      throw err;
    }

    const accessToken = createMockJwt({ userId: user.id, role: user.role, status: user.status }, 900);
    const refreshToken = createMockJwt({ userId: user.id, type: 'refresh' }, 7 * 86400);

    saveTokens({ accessToken, refreshToken, rememberMe });
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);

    return { user, tokens: { accessToken, refreshToken, expiresIn: 900 } };
  }, 600);
};

/**
 * 4. Ko'p bosqichli ro'yxatdan o'tish
 */
export const registerUser = async (formData) => {
  return mockApiResponse(() => {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);

    // 18 yoshdan kichik bo'lsa
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const ageDifMs = Date.now() - birth.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) {
        const err = new Error('Roʻyxatdan oʻtish uchun 18 yoshga toʻlgan boʻlishingiz shart!');
        err.code = 'UNDERAGE';
        throw err;
      }
    }

    // JSHSHIR nazorat tekshiruvi
    const pinfl = formData.pinfl?.replace(/\D/g, '');
    if (!pinfl || pinfl.length !== 14) {
      const err = new Error('JSHSHIR aynan 14 ta raqamdan iborat boʻlishi kerak!');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // JSHSHIR bandligi tekshiruvi (Dublikat)
    const pinflExists = users.some((u) => u.pinfl === pinfl);
    if (pinflExists) {
      const err = new Error('Ushbu JSHSHIR allaqachon boshqa foydalanuvchi tomonidan roʻyxatdan oʻtkazilgan!');
      err.code = 'DUPLICATE_PINFL';
      throw err;
    }

    const newUser = {
      id: 'user_' + Date.now(),
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      gender: formData.gender || 'not_specified',
      pinfl,
      passportFront: formData.passportFront || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      passportBack: formData.passportBack || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      selfie: formData.selfie || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
      role: 'USER',
      status: 'PENDING_REVIEW', // Dastlabki holat
      verificationStatus: 'PENDING',
      rating: 5.0,
      dealsCount: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setToStorage(STORAGE_KEYS.USERS, users);

    const accessToken = createMockJwt({ userId: newUser.id, role: newUser.role, status: newUser.status }, 900);
    const refreshToken = createMockJwt({ userId: newUser.id, type: 'refresh' }, 7 * 86400);

    saveTokens({ accessToken, refreshToken, rememberMe: true });
    setToStorage(STORAGE_KEYS.CURRENT_USER, newUser);

    // Qoralamani o'chirish
    localStorage.removeItem('makler_register_draft');

    return {
      user: newUser,
      tokens: { accessToken, refreshToken, expiresIn: 900 }
    };
  }, 700);
};

/**
 * 5. Hujjatlarni qayta yuborish (REJECTED holatdan so'ng)
 */
export const resubmitVerificationDocs = async (userId, docs) => {
  return mockApiResponse(() => {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Foydalanuvchi topilmadi');

    users[idx] = {
      ...users[idx],
      ...docs,
      status: 'PENDING_REVIEW',
      verificationStatus: 'PENDING',
      rejectReason: null,
      resubmittedAt: new Date().toISOString()
    };

    setToStorage(STORAGE_KEYS.USERS, users);
    setToStorage(STORAGE_KEYS.CURRENT_USER, users[idx]);
    return users[idx];
  }, 500);
};

/**
 * 6. Chiqish (Logout)
 */
export const logoutApi = async () => {
  return mockApiResponse(() => {
    clearTokens();
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  }, 200);
};

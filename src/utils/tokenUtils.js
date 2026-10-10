/**
 * Mock JWT Token generatori va dekoderi
 * Haqiqiy JWT formatida: header.payload.signature
 */

export const createMockJwt = (payload, expiresInSeconds = 900) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const b64Header = btoa(JSON.stringify(header));
  const b64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(fullPayload))));
  const mockSig = btoa(`sig_${now}_${payload.userId || 'usr'}`);

  return `${b64Header}.${b64Payload}.${mockSig}`;
};

export const decodeJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payloadStr = decodeURIComponent(escape(atob(parts[1])));
    return JSON.parse(payloadStr);
  } catch (e) {
    console.error('Failed to decode mock JWT:', e);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now;
};

// Storage helpers with Remember Me support
const TOKEN_KEY = 'makler_access_token';
const REFRESH_KEY = 'makler_refresh_token';
const REMEMBER_KEY = 'makler_remember_me';

export const saveTokens = ({ accessToken, refreshToken, rememberMe = true }) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(REMEMBER_KEY, JSON.stringify(rememberMe));
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};

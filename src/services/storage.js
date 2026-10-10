import { INITIAL_USERS, INITIAL_LISTINGS, INITIAL_REQUESTS, INITIAL_CONTRACTS } from './mockData';

const STORAGE_KEYS = {
  USERS: 'makler_users_db',
  LISTINGS: 'makler_listings_db',
  REQUESTS: 'makler_requests_db',
  CONTRACTS: 'makler_contracts_db',
  CURRENT_USER: 'makler_current_user',
  FAVORITES: 'makler_user_favorites',
  AUDIT_LOGS: 'makler_audit_logs_db',
  NOTIFICATIONS: 'makler_notifications_db'
};

// Initialize localStorage with mock data if not already set
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTRACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in as tenant/user for seamless demo
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[3]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['list_1']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFromStorage = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Storage parse error for', key, e);
    return fallback;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set error for', key, e);
  }
};

/**
 * Audit log qo'shish (har holat o'zgarishi, to'lov, admin topshirishi uchun)
 */
export const addAuditLog = (entry) => {
  const logs = getFromStorage(STORAGE_KEYS.AUDIT_LOGS, []);
  const newLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    ...entry
  };
  logs.unshift(newLog);
  setToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  return newLog;
};

/**
 * Audit loglarni olish
 */
export const getAuditLogs = (filter = {}) => {
  const logs = getFromStorage(STORAGE_KEYS.AUDIT_LOGS, []);
  return logs.filter((l) => {
    if (filter.entityType && l.entityType !== filter.entityType) return false;
    if (filter.entityId && l.entityId !== filter.entityId) return false;
    return true;
  });
};

/**
 * Foydalanuvchiga bildirishnoma yuborish
 */
export const addNotification = (notif) => {
  const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  const newNotif = {
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    isRead: false,
    ...notif
  };
  list.unshift(newNotif);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, list);
  return newNotif;
};

/**
 * Bildirishnomalarni olish
 */
export const getNotifications = (userId) => {
  const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  if (!userId) return list;
  return list.filter((n) => n.userId === userId);
};

export { STORAGE_KEYS };

import { delay, getFromStorage, setToStorage, STORAGE_KEYS } from './storage';
import { REQUEST_STATUS, ALLOWED_TRANSITIONS } from '../constants/requestStatus';

/**
 * Zayavka yuborish
 * @param {string} listingId
 * @param {string} tenantId
 * @param {string} ownerId
 * @param {string} [notes]
 * @returns {Promise<Object>}
 */
export const createRequest = async (listingId, tenantId, ownerId, notes = '') => {
  await delay(400);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);

  const newRequest = {
    id: 'req_' + Date.now(),
    listingId,
    tenantId,
    ownerId,
    notes,
    status: REQUEST_STATUS.SUBMITTED,
    escrowAmount: 0,
    escrowCurrency: 'USD',
    history: [
      {
        status: REQUEST_STATUS.SUBMITTED,
        timestamp: new Date().toISOString(),
        note: 'Zayavka qidiruvchi tomonidan yuborildi'
      }
    ],
    createdAt: new Date().toISOString()
  };

  requests.unshift(newRequest);
  setToStorage(STORAGE_KEYS.REQUESTS, requests);
  return newRequest;
};

/**
 * Barcha zayavkalarni olish (foydalanuvchi yoki ega bo'yicha)
 * @param {string} [userId]
 * @returns {Promise<Array>}
 */
export const getRequests = async (userId) => {
  await delay(250);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);

  // Enrich with listing and user details
  const enriched = requests.map((req) => {
    const listing = listings.find((l) => l.id === req.listingId) || null;
    const tenant = users.find((u) => u.id === req.tenantId) || null;
    const owner = users.find((u) => u.id === req.ownerId) || null;
    return { ...req, listing, tenant, owner };
  });

  if (!userId) return enriched;
  return enriched.filter((r) => r.tenantId === userId || r.ownerId === userId);
};

/**
 * ID bo'yicha zayavkani olish
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getRequestById = async (id) => {
  await delay(150);
  const list = await getRequests();
  return list.find((r) => r.id === id) || null;
};

/**
 * Zayavka statusini yangilash (Holat mashinasi tekshiruvi bilan)
 * @param {string} id
 * @param {string} newStatus
 * @param {string} [note]
 * @param {Object} [extraData]
 * @returns {Promise<Object>}
 */
export const transitionRequestStatus = async (id, newStatus, note = '', extraData = {}) => {
  await delay(350);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const index = requests.findIndex((r) => r.id === id);

  if (index === -1) throw new Error('Request not found');

  const current = requests[index];

  // Holat mashinasi validatsiyasi
  const allowed = ALLOWED_TRANSITIONS[current.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from ${current.status} to ${newStatus}`);
  }

  const historyEntry = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status ${newStatus} ga oʻzgardi`
  };

  const updated = {
    ...current,
    status: newStatus,
    history: [...current.history, historyEntry],
    ...extraData
  };

  // Agar ACCEPTED bo'lsa, to'lov ochiladi (48 soatlik vaqt boshlanadi)
  if (newStatus === REQUEST_STATUS.ACCEPTED) {
    updated.status = REQUEST_STATUS.PAYMENT_PENDING;
    updated.expiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  }

  // Agar bekor qilinsa yoki ega 48 soatda bajarmasa, avtomatik qaytariladi
  if (newStatus === REQUEST_STATUS.CANCELLED && current.status === REQUEST_STATUS.PAID_ESCROW) {
    updated.status = REQUEST_STATUS.REFUNDED;
    updated.refundedAt = new Date().toISOString();
  }

  requests[index] = updated;
  setToStorage(STORAGE_KEYS.REQUESTS, requests);

  return updated;
};

/**
 * 48 soatlik kafolat mexanizmi: muddati o'tgan PAYMENT_PENDING zayavkalarni
 * avtomatik bekor qilish (CANCELLED). Qayta chaqirilganda xavfsiz (idempotent).
 * Sahifa yuklanganda chaqiriladi — real backend'dagi cron o'rniga mock.
 * @returns {Promise<Array>} muddati o'tib bekor qilingan zayavkalar ID'lari
 */
export const checkExpiredPayments = async () => {
  await delay(100);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const now = Date.now();
  const expiredIds = [];

  for (const req of requests) {
    if (req.status === REQUEST_STATUS.PAYMENT_PENDING && req.expiresAt && new Date(req.expiresAt).getTime() < now) {
      req.status = REQUEST_STATUS.CANCELLED;
      req.cancelledAt = new Date().toISOString();
      req.history = [
        ...(req.history || []),
        {
          status: REQUEST_STATUS.CANCELLED,
          timestamp: new Date().toISOString(),
          note: '48 soat ichida toʻlov amalga oshirilmagani uchun zayavka avtomatik bekor qilindi'
        }
      ];
      expiredIds.push(req.id);
    }
  }

  if (expiredIds.length > 0) {
    setToStorage(STORAGE_KEYS.REQUESTS, requests);
  }

  return expiredIds;
};

/**
 * 30$ xizmat to'lovini amalga oshirish (Click / Payme mock)
 * @param {string} requestId
 * @param {'click'|'payme'} provider
 * @param {Object} cardDetails
 * @returns {Promise<Object>}
 */
export const processEscrowPayment = async (requestId, provider, _cardDetails) => {
  // _cardDetails: mock rejimda servis faqat to'lov faktini qayd etadi,
  // karta ma'lumotlari saqlanmaydi va keyingi bosqichlarga uzatilmaydi.
  await delay(800); // Real to'lov kechikishi simulyatsiyasi

  return transitionRequestStatus(
    requestId,
    REQUEST_STATUS.PAID_ESCROW,
    `${provider.toUpperCase()} orqali $30 Escrow toʻlandi. Tranzaksiya raqami: TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    {
      escrowAmount: 30,
      escrowCurrency: 'USD',
      paymentProvider: provider,
      paymentTransactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    }
  );
};

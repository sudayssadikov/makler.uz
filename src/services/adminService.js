import { delay, getFromStorage, setToStorage, STORAGE_KEYS } from './storage';
import { REQUEST_STATUS, USER_VERIFICATION_STATUS } from '../constants/requestStatus';
import { transitionRequestStatus } from './requestsService';

/**
 * Admin uchun umumiy statistikalarni olish
 * @returns {Promise<Object>}
 */
export const getAdminStats = async () => {
  await delay(200);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);

  const totalEscrowAmount = requests
    .filter((r) => r.status === REQUEST_STATUS.PAID_ESCROW || r.status === REQUEST_STATUS.ADMIN_REVIEW)
    .reduce((sum, r) => sum + (r.escrowAmount || 0), 0);

  return {
    totalUsers: users.length,
    pendingUsers: users.filter((u) => u.verificationStatus === USER_VERIFICATION_STATUS.PENDING).length,
    totalListings: listings.length,
    activeListings: listings.filter((l) => l.status === 'ACTIVE').length,
    pendingListings: listings.filter((l) => l.status === 'PENDING_MODERATION').length,
    totalRequests: requests.length,
    escrowLockedCount: requests.filter((r) => r.status === REQUEST_STATUS.PAID_ESCROW).length,
    totalEscrowAmount,
    totalContracts: contracts.length,
    activeContracts: contracts.filter((c) => c.status === 'SIGNED' || c.status === 'ACTIVE').length,
    disputesCount: requests.filter((r) => r.status === REQUEST_STATUS.DISPUTED).length
  };
};

/**
 * Foydalanuvchini tasdiqlash yoki rad etish (JSHSHIR tekshiruvi)
 * @param {string} userId
 * @param {'VERIFIED'|'REJECTED'} status
 * @returns {Promise<Object>}
 */
export const verifyUser = async (userId, status) => {
  await delay(350);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) throw new Error('User not found');

  users[idx].verificationStatus = status;
  users[idx].verifiedAt = new Date().toISOString();
  setToStorage(STORAGE_KEYS.USERS, users);
  return users[idx];
};

/**
 * E'lonni moderatsiyadan o'tkazish (Tasdiqlash / Rad etish)
 * @param {string} listingId
 * @param {'ACTIVE'|'REJECTED'} status
 * @returns {Promise<Object>}
 */
export const moderateListing = async (listingId, status) => {
  await delay(350);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const idx = listings.findIndex((l) => l.id === listingId);

  if (idx === -1) throw new Error('Listing not found');

  listings[idx].status = status;
  listings[idx].moderatedAt = new Date().toISOString();
  setToStorage(STORAGE_KEYS.LISTINGS, listings);
  return listings[idx];
};

/**
 * Admin tomonidan Escrow to'lovini tasdiqlash va bitimni yakunlash ("Uyni olib berish")
 * Qoida: To'lov 100% to'lanmaguncha bu amal bajarilishi mumkin emas!
 * @param {string} requestId
 * @returns {Promise<Object>}
 */
export const finalizeHandover = async (requestId) => {
  await delay(450);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const req = requests.find((r) => r.id === requestId);

  if (!req) throw new Error('Request not found');

  if (req.escrowAmount < 30 || req.status !== REQUEST_STATUS.MOVE_IN_CONFIRMED) {
    throw new Error('Toʻlov 100% toʻlanmaguncha yoki koʻchib kirish tasdiqlanmaguncha uyni olib berish bloklangan!');
  }

  return transitionRequestStatus(
    requestId,
    REQUEST_STATUS.COMPLETED,
    'Admin uyni topshirishni tasdiqladi. Bitim muvaffaqiyatli yakunlandi va Escrow mablagʻi taqsimlandi.'
  );
};

/**
 * Nizoni hal qilish (Pulni ijarachiga qaytarish yoki egasiga o'tkazish)
 * @param {string} requestId
 * @param {'REFUND'|'COMPLETE'} resolution
 * @param {string} adminDecisionNote
 * @returns {Promise<Object>}
 */
export const resolveDispute = async (requestId, resolution, adminDecisionNote) => {
  await delay(400);
  const nextStatus = resolution === 'REFUND' ? REQUEST_STATUS.REFUNDED : REQUEST_STATUS.COMPLETED;
  return transitionRequestStatus(
    requestId,
    nextStatus,
    `Admin arbitraj qarori: ${adminDecisionNote}`
  );
};

/**
 * Band qilinganlar (Reservations) navbatini olish
 */
export const getReservedListingsQueue = async () => {
  await delay(150);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);

  const reserved = listings.filter((l) => ['RESERVED', 'HANDED_OVER'].includes(l.status));
  return reserved.map((item) => {
    const req = requests.find((r) => r.listingId === item.id && (r.status === REQUEST_STATUS.PAID_ESCROW || r.status === REQUEST_STATUS.CONTRACT_DRAFTING || r.status === REQUEST_STATUS.ADMIN_REVIEW)) || null;
    const tenant = req ? users.find((u) => u.id === req.tenantId) || null : null;
    const owner = users.find((u) => u.id === item.ownerId) || null;
    return {
      listing: item,
      request: req,
      tenant,
      owner
    };
  });
};

/**
 * Admin "Uyni topshirish" qilishi
 */
export const handoverListing = async (listingId, adminId) => {
  const { handoverListingByAdmin } = await import('./requestsService');
  return handoverListingByAdmin(listingId, adminId);
};

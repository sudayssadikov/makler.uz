import { delay, getFromStorage, setToStorage, STORAGE_KEYS, addAuditLog, addNotification } from './storage';
import { LISTING_STATUS, ALLOWED_LISTING_TRANSITIONS } from '../constants/listingStatus';
import { REQUEST_STATUS } from '../constants/requestStatus';

/**
 * Muddati o'tgan HOLD va Shartnoma taymerlarini tekshirish va avtomatik tiklash.
 * Sahifa yangilanganda ham ishlaydi (idempotent).
 */
export const checkListingHoldExpirations = async () => {
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const now = Date.now();
  let listingsUpdated = false;
  let requestsUpdated = false;

  for (const item of listings) {
    // 1. HOLD muddati tugagan (24 soat)
    if (item.status === LISTING_STATUS.HOLD && item.holdExpiresAt && new Date(item.holdExpiresAt).getTime() < now) {
      const prevHoldRequestId = item.holdByRequestId;
      item.status = LISTING_STATUS.ACTIVE;
      delete item.holdExpiresAt;
      delete item.holdByUserId;
      delete item.holdByRequestId;
      listingsUpdated = true;

      addAuditLog({
        entityType: 'LISTING',
        entityId: item.id,
        action: 'HOLD_EXPIRED_RETURN_TO_ACTIVE',
        fromStatus: LISTING_STATUS.HOLD,
        toStatus: LISTING_STATUS.ACTIVE,
        details: '24 soat ichida toʻlov amalga oshirilmagani sababli eʼlon avtomatik qayta faollashtirildi'
      });

      // Zayavkani bekor qilish
      if (prevHoldRequestId) {
        const reqIndex = requests.findIndex((r) => r.id === prevHoldRequestId);
        if (reqIndex !== -1 && requests[reqIndex].status === REQUEST_STATUS.PAYMENT_PENDING) {
          requests[reqIndex].status = REQUEST_STATUS.CANCELLED;
          requests[reqIndex].cancelledAt = new Date().toISOString();
          requests[reqIndex].history = [
            ...(requests[reqIndex].history || []),
            {
              status: REQUEST_STATUS.CANCELLED,
              timestamp: new Date().toISOString(),
              note: '24 soat ichida toʻlov amalga oshirilmagani sababli zayavka avtomatik bekor qilindi'
            }
          ];
          requestsUpdated = true;

          addNotification({
            userId: requests[reqIndex].tenantId,
            title: 'Zayavka muddati tugadi',
            message: `"${item.title}" uyi uchun 24 soat ichida toʻlov qilinmagani sababli hold bekor qilindi.`,
            type: 'warning',
            link: `/listings/${item.id}`
          });
        }
      }
    }

    // 2. RESERVED/HANDED_OVER shartnoma muddati tugagan (48 soat ichida imzolanmasa auto-refund)
    if (
      (item.status === LISTING_STATUS.RESERVED || item.status === LISTING_STATUS.HANDED_OVER) &&
      item.contractExpiresAt &&
      new Date(item.contractExpiresAt).getTime() < now
    ) {
      const prevReqId = item.reservedByRequestId;
      item.status = LISTING_STATUS.ACTIVE;
      delete item.contractExpiresAt;
      delete item.reservedByUserId;
      delete item.reservedByRequestId;
      listingsUpdated = true;

      addAuditLog({
        entityType: 'LISTING',
        entityId: item.id,
        action: 'CONTRACT_TIMEOUT_REFUND_TO_ACTIVE',
        fromStatus: item.status,
        toStatus: LISTING_STATUS.ACTIVE,
        details: '48 soat ichida shartnoma imzolanmagani sababli 30$ qaytarildi va eʼlon aktiv qilindi'
      });

      if (prevReqId) {
        const reqIndex = requests.findIndex((r) => r.id === prevReqId);
        if (reqIndex !== -1) {
          requests[reqIndex].status = REQUEST_STATUS.REFUNDED;
          requests[reqIndex].refundedAt = new Date().toISOString();
          requests[reqIndex].history = [
            ...(requests[reqIndex].history || []),
            {
              status: REQUEST_STATUS.REFUNDED,
              timestamp: new Date().toISOString(),
              note: '48 soat ichida shartnoma tuzilmagani sababli $30 Escrow toʻlovi toʻliq qaytarildi'
            }
          ];
          requestsUpdated = true;

          addNotification({
            userId: requests[reqIndex].tenantId,
            title: '30$ Escrow qaytarildi',
            message: `"${item.title}" uyi uchun shartnoma muddati oʻtgani sababli toʻlovingiz qaytarildi.`,
            type: 'info',
            link: `/requests`
          });
        }
      }
    }
  }

  if (listingsUpdated) setToStorage(STORAGE_KEYS.LISTINGS, listings);
  if (requestsUpdated) setToStorage(STORAGE_KEYS.REQUESTS, requests);
};

/**
 * E'lonlar ro'yxatini olish (faqat ACTIVE ko'rsatiladi)
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export const getListings = async (filters = {}) => {
  await delay(200);
  await checkListingHoldExpirations();

  let list = getFromStorage(STORAGE_KEYS.LISTINGS, []);

  // Qoida 2: To'lov o'tgach e'lon umumiy qidiruv, bosh sahifa, tavsiyalar, xarita va
  // sevimlilar ro'yxatidan darhol yo'qolsin (faqat ACTIVE e'lonlar ko'rsatiladi).
  if (!filters.includeAllStatus) {
    list = list.filter((item) => {
      if (item.status !== LISTING_STATUS.ACTIVE) return false;
      // Xona-xona holatida: agar barcha xonalar band bo'lsa, ro'yxatdan yashiriladi
      if (item.rentMode === 'ROOM' && item.roomsData?.length > 0) {
        const availableRooms = item.roomsData.filter((r) => !r.status || r.status === 'ACTIVE');
        if (availableRooms.length === 0) return false;
      }
      return true;
    });
  }

  if (filters.type) {
    list = list.filter((item) => item.type === filters.type);
  }

  if (filters.rentMode) {
    list = list.filter((item) => item.rentMode === filters.rentMode);
  }

  if (filters.region) {
    list = list.filter((item) => item.region === filters.region);
  }

  if (filters.district) {
    list = list.filter((item) => item.district === filters.district);
  }

  if (filters.roomsCount) {
    const r = parseInt(filters.roomsCount, 10);
    list = list.filter((item) => (r >= 4 ? item.roomsCount >= 4 : item.roomsCount === r));
  }

  if (filters.maxPrice) {
    list = list.filter((item) => item.price <= filters.maxPrice);
  }

  if (filters.minPrice) {
    list = list.filter((item) => item.price >= filters.minPrice);
  }

  if (filters.ownerId) {
    list = list.filter((item) => item.ownerId === filters.ownerId);
  }

  return list;
};

/**
 * Foydalanuvchining o'z e'lonlarini olish (barcha statuslar bilan)
 * @param {string} ownerId
 * @returns {Promise<Array>}
 */
export const getMyListings = async (ownerId) => {
  return getListings({ ownerId, includeAllStatus: true });
};

/**
 * ID bo'yicha e'lonni olish
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getListingById = async (id) => {
  await delay(150);
  await checkListingHoldExpirations();

  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const item = list.find((l) => l.id === id);

  if (!item) return null;

  const owner = users.find((u) => u.id === item.ownerId) || {
    id: item.ownerId,
    firstName: 'Egasi',
    lastName: '',
    rating: 4.8,
    verificationStatus: 'VERIFIED',
    dealsCount: 5
  };

  return { ...item, owner };
};

/**
 * E'lon holatini o'zgartirish (Atomik holat mashinasi)
 * Faqat ALLOWED_LISTING_TRANSITIONS dagi ruxsat etilgan o'tishlar ishlaydi.
 */
export const transitionListingStatus = async (listingId, newStatus, reason = '', extra = {}) => {
  await delay(200);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const index = listings.findIndex((l) => l.id === listingId);

  if (index === -1) {
    throw new Error('Eʼlon topilmadi');
  }

  const current = listings[index];

  // Ruxsat tekshiruvi
  const allowed = ALLOWED_LISTING_TRANSITIONS[current.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Ruxsat berilmagan holat oʻtishi: ${current.status} → ${newStatus}`);
  }

  const oldStatus = current.status;
  const updated = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...extra
  };

  // Agar yangi holat HOLD bo'lsa (24 soatlik taymer)
  if (newStatus === LISTING_STATUS.HOLD) {
    updated.holdExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  }

  // Agar yangi holat RESERVED bo'lsa (48 soatlik shartnoma taymeri)
  if (newStatus === LISTING_STATUS.RESERVED) {
    delete updated.holdExpiresAt;
    updated.reservedAt = new Date().toISOString();
    updated.contractExpiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  }

  // Agar ACTIVE ga qaytsa, taymerlarni tozalash
  if (newStatus === LISTING_STATUS.ACTIVE) {
    delete updated.holdExpiresAt;
    delete updated.holdByUserId;
    delete updated.holdByRequestId;
    delete updated.contractExpiresAt;
    delete updated.reservedByUserId;
    delete updated.reservedByRequestId;
  }

  // Agar xona-xona bo'lsa va muayyan xona ko'rsatilgan bo'lsa
  if (extra.roomId && updated.roomsData?.length > 0) {
    updated.roomsData = updated.roomsData.map((room) => {
      if (room.id === extra.roomId) {
        return { ...room, status: newStatus };
      }
      return room;
    });

    // Agar barcha xonalar band bo'lsa, butun e'lon RESERVED bo'ladi
    const allBusy = updated.roomsData.every((r) => r.status === LISTING_STATUS.RESERVED || r.status === LISTING_STATUS.RENTED);
    if (allBusy && newStatus === LISTING_STATUS.RESERVED) {
      updated.status = LISTING_STATUS.RESERVED;
    }
  }

  listings[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, listings);

  // Audit log yozish
  addAuditLog({
    entityType: 'LISTING',
    entityId: listingId,
    action: `TRANSITION_${oldStatus}_TO_${newStatus}`,
    fromStatus: oldStatus,
    toStatus: newStatus,
    performedBy: extra.performedBy || 'SYSTEM',
    details: reason || `Eʼlon holati ${oldStatus} dan ${newStatus} ga oʻtkazildi`
  });

  return updated;
};

/**
 * Band qilingan uy o'rniga tavsiya etiladigan o'xshash aktiv e'lonlar
 */
export const getSimilarActiveListings = async (currentListingId, region, limit = 3) => {
  await delay(150);
  const activeListings = await getListings();
  return activeListings
    .filter((l) => l.id !== currentListingId && (l.region === region || l.status === LISTING_STATUS.ACTIVE))
    .slice(0, limit);
};

/**
 * Yangi e'lon qo'shish
 */
export const createListing = async (listingData, ownerId) => {
  await delay(350);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);

  const newListing = {
    id: 'list_' + Date.now(),
    ownerId: ownerId || 'user_owner_1',
    status: LISTING_STATUS.PENDING_MODERATION,
    createdAt: new Date().toISOString(),
    ...listingData
  };

  list.unshift(newListing);
  setToStorage(STORAGE_KEYS.LISTINGS, list);

  addAuditLog({
    entityType: 'LISTING',
    entityId: newListing.id,
    action: 'CREATE_LISTING',
    fromStatus: null,
    toStatus: LISTING_STATUS.PENDING_MODERATION,
    performedBy: ownerId,
    details: 'Yangi eʼlon yaratildi va moderatsiyaga yuborildi'
  });

  return newListing;
};

/**
 * E'lonni tahrirlash
 */
export const updateListing = async (id, patch) => {
  await delay(200);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const index = list.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Listing not found');

  list[index] = { ...list[index], ...patch, updatedAt: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return list[index];
};

/**
 * E'lonni o'chirish / arxivlash
 */
export const deleteListing = async (id) => {
  await delay(200);
  return transitionListingStatus(id, LISTING_STATUS.ARCHIVED, 'Egasi tomonidan arxivlandi');
};

/**
 * Sevimlilar boshqaruvi
 */
export const getFavorites = async () => {
  await delay(100);
  return getFromStorage(STORAGE_KEYS.FAVORITES, []);
};

export const toggleFavorite = async (listingId) => {
  await delay(100);
  const favs = getFromStorage(STORAGE_KEYS.FAVORITES, []);
  const exists = favs.includes(listingId);
  const updated = exists ? favs.filter((id) => id !== listingId) : [...favs, listingId];
  setToStorage(STORAGE_KEYS.FAVORITES, updated);
  return updated;
};

/**
 * Moslik foizini hisoblash (Matching algorithm)
 */
export const calculateMatchScore = (listing, criteria) => {
  let totalPoints = 0;
  let earnedPoints = 0;

  if (criteria.purpose) {
    totalPoints += 25;
    if (listing.type === criteria.purpose) earnedPoints += 25;
  }

  if (criteria.region) {
    totalPoints += 20;
    if (listing.region === criteria.region) earnedPoints += 20;
  }

  if (criteria.district) {
    totalPoints += 15;
    if (listing.district === criteria.district) earnedPoints += 15;
  }

  if (criteria.roomsCount) {
    totalPoints += 15;
    const r = parseInt(criteria.roomsCount, 10);
    if (r >= 4 ? listing.roomsCount >= 4 : listing.roomsCount === r) {
      earnedPoints += 15;
    }
  }

  if (criteria.maxPrice) {
    totalPoints += 15;
    if (listing.price <= criteria.maxPrice) earnedPoints += 15;
  }

  if (criteria.condition) {
    totalPoints += 10;
    if (listing.condition === criteria.condition) earnedPoints += 10;
  }

  if (totalPoints === 0) return 100;
  return Math.round((earnedPoints / totalPoints) * 100);
};

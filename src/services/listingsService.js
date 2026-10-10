import { delay, getFromStorage, setToStorage, STORAGE_KEYS } from './storage';

/**
 * E'lonlar ro'yxatini olish (filterlar bilan)
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export const getListings = async (filters = {}) => {
  await delay(250);
  let list = getFromStorage(STORAGE_KEYS.LISTINGS, []);

  // Faqat aktivlarini ko'rsatish (agar admin bo'lmasa)
  if (!filters.includeAllStatus) {
    list = list.filter((item) => item.status === 'ACTIVE');
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

  return list;
};

/**
 * ID bo'yicha e'lonni olish
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getListingById = async (id) => {
  await delay(200);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const item = list.find((l) => l.id === id);

  if (!item) return null;

  // Egasi haqidagi ma'lumotni bog'lash
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
 * Yangi e'lon qo'shish (Wizard orqali, PENDING_MODERATION ga tushadi)
 * @param {Object} listingData
 * @param {string} ownerId
 * @returns {Promise<Object>}
 */
export const createListing = async (listingData, ownerId) => {
  await delay(500);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);

  const newListing = {
    id: 'list_' + Date.now(),
    ownerId: ownerId || 'user_owner_1',
    status: 'PENDING_MODERATION', // Admin tasdiqlashi kerak
    createdAt: new Date().toISOString(),
    ...listingData
  };

  list.unshift(newListing);
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return newListing;
};

/**
 * E'lonni tahrirlash
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateListing = async (id, updates) => {
  await delay(350);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const index = list.findIndex((l) => l.id === id);

  if (index === -1) throw new Error('Listing not found');

  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return list[index];
};

/**
 * E'lonni o'chirish
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export const deleteListing = async (id) => {
  await delay(300);
  let list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  list = list.filter((l) => l.id !== id);
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return true;
};

/**
 * Foydalanuvchining o'z e'lonlarini olish
 * @param {string} ownerId
 * @returns {Promise<Array>}
 */
export const getMyListings = async (ownerId) => {
  await delay(250);
  const list = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  return list.filter((l) => l.ownerId === ownerId);
};

/**
 * Sevimlilar bilan ishlash
 */
export const getFavorites = async () => {
  await delay(100);
  return getFromStorage(STORAGE_KEYS.FAVORITES, []);
};

export const toggleFavorite = async (listingId) => {
  await delay(150);
  let favs = getFromStorage(STORAGE_KEYS.FAVORITES, []);
  if (favs.includes(listingId)) {
    favs = favs.filter((id) => id !== listingId);
  } else {
    favs.push(listingId);
  }
  setToStorage(STORAGE_KEYS.FAVORITES, favs);
  return favs;
};

/**
 * Kichik so'rovnoma mezonlari asosida mos kelish foizi (Match Score %) hisoblash
 * @param {Object} listing
 * @param {Object} quizCriteria
 * @returns {number} 0..100 foiz
 */
export const calculateMatchScore = (listing, quizCriteria) => {
  if (!quizCriteria || Object.keys(quizCriteria).length === 0) return 100;

  let totalWeight = 0;
  let earnedWeight = 0;

  // 1. Maqsad (Ijara / Sotuv) - 25 ball
  if (quizCriteria.purpose) {
    totalWeight += 25;
    if (listing.type === quizCriteria.purpose) earnedWeight += 25;
  }

  // 2. Berish usuli (Butun uy / Xona-xona) - 20 ball
  if (quizCriteria.rentMode && listing.type === 'RENT') {
    totalWeight += 20;
    if (listing.rentMode === quizCriteria.rentMode) earnedWeight += 20;
  }

  // 3. Viloyat / Hudud - 20 ball
  if (quizCriteria.region) {
    totalWeight += 20;
    if (listing.region === quizCriteria.region) earnedWeight += 20;
  }

  // 4. Xonalar soni - 15 ball
  if (quizCriteria.roomsCount) {
    totalWeight += 15;
    const reqRooms = parseInt(quizCriteria.roomsCount, 10);
    if (reqRooms >= 4 ? listing.roomsCount >= 4 : listing.roomsCount === reqRooms) {
      earnedWeight += 15;
    }
  }

  // 5. Narx oralig'i - 10 ball
  if (quizCriteria.maxPrice) {
    totalWeight += 10;
    if (listing.price <= quizCriteria.maxPrice) earnedWeight += 10;
  }

  // 6. Jihozlanish darajasi (condition) - 10 ball
  if (quizCriteria.condition) {
    totalWeight += 10;
    if (listing.condition === quizCriteria.condition) earnedWeight += 10;
  }

  if (totalWeight === 0) return 95;
  return Math.round((earnedWeight / totalWeight) * 100);
};

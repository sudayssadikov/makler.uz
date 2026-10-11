import { delay, getFromStorage, setToStorage, STORAGE_KEYS } from './storage';
import { REQUEST_STATUS } from '../constants/requestStatus';
import { transitionRequestStatus } from './requestsService';
import { LISTING_STATUS } from '../constants/listingStatus';

/**
 * Zayavka va e'lon asosida avtomatik shartnoma loyihasi generatsiya qilish
 * @param {Object} request
 * @returns {Promise<Object>}
 */
export const generateContractFromRequest = async (request) => {
  await delay(400);
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);

  const listing = listings.find((l) => l.id === request.listingId);
  const landlord = users.find((u) => u.id === request.ownerId);
  const tenant = users.find((u) => u.id === request.tenantId);

  const isPostPay = listing?.paymentTerm === 'POSTPAY';
  const deposit = listing?.deposit || (isPostPay ? listing.price : 0);

  const newContract = {
    id: 'contract_' + Date.now(),
    requestId: request.id,
    listingId: listing?.id,
    landlordId: landlord?.id,
    tenantId: tenant?.id,
    landlordName: `${landlord?.firstName || ''} ${landlord?.lastName || ''}`.trim() || 'Ijaraga beruvchi',
    tenantName: `${tenant?.firstName || ''} ${tenant?.lastName || ''}`.trim() || 'Ijarachi',
    landlordPinfl: landlord?.pinfl || '32508924560098',
    tenantPinfl: tenant?.pinfl || '51402017890067',
    propertyAddress: listing?.address || 'Toshkent shahri',
    monthlyPrice: listing?.price || 500,
    depositAmount: deposit,
    isPostPayDepositRequired: isPostPay,
    minRentalMonths: listing?.minRentalPeriodMonths || 6,
    penaltyEarlyExit: '1 oylik toʻlov miqdorida jarima',
    rules: listing?.rules?.join(', ') || 'Uyda tartib va ozodalik saqlash shart.',
    inventoryAct: [
      {
        id: 'inv_1',
        item: 'Mebel va yotoq jihozlari',
        condition: 'Yangi, butun holatda',
        photo: listing?.coverImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'inv_2',
        item: 'Maishiy texnikalar (Konditsioner, muzlatgich)',
        condition: 'Toʻliq ishchi holatda, nosozlik yoʻq',
        photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
      }
    ],
    landlordSigned: false,
    landlordSignedAt: null,
    tenantSigned: false,
    tenantSignedAt: null,
    status: 'DRAFT', // 'DRAFT' | 'SIGNED' | 'COMPLETED' | 'DISPUTED'
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  contracts.unshift(newContract);
  setToStorage(STORAGE_KEYS.CONTRACTS, contracts);

  // Zayavka holatini CONTRACT_DRAFTING ga o'tkazish
  try {
    await transitionRequestStatus(request.id, REQUEST_STATUS.CONTRACT_DRAFTING, 'Shartnoma loyihasi generatsiya qilindi');
  } catch {
    // Already in that state or compatible
  }

  return newContract;
};

/**
 * Shartnomani ID orqali olish
 * @param {string} contractId
 * @returns {Promise<Object|null>}
 */
export const getContractById = async (contractId) => {
  await delay(200);
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
  return contracts.find((c) => c.id === contractId) || null;
};

/**
 * Shartnomani SMS OTP orqali imzolash
 * @param {string} contractId
 * @param {'landlord'|'tenant'} party
 * @param {string} otpCode
 * @returns {Promise<Object>}
 */
export const signContractWithOtp = async (contractId, party, otpCode) => {
  await delay(500);
  const cleanOtp = String(otpCode || '').replace(/\D/g, '');
  if (cleanOtp.length !== 6) {
    throw new Error('SMS kod 6 xonali boʻlishi shart');
  }
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
  const idx = contracts.findIndex((c) => c.id === contractId);

  if (idx === -1) throw new Error('Contract not found');

  const contract = contracts[idx];

  if (party === 'landlord') {
    contract.landlordSigned = true;
    contract.landlordSignedAt = new Date().toISOString();
  } else {
    contract.tenantSigned = true;
    contract.tenantSignedAt = new Date().toISOString();
  }

  // Agar ikkala tomon ham imzolasa, shartnoma rasmiy ACTIVE holatiga o'tadi
  if (contract.landlordSigned && contract.tenantSigned) {
    contract.status = 'SIGNED';
    try {
      await transitionRequestStatus(
        contract.requestId,
        REQUEST_STATUS.SIGNED,
        'Shartnoma ikkala tomon tomonidan SMS OTP kod orqali rasman imzolandi'
      );
    } catch (e) {
      console.warn('Transition warning:', e.message);
    }
  }

  contracts[idx] = contract;
  setToStorage(STORAGE_KEYS.CONTRACTS, contracts);
  return contract;
};

/**
 * Uy holati aktiga yangi inventar qo'shish
 * @param {string} contractId
 * @param {Object} itemData
 * @returns {Promise<Object>}
 */
export const addInventoryItem = async (contractId, itemData) => {
  await delay(300);
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
  const idx = contracts.findIndex((c) => c.id === contractId);

  if (idx === -1) throw new Error('Contract not found');

  const contract = contracts[idx];
  contract.inventoryAct = contract.inventoryAct || [];
  contract.inventoryAct.push({
    id: 'inv_' + Date.now(),
    ...itemData
  });

  contracts[idx] = contract;
  setToStorage(STORAGE_KEYS.CONTRACTS, contracts);
  return contract;
};

/**
 * Ko'chib kirishni tasdiqlash
 * @param {string} contractId
 * @returns {Promise<Object>}
 */
export const confirmMoveIn = async (contractId) => {
  await delay(400);
  const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
  const idx = contracts.findIndex((c) => c.id === contractId);
  if (idx === -1) throw new Error('Contract not found');

  const contract = contracts[idx];
  contract.moveInConfirmed = true;
  contracts[idx] = contract;
  setToStorage(STORAGE_KEYS.CONTRACTS, contracts);

  await transitionRequestStatus(
    contract.requestId,
    REQUEST_STATUS.MOVE_IN_CONFIRMED,
    'Ijarachi uyga muvaffaqiyatli koʻchib kirdi va inventar aktini tasdiqladi'
  );

  // Listingni HANDED_OVER dan RENTED yoki SOLD ga o'tkazish
  try {
    // listingsService bilan contractsService o'zaro (circular) bog'langan,
    // shuning uchun faqat shu funksiya dinamik import qilinadi.
    const { transitionListingStatus, getListingById } = await import('./listingsService');
    const listing = await getListingById(contract.listingId);
    const finalStatus = listing?.type === 'SALE' ? LISTING_STATUS.SOLD : LISTING_STATUS.RENTED;
    await transitionListingStatus(
      contract.listingId,
      finalStatus,
      'Shartnoma imzolanib, koʻchib kirish toʻliq tasdiqlandi'
    );
  } catch (err) {
    console.warn('Listing status transition to RENTED/SOLD warning:', err.message);
  }

  return contract;
};

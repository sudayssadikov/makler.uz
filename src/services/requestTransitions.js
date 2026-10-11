import { delay, getFromStorage, setToStorage, STORAGE_KEYS, addAuditLog, addNotification } from './storage';
import { REQUEST_STATUS, ALLOWED_TRANSITIONS } from '../constants/requestStatus';
import { LISTING_STATUS } from '../constants/listingStatus';
import { transitionListingStatus } from './listingsService';

/**
 * Zayavka statusini yangilash (holat mashinasi yadrosi).
 * Alohida modulda saqlanadi: contractsService bu funksiyani static import
 * qiladi, requestsService esa o'z navbatida contractsService'dan
 * generateContractDraft'ni static import qiladi — tsikllanish bo'lmasligi uchun.
 */
export const transitionRequestStatus = async (id, newStatus, note = '', extraData = {}) => {
  await delay(250);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const index = requests.findIndex((r) => r.id === id);

  if (index === -1) throw new Error('Zayavka topilmadi');

  const current = requests[index];

  const allowed = ALLOWED_TRANSITIONS[current.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Ruxsat etilmagan oʻtish: ${current.status} → ${newStatus}`);
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

  // Ega zayavkani qabul qilganda (ACCEPTED):
  // 1. Zayavka PAYMENT_PENDING ga o'tadi
  // 2. Qoida: ACTIVE → HOLD: ega zayavkani qabul qilganda, uy 24 soatga HOLD bo'ladi!
  if (newStatus === REQUEST_STATUS.ACCEPTED) {
    updated.status = REQUEST_STATUS.PAYMENT_PENDING;
    updated.expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    try {
      await transitionListingStatus(
        current.listingId,
        LISTING_STATUS.HOLD,
        'Ega zayavkani qabul qildi, toʻlov kutilmoqda (24 soat hold)',
        {
          holdByUserId: current.tenantId,
          holdByRequestId: current.id,
          roomId: current.roomId
        }
      );
    } catch (e) {
      console.warn('Listing status transition to HOLD note:', e.message);
    }

    addNotification({
      userId: current.tenantId,
      title: 'Zayavka qabul qilindi!',
      message: 'Mulk egasi zayavkani maʼqulladi. Uy siz uchun 24 soatga band qilindi. 30$ Escrow toʻlovini amalga oshiring.',
      type: 'success',
      link: `/requests`
    });
  }

  // Agar bekor qilinsa: HOLD holatidagi uy yana ACTIVE ga qaytadi
  if (newStatus === REQUEST_STATUS.CANCELLED || newStatus === REQUEST_STATUS.REJECTED) {
    const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
    const listing = listings.find((l) => l.id === current.listingId);
    if (listing && (listing.status === LISTING_STATUS.HOLD && listing.holdByRequestId === current.id)) {
      try {
        await transitionListingStatus(
          listing.id,
          LISTING_STATUS.ACTIVE,
          'Zayavka bekor qilingani sababli hold olib tashlandi',
          { roomId: current.roomId }
        );
      } catch (err) {
        console.warn('Listing rollback note:', err.message);
      }
    }
  }

  requests[index] = updated;
  setToStorage(STORAGE_KEYS.REQUESTS, requests);

  addAuditLog({
    entityType: 'REQUEST',
    entityId: id,
    action: `TRANSITION_${current.status}_TO_${newStatus}`,
    fromStatus: current.status,
    toStatus: newStatus,
    details: note
  });

  return updated;
};

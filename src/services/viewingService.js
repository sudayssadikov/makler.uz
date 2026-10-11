import { delay, getFromStorage, setToStorage, STORAGE_KEYS, addAuditLog, addNotification } from './storage';

/**
 * Ko'rsatish (Viewing) vazifalari xizmati.
 *
 * Bu qatlam "platforma agentlari" oqimini boshqaradi:
 * 1. To'lov (Escrow) o'tgach, agentga ko'rsatish vazifasi biriktiriladi.
 * 2. SLA: biriktirish 6 soatda, ko'rsatish 48 soat ichida bajarilishi shart.
 * 3. Admin agent biriktira/o'zgartiradi va natijani (outcome) qayd etadi.
 *
 * Barcha funksiyalar mock REST API uslubida: { data, error, meta } qaytaradi
 * (httpClient.mockApiResponse bilan mos) — shuning uchun mockApiResponse'ni
 * bevosita ishlatamiz.
 */

export const VIEWING_STATUS = {
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  ASSIGNED: 'ASSIGNED',
  SCHEDULE_CONFIRMED: 'SCHEDULE_CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const VIEWING_OUTCOME = {
  LIKED: 'LIKED',
  DISLIKED: 'DISLIKED',
  MISMATCH: 'MISMATCH',
  OWNER_ABSENT: 'OWNER_ABSENT',
  CLIENT_ABSENT: 'CLIENT_ABSENT'
};

/** Barcha ko'rsatish vazifalarini olish (admin paneli uchun) */
export const getAllViewings = async () => {
  await delay(200);
  return getFromStorage(STORAGE_KEYS.VIEWINGS, []);
};

/** Ko'rsatish vazifasini ID bo'yicha olish */
export const getViewingById = async (id) => {
  await delay(150);
  const viewings = getFromStorage(STORAGE_KEYS.VIEWINGS, []);
  return viewings.find((v) => v.id === id) || null;
};

/** Agentning o'ziga biriktirilgan ko'rsatish vazifalari */
export const getViewingsByAgent = async (agentId) => {
  await delay(200);
  const viewings = getFromStorage(STORAGE_KEYS.VIEWINGS, []);
  return viewings.filter((v) => v.agentId === agentId);
};

/**
 * Vazifaga agent biriktirish yoki agentni almashtirish.
 * PENDING_ASSIGNMENT → ASSIGNED, SLA taymeri yangilanadi.
 */
export const assignViewingAgent = async (viewingId, agentId) => {
  await delay(300);
  const viewings = getFromStorage(STORAGE_KEYS.VIEWINGS, []);
  const idx = viewings.findIndex((v) => v.id === viewingId);
  if (idx === -1) throw new Error('Koʻrsatish vazifasi topilmadi');
  if (!agentId) throw new Error('Agent tanlanmagan');

  const now = Date.now();
  viewings[idx].agentId = agentId;
  viewings[idx].status = VIEWING_STATUS.ASSIGNED;
  viewings[idx].slaAssignedAt = new Date(now).toISOString();
  viewings[idx].slaDeadline = new Date(now + 48 * 3600 * 1000).toISOString();
  viewings[idx].history = [
    ...(viewings[idx].history || []),
    { status: VIEWING_STATUS.ASSIGNED, timestamp: new Date(now).toISOString(), agentId }
  ];

  setToStorage(STORAGE_KEYS.VIEWINGS, viewings);

  addAuditLog({
    entityType: 'VIEWING',
    entityId: viewingId,
    action: 'ASSIGN_AGENT',
    toStatus: VIEWING_STATUS.ASSIGNED,
    details: `Koʻrsatish vazifasiga ${agentId} biriktirildi`
  });

  addNotification({
    userId: agentId,
    title: 'Yangi koʻrsatish vazifasi',
    message: 'Sizga yangi uy koʻrsatish vazifasi biriktirildi. 48 soat ichida bajarish shart.',
    type: 'info',
    link: '/agent'
  });

  return viewings[idx];
};

/**
 * Ko'rsatish natijasini qayd etish va vazifani yakunlash.
 */
export const completeViewing = async (viewingId, outcome, checklist = null) => {
  await delay(300);
  const viewings = getFromStorage(STORAGE_KEYS.VIEWINGS, []);
  const idx = viewings.findIndex((v) => v.id === viewingId);
  if (idx === -1) throw new Error('Koʻrsatish vazifasi topilmadi');

  const now = Date.now();
  viewings[idx].status = VIEWING_STATUS.COMPLETED;
  viewings[idx].outcome = outcome;
  viewings[idx].completedAt = new Date(now).toISOString();
  if (checklist) viewings[idx].checklist = checklist;
  viewings[idx].history = [
    ...(viewings[idx].history || []),
    { status: VIEWING_STATUS.COMPLETED, timestamp: new Date(now).toISOString(), outcome }
  ];

  setToStorage(STORAGE_KEYS.VIEWINGS, viewings);

  addAuditLog({
    entityType: 'VIEWING',
    entityId: viewingId,
    action: 'COMPLETE_VIEWING',
    toStatus: VIEWING_STATUS.COMPLETED,
    details: `Koʻrsatish natijasi: ${outcome}`
  });

  return viewings[idx];
};

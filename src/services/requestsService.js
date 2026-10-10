import { delay, getFromStorage, setToStorage, STORAGE_KEYS, addAuditLog, addNotification } from './storage';
import { REQUEST_STATUS, ALLOWED_TRANSITIONS } from '../constants/requestStatus';
import { LISTING_STATUS } from '../constants/listingStatus';
import { transitionListingStatus, checkListingHoldExpirations } from './listingsService';

/**
 * Zayavka yuborish
 * Qoida 1: Agar uy HOLD yoki RESERVED bo'lsa, yangi zayavka bloklanadi
 */
export const createRequest = async (listingId, tenantId, ownerId, notes = '', roomId = null) => {
  await delay(300);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);

  const listing = listings.find((l) => l.id === listingId);
  if (!listing) throw new Error('Eʼlon topilmadi');

  // Tekshirish: butun uy yoki muayyan xona band emasmi
  if (listing.status === LISTING_STATUS.HOLD) {
    throw new Error('Hozirda bu uy boshqa foydalanuvchi tomonidan band qilinmoqda');
  }
  if (listing.status === LISTING_STATUS.RESERVED || listing.status === LISTING_STATUS.HANDED_OVER || listing.status === LISTING_STATUS.RENTED || listing.status === LISTING_STATUS.SOLD) {
    throw new Error('Bu uy allaqachon band qilingan yoki ijaraga berilgan');
  }

  // Xona-xona tekshiruvi
  if (roomId && listing.roomsData?.length > 0) {
    const targetRoom = listing.roomsData.find((r) => r.id === roomId);
    if (targetRoom && targetRoom.status && targetRoom.status !== 'ACTIVE') {
      throw new Error('Tanlangan xona allaqachon band qilingan');
    }
  }

  const newRequest = {
    id: 'req_' + Date.now(),
    listingId,
    roomId,
    tenantId,
    ownerId,
    notes,
    status: REQUEST_STATUS.SUBMITTED,
    escrowAmount: 0,
    escrowCurrency: 'USD',
    isPaymentConfirmed: false,
    contactsUnlocked: false,
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

  addAuditLog({
    entityType: 'REQUEST',
    entityId: newRequest.id,
    action: 'CREATE_REQUEST',
    fromStatus: null,
    toStatus: REQUEST_STATUS.SUBMITTED,
    performedBy: tenantId,
    details: `"${listing.title}" uyi uchun yangi zayavka yuborildi`
  });

  addNotification({
    userId: ownerId,
    title: 'Yangi zayavka qabul qilindi',
    message: `"${listing.title}" eʼloningizga yangi ijara zayavkasi keldi.`,
    type: 'info',
    link: `/requests`
  });

  return newRequest;
};

/**
 * Barcha zayavkalarni olish
 */
export const getRequests = async (userId) => {
  await delay(200);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const users = getFromStorage(STORAGE_KEYS.USERS, []);

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
 * 48 soatlik kafolat: muddati o'tgan to'lov/shartnoma taymerlarini tekshirib,
 * muddati tugagan zayavkalarni avtomatik REFUNDED (qaytarish) holatiga o'tkazadi.
 *
 * Qoidalar:
 * 1. PAYMENT_PENDING: 24 soat HOLD ichida 30$ to'lanmasa — HOLD olib tashlanadi,
 *    uy qayta ACTIVE bo'ladi va zayavka REFUNDED (pul yo'q, lekin hold bekor).
 * 2. PAID_ESCROW / CONTRACT_DRAFTING: 48 soat ichida shartnoma imzolanmasa —
 *    30$ Escrow to'liq qaytariladi (REFUNDED) va uy ACTIVE bo'ladi.
 *
 * Sahifa ochilganda idempotent chaqiriladi — sahifada "avtomatik bekor bo'ldi"
 * ogohlantirishi chiqadi.
 * @returns {Promise<Array>} Muddati o'tib qaytarilgan zayavkalar ro'yxati
 */
export const checkExpiredPayments = async () => {
  await delay(150);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const now = Date.now();
  const expired = [];

  for (let i = 0; i < requests.length; i += 1) {
    const req = requests[i];
    // To'lov bosqichi 24 soatlik `expiresAt`, shartnoma bosqichi 48 soatlik
    // `contractExpiresAt` ishlatadi — ikkalasini ham hisobga olamiz.
    const deadline = req.expiresAt || req.contractExpiresAt;
    if (!deadline) continue;
    const deadlineMs = new Date(deadline).getTime();

    const isPaymentExpired = req.status === REQUEST_STATUS.PAYMENT_PENDING && deadlineMs < now;
    const isContractExpired =
      (req.status === REQUEST_STATUS.PAID_ESCROW || req.status === REQUEST_STATUS.CONTRACT_DRAFTING) &&
      deadlineMs < now;

    if (!isPaymentExpired && !isContractExpired) continue;

    // Qaytarish kafolati: $30 Escrow puli qaytariladi va zayavka yopiladi.
    requests[i] = {
      ...req,
      status: REQUEST_STATUS.REFUNDED,
      refundedAt: new Date().toISOString(),
      history: [
        ...(req.history || []),
        {
          status: REQUEST_STATUS.REFUNDED,
          timestamp: new Date().toISOString(),
          note: isPaymentExpired
            ? '24 soat ichida toʻlov amalga oshirilmagani sababli zayavka avtomatik bekor qilindi'
            : '48 soatlik kafolat: shartnoma imzolanmagani sababli 30$ Escrow toʻlovi toʻliq qaytarildi'
        }
      ]
    };

    expired.push(requests[i]);

    addNotification({
      userId: req.tenantId,
      title: isPaymentExpired ? 'Zayavka muddati tugadi' : '30$ kafolat bilan qaytarildi',
      message: isPaymentExpired
        ? '24 soat ichida toʻlov qilinmagani sababli zayavka bekor qilindi.'
        : '48 soatlik kafolat muddati tugadi. 30$ Escrow toʻlovingiz toʻliq qaytarildi.',
      type: 'warning',
      link: '/requests'
    });

    addAuditLog({
      entityType: 'REQUEST',
      entityId: req.id,
      action: isPaymentExpired ? 'AUTO_CANCEL_PAYMENT_EXPIRED' : 'AUTO_REFUND_48H_GUARANTEE',
      fromStatus: req.status,
      toStatus: REQUEST_STATUS.REFUNDED,
      details: isPaymentExpired ? '24 soat HOLD muddati o\'tdi' : '48 soatlik kafolat muddati o\'tdi, $30 qaytarildi'
    });
  }

  if (expired.length > 0) {
    setToStorage(STORAGE_KEYS.REQUESTS, requests);
    // Boshqa oynalarda ham hold holati to'g'ri ko'rinishi uchun listing holatini tiklaymiz
    await checkListingHoldExpirations();
  }

  return expired;
};

export const getRequestById = async (id) => {
  await delay(150);
  const list = await getRequests();
  return list.find((r) => r.id === id) || null;
};

/**
 * Zayavka statusini yangilash
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

/**
 * 30$ Escrow to'lovi va Race Condition tekshiruvi
 * QOIDALAR:
 * 1. HOLD paytida faqat qabul qilingan zayavka egasi to'lov qila oladi.
 * 2. Race condition: agar uy allaqachon RESERVED bo'lsa, xato beradi va to'lov bekor qilinadi.
 * 3. To'lov o'tgach, uy darhol RESERVED bo'ladi.
 * 4. Shu uyga kelgan boshqa barcha PENDING zayavkalar avtomatik rad etiladi!
 */
export const processEscrowPayment = async (requestId, provider, _cardDetails) => {
  await delay(600);

  // 1. Atomik tekshiruv (storage to'g'ridan-to'g'ri o'qiladi)
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const reqIndex = requests.findIndex((r) => r.id === requestId);
  if (reqIndex === -1) throw new Error('Zayavka topilmadi');

  const req = requests[reqIndex];
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const listingIndex = listings.findIndex((l) => l.id === req.listingId);
  if (listingIndex === -1) throw new Error('Eʼlon topilmadi');

  const listing = listings[listingIndex];

  // Race condition himoyasi:
  if (listing.status === LISTING_STATUS.RESERVED || listing.status === LISTING_STATUS.HANDED_OVER || listing.status === LISTING_STATUS.RENTED || listing.status === LISTING_STATUS.SOLD) {
    throw new Error('Uy allaqachon boshqa foydalanuvchi tomonidan toʻliq band qilingan!');
  }

  if (listing.status === LISTING_STATUS.HOLD && listing.holdByRequestId && listing.holdByRequestId !== req.id) {
    throw new Error('Uy ayni paytda boshqa zayavka uchun hold qilingan!');
  }

  // 2. To'lovni qayd etish
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  // 3. E'lonni RESERVED holatiga o'tkazish
  await transitionListingStatus(
    listing.id,
    LISTING_STATUS.RESERVED,
    `Toʻlov muvaffaqiyatli amalga oshirildi (Tranzaksiya: ${transactionId}). Uy qidiruvdan yashirildi.`,
    {
      reservedByUserId: req.tenantId,
      reservedByRequestId: req.id,
      paymentTransactionId: transactionId,
      isPaymentConfirmed: true,
      roomId: req.roomId
    }
  );

  // 4. Ushbu zayavkani PAID_ESCROW ga o'tkazish
  const updatedReq = await transitionRequestStatus(
    requestId,
    REQUEST_STATUS.PAID_ESCROW,
    `${provider.toUpperCase()} orqali $30 Escrow toʻlandi. Tranzaksiya ID: ${transactionId}`,
    {
      escrowAmount: 30,
      escrowCurrency: 'USD',
      isPaymentConfirmed: true,
      paymentProvider: provider,
      paymentTransactionId: transactionId,
      paidAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString() // 48 soat shartnoma muddati
    }
  );

  // 5. QOIDA 3: Shu uyga kelgan boshqa BARCHA PENDING/SUBMITTED zayavkalarni avtomatik rad etish!
  const currentRequests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  let otherRequestsUpdated = false;

  for (const otherReq of currentRequests) {
    if (
      otherReq.listingId === listing.id &&
      otherReq.id !== req.id &&
      (otherReq.status === REQUEST_STATUS.SUBMITTED || otherReq.status === REQUEST_STATUS.PAYMENT_PENDING)
    ) {
      // Agar xona-xona bo'lsa va boshqa xona bo'lsa, tegmaslik
      if (req.roomId && otherReq.roomId && otherReq.roomId !== req.roomId) {
        continue;
      }

      otherReq.status = REQUEST_STATUS.REJECTED;
      otherReq.rejectedReason = 'Uy boshqa foydalanuvchi tomonidan band qilindi';
      otherReq.history = [
        ...(otherReq.history || []),
        {
          status: REQUEST_STATUS.REJECTED,
          timestamp: new Date().toISOString(),
          note: 'Uy boshqa foydalanuvchi tomonidan toʻliq band qilingani sababli zayavka avtomatik rad etildi'
        }
      ];
      otherRequestsUpdated = true;

      addNotification({
        userId: otherReq.tenantId,
        title: 'Uy band qilindi',
        message: `Siz zayavka yuborgan "${listing.title}" uyi boshqa mijoz tomonidan band qilindi.`,
        type: 'warning',
        link: '/search'
      });

      addAuditLog({
        entityType: 'REQUEST',
        entityId: otherReq.id,
        action: 'AUTO_REJECT_DUE_TO_RESERVATION',
        fromStatus: otherReq.status,
        toStatus: REQUEST_STATUS.REJECTED,
        details: 'Uy boshqa foydalanuvchi tomonidan toʻliq band qilindi'
      });
    }
  }

  if (otherRequestsUpdated) {
    setToStorage(STORAGE_KEYS.REQUESTS, currentRequests);
  }

  return updatedReq;
};

/**
 * Admin "Uyni topshirish" qilishi (RESERVED → HANDED_OVER)
 * Qoida 6: FAQAT to'lov 100% tasdiqlangan bo'lsa ishlaydi!
 * Kontaktlar ochiladi va avtomatik shartnoma yaratiladi.
 */
export const handoverListingByAdmin = async (listingId, adminId) => {
  await delay(350);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const listing = listings.find((l) => l.id === listingId);
  if (!listing) throw new Error('Eʼlon topilmadi');

  if (listing.status !== LISTING_STATUS.RESERVED) {
    throw new Error('Faqat band qilingan (RESERVED) uyni topshirish mumkin');
  }

  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const req = requests.find((r) => r.listingId === listingId && (r.status === REQUEST_STATUS.PAID_ESCROW || r.status === REQUEST_STATUS.ADMIN_REVIEW));

  if (!req || !req.isPaymentConfirmed) {
    throw new Error('Toʻlov 100% tasdiqlanmaguncha uyni topshirish taqiqlanadi!');
  }

  // 1. E'lonni HANDED_OVER ga o'tkazish
  await transitionListingStatus(
    listingId,
    LISTING_STATUS.HANDED_OVER,
    'Admin uyni topshirishni tasdiqladi, kontaktlar ochildi va shartnoma tuzildi',
    {
      performedBy: adminId,
      handedOverAt: new Date().toISOString()
    }
  );

  // 2. Zayavkada kontaktlarni ochish
  req.contactsUnlocked = true;
  req.handedOverAt = new Date().toISOString();
  await transitionRequestStatus(
    req.id,
    REQUEST_STATUS.CONTRACT_DRAFTING,
    'Admin uyni topshirdi. Kontaktlar ochildi va elektron shartnoma loyihasi generatsiya qilindi.',
    { contactsUnlocked: true }
  );

  // 3. Shartnoma avtomatik generatsiya qilish (contractsService orqali)
  try {
    const { generateContractDraft } = await import('./contractsService');
    await generateContractDraft(req.id);
  } catch (err) {
    console.warn('Auto contract draft generation note:', err.message);
  }

  addNotification({
    userId: req.tenantId,
    title: 'Uy sizga topshirildi!',
    message: `"${listing.title}" egasining telefon raqamlari ochildi va elektron shartnoma tuzildi. SMS-kod orqali imzolang.`,
    type: 'success',
    link: `/contracts`
  });

  addNotification({
    userId: req.ownerId,
    title: 'Uy ijarachiga topshirildi',
    message: `"${listing.title}" uyingiz uchun admin topshirishni tasdiqladi. Elektron shartnoma imzolashga tayyor.`,
    type: 'info',
    link: `/contracts`
  });

  return { success: true, listingId, requestId: req.id };
};

/**
 * Bandlikni bekor qilish va pulni qaytarish (Refund)
 * RESERVED/HANDED_OVER → ACTIVE
 */
export const cancelReservationAndRefund = async (listingId, reason, performedBy) => {
  await delay(350);
  const listings = getFromStorage(STORAGE_KEYS.LISTINGS, []);
  const listing = listings.find((l) => l.id === listingId);
  if (!listing) throw new Error('Eʼlon topilmadi');

  const requests = getFromStorage(STORAGE_KEYS.REQUESTS, []);
  const req = requests.find((r) => r.listingId === listingId && (r.status === REQUEST_STATUS.PAID_ESCROW || r.status === REQUEST_STATUS.ADMIN_REVIEW || r.status === REQUEST_STATUS.CONTRACT_DRAFTING));

  // E'lonni ACTIVE ga qaytarish
  await transitionListingStatus(
    listingId,
    LISTING_STATUS.ACTIVE,
    `Bandlik bekor qilindi (${reason}). 30$ Escrow toʻlovi toʻliq qaytarildi.`,
    { performedBy }
  );

  // Zayavkada pulni qaytarish (REFUNDED)
  if (req) {
    await transitionRequestStatus(
      req.id,
      REQUEST_STATUS.REFUNDED,
      `Bandlik bekor qilingani sababli $30 Escrow toʻlovi mijoz hisobiga 100% qaytarildi. Sabab: ${reason}`,
      { refundedAt: new Date().toISOString() }
    );

    addNotification({
      userId: req.tenantId,
      title: '30$ Escrow qaytarildi',
      message: `"${listing.title}" uyi boʻyicha bitim bekor qilindi va 30$ toʻlovingiz qaytarildi.`,
      type: 'info',
      link: '/requests'
    });
  }

  return { success: true, listingId };
};

/**
 * E'lon (Listing) holatlari va holat mashinasi (State Machine) qoidalari
 */
export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',                 // Umumiy qidiruvda va bosh sahifada ko'rinadi
  HOLD: 'HOLD',                     // Ega zayavkani qabul qilgan, to'lov kutilmoqda (24 soat)
  RESERVED: 'RESERVED',             // To'lov o'tgan, qidiruvdan yashirilgan, shartnoma kutilmoqda (48 soat)
  HANDED_OVER: 'HANDED_OVER',       // Admin topshirgan, kontaktlar ochilgan, shartnoma tuzilgan
  RENTED: 'RENTED',                 // Ijara shartnomasi imzolanib, ko'chib kirilgan
  SOLD: 'SOLD',                     // Sotuv shartnomasi imzolanib, bitim yakunlangan
  ARCHIVED: 'ARCHIVED',             // Arxivlangan yoki egasi tomonidan yopilgan
  // Moderatsiya holatlari
  PENDING_MODERATION: 'PENDING_MODERATION', // Yangi qo'shilgan, admin tekshiruvida
  REJECTED: 'REJECTED'              // Moderatsiyadan o'tmadi
};

/**
 * Holat mashinasida ruxsat etilgan o'tishlar xaritasi
 * Belgilangan qoidadan boshqa har qanday o'tish xato beradi!
 */
export const ALLOWED_LISTING_TRANSITIONS = {
  [LISTING_STATUS.ACTIVE]: [
    LISTING_STATUS.HOLD,
    LISTING_STATUS.ARCHIVED
  ],
  [LISTING_STATUS.HOLD]: [
    LISTING_STATUS.RESERVED,
    LISTING_STATUS.ACTIVE
  ],
  [LISTING_STATUS.RESERVED]: [
    LISTING_STATUS.HANDED_OVER,
    LISTING_STATUS.ACTIVE // Bekor qilish yoki 48 soatda shartnoma bo'lmasa refund
  ],
  [LISTING_STATUS.HANDED_OVER]: [
    LISTING_STATUS.RENTED,
    LISTING_STATUS.SOLD,
    LISTING_STATUS.ACTIVE // Bekor qilish yoki nizoda qaytarish
  ],
  [LISTING_STATUS.RENTED]: [
    LISTING_STATUS.ARCHIVED
  ],
  [LISTING_STATUS.SOLD]: [
    LISTING_STATUS.ARCHIVED
  ],
  [LISTING_STATUS.ARCHIVED]: [
    LISTING_STATUS.ACTIVE
  ],
  [LISTING_STATUS.PENDING_MODERATION]: [
    LISTING_STATUS.ACTIVE,
    LISTING_STATUS.REJECTED
  ],
  [LISTING_STATUS.REJECTED]: [
    LISTING_STATUS.PENDING_MODERATION
  ]
};

export const LISTING_STATUS_LABELS = {
  [LISTING_STATUS.ACTIVE]: { uz: 'Faol', ru: 'Активно', en: 'Active', color: 'success' },
  [LISTING_STATUS.HOLD]: { uz: 'Band qilinmoqda', ru: 'Бронируется', en: 'Hold (24h)', color: 'warning' },
  [LISTING_STATUS.RESERVED]: { uz: 'Band qilingan', ru: 'Забронировано', en: 'Reserved', color: 'accent' },
  [LISTING_STATUS.HANDED_OVER]: { uz: 'Topshirilmoqda', ru: 'Передаётся', en: 'Handed Over', color: 'info' },
  [LISTING_STATUS.RENTED]: { uz: 'Ijaraga berildi', ru: 'Сдано', en: 'Rented', color: 'neutral' },
  [LISTING_STATUS.SOLD]: { uz: 'Sotildi', ru: 'Продано', en: 'Sold', color: 'neutral' },
  [LISTING_STATUS.ARCHIVED]: { uz: 'Arxivlandi', ru: 'В архиве', en: 'Archived', color: 'neutral' },
  [LISTING_STATUS.PENDING_MODERATION]: { uz: 'Moderatsiyada', ru: 'На проверке', en: 'Pending', color: 'warning' },
  [LISTING_STATUS.REJECTED]: { uz: 'Rad etildi', ru: 'Отклонено', en: 'Rejected', color: 'danger' }
};

/**
 * Zayavka (Buyurtma/Ijara/Sotuv bitimi) statuslari va holat mashinasi (State Machine) qoidalari
 */
export const REQUEST_STATUS = {
  SUBMITTED: 'SUBMITTED',             // Qidiruvchi zayavka yubordi
  REJECTED: 'REJECTED',               // Ega rad etdi
  ACCEPTED: 'ACCEPTED',               // Ega qabul qildi
  PAYMENT_PENDING: 'PAYMENT_PENDING', // 30$ xizmat haqi kutilmoqda
  PAID_ESCROW: 'PAID_ESCROW',         // To'landi (Escrow - xavfsiz hamyonda muzlatildi)
  ADMIN_REVIEW: 'ADMIN_REVIEW',       // Admin tekshirmoqda
  CONTRACT_DRAFTING: 'CONTRACT_DRAFTING', // Shartnoma tuzilmoqda
  SIGNED: 'SIGNED',                   // Ikki tomon elektron imzoladi
  MOVE_IN_CONFIRMED: 'MOVE_IN_CONFIRMED', // Kirish tasdiqlandi (Uy holati akti qabul qilindi)
  COMPLETED: 'COMPLETED',             // Bitim yakunlandi, depozit/pul hisob-kitob qilindi
  CANCELLED: 'CANCELLED',             // Bekor qilindi (qaytarildi)
  REFUNDED: 'REFUNDED',               // Pul qaytarildi (48 soat o'tib yoki admin qarori)
  DISPUTED: 'DISPUTED'                // Nizo (Arbitraj holatida)
};

export const STATUS_LABELS = {
  [REQUEST_STATUS.SUBMITTED]: { uz: 'Yuborildi', ru: 'Отправлено', en: 'Submitted', color: 'info' },
  [REQUEST_STATUS.REJECTED]: { uz: 'Rad etildi', ru: 'Отклонено', en: 'Rejected', color: 'danger' },
  [REQUEST_STATUS.ACCEPTED]: { uz: 'Qabul qilindi', ru: 'Принято', en: 'Accepted', color: 'success' },
  [REQUEST_STATUS.PAYMENT_PENDING]: { uz: 'Toʻlov kutilmoqda', ru: 'Ожидает оплаты', en: 'Payment Pending', color: 'warning' },
  [REQUEST_STATUS.PAID_ESCROW]: { uz: 'Toʻlandi (Escrow)', ru: 'Оплачено (Эскроу)', en: 'Paid (Escrow)', color: 'accent' },
  [REQUEST_STATUS.ADMIN_REVIEW]: { uz: 'Admin koʻrib chiqmoqda', ru: 'На проверке админа', en: 'Admin Review', color: 'warning' },
  [REQUEST_STATUS.CONTRACT_DRAFTING]: { uz: 'Shartnoma tayyorlanmoqda', ru: 'Составление договора', en: 'Contract Drafting', color: 'info' },
  [REQUEST_STATUS.SIGNED]: { uz: 'Imzolandi', ru: 'Подписан', en: 'Signed', color: 'success' },
  [REQUEST_STATUS.MOVE_IN_CONFIRMED]: { uz: 'Koʻchib kirish tasdiqlandi', ru: 'Заселение подтверждено', en: 'Move-in Confirmed', color: 'success' },
  [REQUEST_STATUS.COMPLETED]: { uz: 'Muvaffaqiyatli yakunlandi', ru: 'Завершено успешно', en: 'Completed', color: 'success' },
  [REQUEST_STATUS.CANCELLED]: { uz: 'Bekor qilindi', ru: 'Отменено', en: 'Cancelled', color: 'neutral' },
  [REQUEST_STATUS.REFUNDED]: { uz: 'Pul qaytarildi', ru: 'Средства возвращены', en: 'Refunded', color: 'info' },
  [REQUEST_STATUS.DISPUTED]: { uz: 'Nizo (Arbitraj)', ru: 'Спор (Арбитраж)', en: 'Disputed', color: 'danger' }
};

/**
 * Holat mashinasida mumkin bo'lgan o'tishlar xaritasi
 */
export const ALLOWED_TRANSITIONS = {
  [REQUEST_STATUS.SUBMITTED]: [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED, REQUEST_STATUS.CANCELLED],
  [REQUEST_STATUS.REJECTED]: [],
  [REQUEST_STATUS.ACCEPTED]: [REQUEST_STATUS.PAYMENT_PENDING, REQUEST_STATUS.CANCELLED],
  [REQUEST_STATUS.PAYMENT_PENDING]: [REQUEST_STATUS.PAID_ESCROW, REQUEST_STATUS.CANCELLED],
  [REQUEST_STATUS.PAID_ESCROW]: [REQUEST_STATUS.ADMIN_REVIEW, REQUEST_STATUS.CONTRACT_DRAFTING, REQUEST_STATUS.REFUNDED, REQUEST_STATUS.DISPUTED],
  [REQUEST_STATUS.ADMIN_REVIEW]: [REQUEST_STATUS.CONTRACT_DRAFTING, REQUEST_STATUS.REFUNDED, REQUEST_STATUS.DISPUTED],
  [REQUEST_STATUS.CONTRACT_DRAFTING]: [REQUEST_STATUS.SIGNED, REQUEST_STATUS.CANCELLED, REQUEST_STATUS.DISPUTED],
  [REQUEST_STATUS.SIGNED]: [REQUEST_STATUS.MOVE_IN_CONFIRMED, REQUEST_STATUS.DISPUTED],
  [REQUEST_STATUS.MOVE_IN_CONFIRMED]: [REQUEST_STATUS.COMPLETED, REQUEST_STATUS.DISPUTED],
  [REQUEST_STATUS.COMPLETED]: [],
  [REQUEST_STATUS.CANCELLED]: [],
  [REQUEST_STATUS.REFUNDED]: [],
  [REQUEST_STATUS.DISPUTED]: [REQUEST_STATUS.COMPLETED, REQUEST_STATUS.REFUNDED, REQUEST_STATUS.CANCELLED]
};

export const LISTING_TYPE = {
  RENT: 'RENT',
  SALE: 'SALE'
};

export const RENT_MODE = {
  ENTIRE: 'ENTIRE', // Butun uy
  ROOM: 'ROOM'      // Xona-xona (talaba/yotoqxona)
};

export const PAYMENT_TERM = {
  PREPAY: 'PREPAY',       // Oldindan to'lov
  POSTPAY: 'POSTPAY',     // Oy oxirida to'lov (zalog va min muddat majburiy)
  MONTHLY: 'MONTHLY'      // Oylik to'lov
};

export const USER_VERIFICATION_STATUS = {
  UNVERIFIED: 'UNVERIFIED',     // Tasdiqlanmagan
  PENDING: 'PENDING',           // Tekshiruvda
  VERIFIED: 'VERIFIED',         // Tasdiqlangan
  REJECTED: 'REJECTED'          // Rad etilgan
};

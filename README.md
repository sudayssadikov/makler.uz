# 🏠 Makler.uz — Xavfsiz va Shaffof Koʻchmas Mulk Platformasi (Frontend)

Oʻzbekistondagi birinchi vositachisiz, **100% JSHSHIR** orqali shaxsi tasdiqlangan, **$30 Escrow** toʻlov himoyasi va rasmiy elektron shartnomalar bilan ishlovchi zamonaviy koʻchmas mulk platformasi.

Loyihaning frontend qismi **React 18 + JavaScript (JSX)**, zamonaviy **Neumorphism** (Soft Clay/Dark Slate) UX/UI dizaynida noldan ishlab chiqilgan.

---

## 🚀 Texnologiyalar va Kutubxonalar

- **React 18** (Vite muhitida, Faqat JSX/JavaScript — TypeScript ISHLATILMAGAN)
- **React Router v6** (Deklarativ marshrutlash)
- **Zustand** (Global holat boshqaruvi: Theme, Auth, Toast)
- **i18next & react-i18next** (UZ asosiy, RU, EN tillari, til navbar'da almashtiriladi va saqlanadi)
- **Neumorphism Design System** (CSS Variables, Yumshoq Inset va Outset soyalar, Dark/Light rejim)
- **Leaflet & React-Leaflet** (Xaritalar va manzil joylashuvi)
- **jsPDF** (Elektron ijara shartnomasini PDF formatda yuklab olish)
- **Canvas-Confetti** (Muvaffaqiyatli toʻlov mikro-animatsiyasi)
- **Mock API Service** (JSDoc izohlar bilan Promise + delay, localStorage persistent ma'lumotlar bazasi)

---

## 📂 Papka Tuzilmasi

```text
src/
├── app/
│   ├── App.jsx                  # Asosiy App komponenti
│   └── routes.jsx               # Barcha sahifalar marshruti
├── components/
│   ├── layout/                  # Navbar, Footer, AppLayout
│   └── ui/                      # Reusable Neumorphic UI kit:
│                                # Button, Input, Select, Card, Modal,
│                                # Stepper, Badge, Toast, Skeleton, Tabs
├── constants/
│   ├── requestStatus.js         # State machine, statuslar va ruxsat etilgan o'tishlar
│   ├── regions.js               # O'zbekiston viloyatlari, tumanlari, bino turlari
│   └── amenities.js             # Qulayliklar va uy qoidalari
├── features/
│   ├── auth/                    # Login (OTP/Google), Multi-step JSHSHIR Register
│   ├── home/                    # Hero, qidiruv CTA, xavfsizlik va yangi e'lonlar
│   ├── search/                  # Aqlli so'rovnoma (FAQAT SELECT/tanlovlar, Match % foiz)
│   ├── listings/                # E'lon kartasi, batafsil sahifa, Wizard, Mening e'lonlarim
│   ├── requests/                # Zayavkalar, 48h timer, yashirin kontaktlar, timeline
│   ├── payments/                # 30$ Escrow to'lov oynasi (Click / Payme mock)
│   ├── contracts/               # Shartnoma, zalog bandi, inventar akti, SMS OTP imzo, PDF
│   └── admin/                   # Admin panel: JSHSHIR tasdiqlash, moderatsiya, Escrow, nizolar
├── i18n/
│   ├── i18n.js                  # i18next konfiguratsiyasi
│   └── locales/                 # uz.json, ru.json, en.json
├── services/                    # Mock API qatlami (Promise + delay, localStorage)
│   ├── storage.js               # Boshlang'ich ma'lumotlar va doimiy saqlash
│   ├── mockData.js              # 20+ e'lonlar, 5 foydalanuvchi, 1 admin, shartnomalar
│   ├── authService.js
│   ├── listingsService.js
│   ├── requestsService.js
│   ├── contractsService.js
│   └── adminService.js
├── store/                       # Zustand do'konlari (authStore, themeStore, toastStore)
└── styles/
    ├── theme.css                # Neumorphism CSS o'zgaruvchilari (Dark/Light)
    └── index.css                # Global neumorphic utility klasslar
```

---

## ⚙️ Ishga Tushirish

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Dasturni dev rejimida ishga tushirish
```bash
npm run dev
```

### 3. Production uchun build qilish va tekshirish
```bash
npm run build
```

---

## 🔐 Mock Login va Sinov Ma'lumotlari

Tizimda barcha funksiyalarni tez sinash uchun demo foydalanuvchilar tayyorlangan. Shuningdek, Navbarda **"ADMIN / USER"** tezkor almashtirish tugmasi mavjud.

### 1. Admin Akkaunti
- **Roli**: ADMIN
- **Ismi**: Sherzod Adminov
- **Telefon**: `+998 90 123 45 67`
- **SMS OTP**: `123456`
- **Imkoniyatlari**: Foydalanuvchilar JSHSHIR/Pasport tekshiruvi, e'lonlar moderatsiyasi, Escrow hamyon nazorati, arbitraj nizolari.

### 2. E'lon Egasi (Mulkiy ega / Landlord)
- **Roli**: USER (VERIFIED)
- **Ismi**: Azizbek Qodirov
- **Telefon**: `+998 93 111 22 33`
- **SMS OTP**: `123456`
- **JSHSHIR**: `32508924560098`

### 3. Qidiruvchi / Ijarachi (Tenant)
- **Roli**: USER (VERIFIED)
- **Ismi**: Jasur Mansurov
- **Telefon**: `+998 99 333 44 55`
- **SMS OTP**: `123456`
- **JSHSHIR**: `51402017890067`

---

## 🌟 Asosiy Xususiyatlar va Biznes Mantiq

1. **Neumorphism (Soft Clay & Slate)**:
   - Och va to'q rejimda mukammal chuqurlik (inset) va bo'rtib chiqqan (outset) soyalar.
   - O'qilishi oson, ko'zni toliqtirmaydigan zamonaviy kontrast va tipografika.
2. **Kichik So'rovnoma (Aqlli Qidiruv)**:
   - Erkin matn kiritish yo'q — barcha qidiruv mezonlari qat'iy `Select` va segmented tugmalar orqali tanlanadi.
   - Har bir e'longa 0-100% oralig'ida **Moslik ko'rsatkichi (Match %)** beriladi.
3. **Shaffof E'lon Joylashtirish (Wizard)**:
   - Xona-xona rejimida har bir xonaning kamida **3 ta rasmi** va **kamchiliklari/sharoitlari** kiritilishi shart.
   - Oy oxirida to'lov tanlansa, kamida 1 oylik **Zalog (depozit)** va **minimal ijara muddati** kiritilishi majburiy.
   - Kadastr / egalik hujjati yuklanishi shart.
4. **Zayavka va Escrow Holat Mashinasi (State Machine)**:
   - Kontaktlar to'lovgacha **Yashirin**, to'lov va tasdiqdan keyin ochiladi.
   - 30$ xizmat to'lovi **Click** yoki **Payme** orqali xavfsiz Escrowda ushlab turiladi.
   - Ega 48 soat ichida harakat qilmasa, 48h kafolat taymeri orqali pul 100% qaytariladi.
5. **Elektron Shartnoma va Uy Holati Akti**:
   - E'lon ma'lumotlaridan avtomatik generatsiya (JSHSHIR, to'lov, zalog, qoidalar).
   - Har ikki tomon tomonidan **SMS-kod (OTP)** bilan rasmiy elektron imzolanadi.
   - PDF ko'rinishida yuklab olish imkoniyati.
6. **Admin Panel Nazorati**:
   - To'lov 100% tasdiqlanmaguncha "Uyni olib berish / Bitimni yakunlash" tugmasi bloklangan.

---

## 🔒 E'lon Band Qilish (Reservation) Tizimi va Holat Mashinasi

### E'lon Holatlari (`constants/listingStatus.js`)
- **ACTIVE**: E'lon faol, qidiruvda va tavsiyalarda ko'rinadi, barcha foydalanuvchilar zayavka bera oladi.
- **HOLD**: Ega zayavkani qabul qilgan. 24 soatlik to'lov taymeri ishga tushadi. Boshqa foydalanuvchilar zayavka bera olmaydi yoki to'lov qila olmaydi.
- **RESERVED**: $30 Escrow to'lovi muvaffaqiyatli to'langan. E'lon umumiy qidiruvdan, bosh sahifadan va sevimlilardan yashiriladi. To'g'ridan-to'g'ri havola orqali ochilganda maxsus "Bu uy band qilingan" ekrani va o'xshash uylar tavsiyasi ko'rsatiladi. Boshqa barcha raqobatchi arizalar avtomatik rad etiladi.
- **HANDED_OVER**: Admin tekshiruvdan o'tkazib (to'lov 100% tasdiqlangan bo'lsa), "Uyni topshirish"ni tasdiqlagan. Ikkala tomon kontaktlari ochilgan va elektron shartnoma loyihasi generatsiya qilingan.
- **RENTED / SOLD**: Ikkala tomon elektron shartnomani SMS OTP orqali imzolab, ko'chib kirish tasdiqlangan.
- **ARCHIVED**: E'lon arxivlangan.

---

## 🧪 Qo'lda Sinash Yo'riqnomasi (Manual Test Scenarios a-g)

### Ssenariy (a): ACTIVE → HOLD (24 soatlik taymer)
1. Qidiruvchi hisobida (`Jasur Mansurov`) tizimga kiring yoki ro'yxatdan o'ting.
2. Ixtiyoriy faol e'lonni tanlab, **"Zayavka yuborish"** tugmasini bosing.
3. Navbar'dagi tezkor almashtirgich orqali Ega hisobiga (`Azizbek Qodirov`) o'ting.
4. **"Zayavkalar"** sahifasiga kiring va yangi arizani **"Qabul qilish"** (Accept) qiling.
5. **Natija**: E'lon holati `HOLD` ga o'tadi, 24 soatlik teskari hisob taymeri paydo bo'ladi. Audit jurnaliga yozuv qo'shiladi va qidiruvchiga xabarnoma boradi.

### Ssenariy (b): HOLD paytida boshqa foydalanuvchi kirganda
1. Uchinchi foydalanuvchi sifatida tizimga kiring (yoki Guest rejimda).
2. HOLD holatidagi e'lon sahifasiga kiring.
3. **Natija**: E'londa sariq rangli **"Koʻrib chiqilmoqda (HOLD)"** belgisi va 24 soatlik taymer ko'rinadi. **"Zayavka yuborish"** tugmasi nofaol (disabled) bo'lib, *"Ushbu eʼlon boshqa foydalanuvchi tomonidan koʻrib chiqilmoqda"* xabari chiqadi. Boshqa foydalanuvchi to'lov qila olmaydi.

### Ssenariy (c): HOLD → RESERVED ($30 Escrow to'lovi va yashirish)
1. Ariza egasi (Foydalanuvchi A) hisobiga kiring va arizalar sahifasiga o'ting.
2. **"30$ Escrow toʻlash"** tugmasini bosing va Payme / Click orqali to'lovni tasdiqlang.
3. **Natija**: E'lon darhol `RESERVED` holatiga o'tadi. Bosh sahifa, aqlli qidiruv va tavsiyalar ro'yxatidan yo'qoladi. E'longa to'g'ridan-to'g'ri link orqali kirilganda **"Bu uy band qilingan"** maxsus banneri va o'sha tuman/narxdagi faol o'xshash uylar taklif etiladi.

### Ssenariy (d): Raqobatchi arizalarni avtomatik rad etish
1. Bir vaqtning o'zida bitta e'longa 2 ta foydalanuvchi zayavka yuborgan bo'lsin.
2. Ega ulardan birini qabul qilib, o'sha foydalanuvchi to'lovni bajarsin (`RESERVED`).
3. **Natija**: Shu e'longa berilgan boshqa barcha `PENDING`/`SUBMITTED` arizalar avtomatik tarzda `REJECTED` qilinadi, sababi *"Uy band qilindi"* deb belgilanadi va tegishli foydalanuvchilarga xabarnoma yuboriladi.

### Ssenariy (e): Xona-xona ijarada xonani band qilish
1. Xona-xona ijaraga qo'yilgan ko'p xonali e'longa (masalan, 3 xonali kvartira) kiring.
2. 1-xona uchun zayavka topshiring va to'lovni bajaring.
3. **Natija**: Faqat 1-xona `isReserved: true` holatiga o'tadi. Umumiy e'lon faol bo'lib qoladi va qolgan xonalar boshqa talabgorlar uchun ochiq turadi. Barcha xonalar band bo'lgandagina umumiy e'lon `RESERVED` holatiga o'tadi.

### Ssenariy (f): Ega uchun "Mening e'lonlarim" nazorati
1. Ega hisobiga kiring va **"Mening e'lonlarim"** bo'limiga o'ting.
2. **Natija**: Har bir e'lonning aniq bosqichi ko'rinadi: `Faol`, `Koʻrib chiqilmoqda (24s qoldi)`, `Band qilingan (Escrow toʻlangan)`, `Topshirilmoqda` yoki `Ijara yakunlangan`.

### Ssenariy (g): Admin tekshiruvi va "Uyni topshirish"
1. Admin hisobiga (`Sherzod Adminov`) o'ting va **Admin Dashboard**ga kiring.
2. **"Band qilinganlar (Reservations) navbati"** tabini oching.
3. **Natija**: Jadvalda e'lon, qidiruvchi, to'lov holati ($30), tranzaksiya ID si (`TXN-...`) va muddat ko'rinadi.
4. To'lov 100% tasdiqlangan bo'lsa **"Uyni topshirish"** tugmasi ochiladi (tasdiqlanmagan bo'lsa bloklanadi).
5. Tugma bosilganda e'lon `HANDED_OVER` ga o'tadi, har ikki tomon kontaktlari ochiladi va avtomatik elektron shartnoma loyihasi tuziladi.

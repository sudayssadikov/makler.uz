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

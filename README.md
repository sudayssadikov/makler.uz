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

### 4. Platforma Agentlari (Staff Agents)
- **Agent 1 (Toshkent)**: Farrux Zokirov (`+998 90 111 00 11`), SMS OTP: `123456`
- **Agent 2 (Samarqand)**: Otabek Yoqubov (`+998 90 222 00 22`), SMS OTP: `123456`
- **Paneli**: `/agent` (mobilga to'liq moslashgan ishchi panel)

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
4. **Zayavka, Ko'rsatish va Escrow Holat Mashinasi**:
   - Kontaktlar to'lovgacha **Yashirin**, to'lov va tasdiqdan keyin ochiladi.
   - 30$ ko'rsatish xizmati haqi **Click** yoki **Payme** (yoki bepul kupon) orqali xavfsiz Escrowda ushlab turiladi.
   - To'lov o'tgach, tizim avtomatik ravishda kam yuklamali platforma xodimiga (AGENT) ko'rsatish vazifasini biriktiradi.
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

## 🧪 Qo'lda Sinash Yo'riqnomasi (Manual Test Scenarios a-i)

### Ssenariy (a): To'lov → Avto-vazifa yaratilishi → Agent biriktirish
1. Qidiruvchi hisobida zayavkani qabul qildirib, 30$ to'lovni bajaring.
2. Tizim darhol `createViewingTask` chaqiradi va Toshkent hududidagi eng kam yuklamali agentga (Farrux Zokirov) vazifani biriktiradi.
3. Admin panelida "Koʻrsatishlar & SLA" tabida yangi vazifa ko'rinadi.

### Ssenariy (b): Agentni almashtirish / qayta tayinlash
1. Admin Dashboard → "Koʻrsatishlar & SLA" bo'limiga kiring.
2. Vazifa qatoridagi agent tanlash dropdownidan boshqa agentni tanlang.
3. Natija: Yangi agentga bildirishnoma boradi va vazifa uning `/agent` paneliga ko'chadi.

### Ssenariy (c): Vaqt kelishish va qayta rejalash
1. `/agent` paneliga kiring, vazifa bo'yicha "Vaqt taklif qilish" tugmasini bosing va 2 ta vaqt kiriting.
2. Mijoz o'zining "Zayavkalar" sahifasida vaqtni tasdiqlaydi (`SCHEDULE_CONFIRMED`).
3. Qayta rejalashtirish chegarasi: har tomondan ko'pi bilan 2 martagacha.

### Ssenariy (d): Ko'rsatish kuni "Mijoz yoqtirdi" → Shartnoma
1. Agent `/agent` panelida "Boshladim (Joydaman)" tugmasini bosadi (`IN_PROGRESS`).
2. "Natijani kiritish" tugmasini bosib, checklist to'ldiradi va "Mijoz yoqtirdi (Liked)" variantini tanlaydi.
3. Natija: Zayavka `CONTRACT_DRAFTING` ga o'tadi va elektron shartnoma tayyorlanadi.

### Ssenariy (e): "Mijoz yoqtirmadi" → 14 kunlik bepul kupon
1. Agent ko'rsatish natijasida "Yoqtirmadi (Disliked)" deb tanlaydi va sababini yozadi.
2. Natija: Mijozga 14 kunlik bepul qayta ko'rsatish kuponi (`VIEW-FREE-XXXX`) beriladi. Keyingi to'lov oynasida "Kupon bilan toʻlash ($0)" varianti avtomatik faollashadi.

### Ssenariy (f): "Uy e'londagidek emas" → 100% qaytarish va moderatsiya
1. Agent "Uy eʼlondagidek emas (MISMATCH)" tanlaydi.
2. Natija: 30$ to'lov 100% ijarachiga qaytariladi (`REFUNDED`), e'lon esa qayta moderatsiyaga yuboriladi.

### Ssenariy (g): Ega kelmadi yoki Mijoz kelmadi
1. "Ega kelmadi" tanlanganda — mijozga 100% qaytariladi, mulk egasiga reyting jarimasi belgilanadi.
2. "Mijoz kelmadi" tanlanganda — pul qaytarilmaydi, 1 marta qayta rejalashtirish imkoni beriladi.

### Ssenariy (h): SLA kechikishi (6h / 48h) va Eskalatsiya
1. To'lovdan keyin 6 soat ichida agent tayinlanmasa yoki 48 soatda ko'rsatish bo'lmasa, admin panelida qizil "Eskalatsiya (Kechikkan)" belgisi yonadi va 100% qaytarish kafolati ishga tushadi.

### Ssenariy (i): Agentlar xavfsizlik izolatsiyasi
1. Agent A (`Farrux Zokirov`) kirganida faqat o'ziga biriktirilgan vazifalarni ko'radi (`/agent`).
2. Agent B (`Otabek Yoqubov`) vazifalarini ko'ra olmaydi va tahrirlay olmaydi.

---

## 🚀 Deploy Qilish (Vercel va Netlify)

### Vercel:
Loyiha ildizida `vercel.json` fayli mavjud:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
CLI orqali:
```bash
npx vercel --prod
```

### Netlify:
`public/_redirects` faylida SPA rewrite sozlangan:
```text
/*    /index.html   200
```

---

## 📋 5-10 ta Sinovchiga Beriladigan Savollar Ro'yxati (UX/Product Feedback)

1. **30$ Ko'rsatish xizmati narxi**: Platforma xodimi uyni sizga o'zi borib ko'rsatishi va qonuniy shartnoma tuzishi uchun 30$ to'lashga rozimisiz?
2. **Xona-xona ijara modeli**: Talabalar va yoshlar uchun alohida xonalarni ijaraga olish imkoniyati qanchalik qulay?
3. **Xodim ko'rsatishi ishonch beradimi**: An'anaviy "vositachisiz" yolg'onlaridan ko'ra rasmiy platforma xodimi ishtiroki ishonch bag'ishladimi?
4. **Qaytarish va Kupon qoidasi**: Agar uy yoqmasa, 14 kunlik bepul kupon berilishi adolatlimi?
5. **Nima tushunarsiz yoki noqulay bo'ldi**: Interfeys yoki to'lov jarayonida qaysi qadam qiyinchilik tug'dirdi?


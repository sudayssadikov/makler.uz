# 📑 Makler.uz — REST API Shartnomasi (API Contract)

Mazkur hujjat backend dasturchilar uchun Makler.uz platformasining avtorizatsiya, foydalanuvchilar va admin paneli endpointlari spetsifikatsiyasini belgilaydi. Barcha frontend mock servislar aynan shu formatga mos qilib yozilgan.

---

## 1. Standart Javob Formati (Response Envelope)

### Muvaffaqiyatli javob (200, 201):
```json
{
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-10-09T16:00:00.000Z",
    "version": "v1",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

### Xatolik javobi (400, 401, 403, 404, 429, 500):
```json
{
  "data": null,
  "error": {
    "code": "INVALID_OTP",
    "message": "Kiritilgan SMS kod noto'g'ri",
    "details": {
      "remainingAttempts": 3
    }
  },
  "meta": {
    "timestamp": "2026-10-09T16:00:00.000Z",
    "version": "v1"
  }
}
```

---

## 2. Autentifikatsiya Endpointlari (`/api/auth`)

### 2.1. OTP kod yuborish
- **Metod / Yo'l:** `POST /api/auth/send-otp`
- **Tavsif:** Foydalanuvchi telefoniga 6 xonali SMS kod yuboradi.
- **Request Body:**
  ```json
  {
    "phone": "+998901234567"
  }
  ```
- **Response (200):**
  ```json
  {
    "data": {
      "sent": true,
      "phone": "+998901234567",
      "retryAfterSeconds": 60,
      "expiresInSeconds": 300,
      "isRegistered": true
    }
  }
  ```
- **Xato kodlari:** `TOO_MANY_ATTEMPTS` (429), `VALIDATION_ERROR` (400).

---

### 2.2. OTP kodni tasdiqlash va Kirish
- **Metod / Yo'l:** `POST /api/auth/verify-otp`
- **Request Body:**
  ```json
  {
    "phone": "+998901234567",
    "code": "123456",
    "rememberMe": true
  }
  ```
- **Response (200):**
  ```json
  {
    "data": {
      "user": {
        "id": "user_1",
        "phone": "+998901234567",
        "firstName": "Jasur",
        "lastName": "Mansurov",
        "role": "USER",
        "status": "VERIFIED",
        "pinfl": "51402017890067"
      },
      "tokens": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
        "expiresIn": 900
      }
    }
  }
  ```
- **Xato kodlari:** `INVALID_OTP` (400), `OTP_EXPIRED` (400), `ACCOUNT_BLOCKED` (403), `TOO_MANY_ATTEMPTS` (429).

---

### 2.3. Google orqali kirish (OAuth)
- **Metod / Yo'l:** `POST /api/auth/google`
- **Request Body:**
  ```json
  {
    "idToken": "google_oauth_token_mock_or_real"
  }
  ```
- **Response (200):** Verify-otp javobi bilan bir xil.

---

### 2.4. Tokenni yangilash (Refresh Token)
- **Metod / Yo'l:** `POST /api/auth/refresh`
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Response (200):**
  ```json
  {
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "expiresIn": 900
    }
  }
  ```
- **Xato kodlari:** `INVALID_TOKEN` (401), `TOKEN_EXPIRED` (401).

---

### 2.5. Ro'yxatdan o'tish (Ko'p bosqichli)
- **Metod / Yo'l:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "phone": "+998901234567",
    "otpCode": "123456",
    "firstName": "Sardor",
    "lastName": "Karimov",
    "birthDate": "1998-05-12",
    "gender": "male",
    "pinfl": "31205981230045",
    "passportFront": "https://...",
    "passportBack": "https://...",
    "selfie": "https://...",
    "termsAccepted": true
  }
  ```
- **Response (201):**
  ```json
  {
    "data": {
      "user": {
        "id": "user_new",
        "phone": "+998901234567",
        "firstName": "Sardor",
        "status": "PENDING_REVIEW",
        "role": "USER"
      },
      "tokens": { ... }
    }
  }
  ```
- **Xato kodlari:** `DUPLICATE_PINFL` (409), `UNDERAGE` (400), `VALIDATION_ERROR` (400).

---

### 2.6. Tizimdan chiqish (Logout)
- **Metod / Yo'l:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (200):** `{ "data": { "success": true } }`

---

## 3. Foydalanuvchi Profili Endpointlari (`/api/users`)

- `GET /api/users/me` — Joriy foydalanuvchi ma'lumotlari.
- `PUT /api/users/me` — Profil ma'lumotlarini yangilash.
- `POST /api/users/me/resubmit-documents` — REJECTED bo'lganda hujjatlarni qayta yuborish.

---

## 4. Admin Panel Endpointlari (`/api/admin`)

- `GET /api/admin/stats` — Tizim statistikasi (foydalanuvchilar, escrow balansi, e'lonlar, nizolar).
- `GET /api/admin/users?status=PENDING_REVIEW&page=1` — Foydalanuvchilar ro'yxati va filtrlash.
- `POST /api/admin/users/:id/verify` — Foydalanuvchi JSHSHIRini tasdiqlash (`VERIFIED`).
- `POST /api/admin/users/:id/reject` — Foydalanuvchini rad etish (`REJECTED`) sababi bilan: `{ "reason": "Pasport rasmi xira" }`.
- `POST /api/admin/users/:id/block` — Bloklash (`BLOCKED`) sababi bilan: `{ "reason": "Soxta hujjat" }`.
- `POST /api/admin/users/:id/unblock` — Blokdan chiqarish.
- `GET /api/admin/listings?status=PENDING_MODERATION` — E'lonlar moderatsiyasi.
- `POST /api/admin/listings/:id/approve` — E'lonni tasdiqlash.
- `POST /api/admin/listings/:id/reject` — E'lonni rad etish.
- `POST /api/admin/requests/:id/handover` — Escrow to'lovi 100% tushgach uyni topshirish.
- `POST /api/admin/disputes/:id/resolve` — Nizo bo'yicha arbitraj qarori (Refund yoki Complete).

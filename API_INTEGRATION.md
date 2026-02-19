# API Integration Guide

## Зміни для підключення до Production Backend

### Backend URL
- **Production:** https://booking-oselya.pp.ua
- **Development:** http://10.0.2.2 (Android Emulator)

### Змінені файли
1. `src/config/endpoints.ts` - оновлені API routes
2. `app.config.js` - налаштування env
3. `.env.*` - environment variables

### API Endpoints
- Auth: `/api/User/login`, `/api/User/register/client`
- Users: `/api/User/me`, `/api/User/me/update`
- Offers: `/api/Offer/get-all`, `/api/Offer/get/{id}`
- Locations: `/api/City/get-all-cities`
- Bookings: `/api/Order/create`, `/api/Order/get-all`
- Reviews: `/api/Review/by-offer/{id}`

### Тестування
```bash
npm install
npm start
```

### Mock Mode
Для увімкнення моків змінити в `app.config.js`:
```javascript
USE_MOCKS: true
```

---

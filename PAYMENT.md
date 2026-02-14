## 1) Что изменено в backend

### Контроллер
- `Backend/booking/WebApiGetway/Controllers/PaymentsController.cs`

Реализованы BFF endpoint'ы:
- `POST /Bff/payments/create`  
  Создание платежа в LiqPay (возвращает `paymentId`, `status`, `redirectUrl`).
- `POST /Bff/payments/confirm-hold`  
  Подтверждение hold-платежа (`hold -> paid`).
- `GET /Bff/payments/status/{paymentId}`  
  Проверка статуса платежа с запросом в LiqPay API.
- `POST /Bff/payments/tokenize/start`  
  Старт токенизации карты (тестовый flow 1 UAH), возвращает `redirectUrl`.
- `GET /Bff/payments/tokenize/status/{paymentId}`  
  Статус токенизации + `cardToken` и данные карты после успеха.
- `POST /Bff/payments/callback`  
  Callback от LiqPay (`data + signature`), валидация подписи.
- `POST /Bff/payments/tokenize`  
  Сохранение карты по токену (без передачи полного номера и CVV).
- `GET /Bff/payments/cards/{userId}`  
  Получение сохранённых карт пользователя.
- `POST /Bff/payments/charge-saved-card`  
  Оплата сохранённой картой через `card_token` (server-to-server), не клиентская заглушка.

### Добавлены DTO
- `Backend/booking/WebApiGetway/View/TokenizeCardByTokenRequest.cs`
- `Backend/booking/WebApiGetway/View/TokenizeCardStartRequest.cs`

## 2) mobile-app

### Экран добавления карты
- `mobile-app/src/screens/Profile/AddCardScreen.tsx`

LiqPay flow:
1. `startTokenizeCard(...)`
2. открытие `redirectUrl`
3. ожидание возврата приложения в `active`
4. polling `tokenize/status`
5. успех только при `status = paid` и наличии `cardToken`
6. после успеха гарантированный переход в профиль

## 3) API-контракт

### POST `/Bff/payments/create`
Назначение: создать платежную сессию (LiqPay checkout).  
Тело:
```json
{
  "bookingId": "123",
  "amount": 2900,
  "currency": "UAH",
  "method": "pay"
}
```
Ответ:
```json
{
  "paymentId": "order-...",
  "status": "created",
  "redirectUrl": "https://www.liqpay.ua/api/3/checkout?data=...&signature=..."
}
```

### POST `/Bff/payments/confirm-hold`
Назначение: подтвердить hold-платеж.  
Тело:
```json
{ "paymentId": "order-..." }
```
Ответ:
```json
{ "paymentId": "order-...", "status": "paid" }
```

### GET `/Bff/payments/status/{paymentId}`
Назначение: получить актуальный статус из состояния + LiqPay API.  
Ответ:
```json
{ "paymentId": "order-...", "status": "created|hold|paid|failed|cancelled" }
```

### POST `/Bff/payments/tokenize/start`
Назначение: старт токенизации карты (1 UAH).  
Тело:
```json
{
  "userId": "user123",
  "holderName": "John Smith"
}
```
Ответ:
```json
{
  "paymentId": "tok_...",
  "status": "created",
  "redirectUrl": "https://www.liqpay.ua/api/3/checkout?data=...&signature=..."
}
```

### GET `/Bff/payments/tokenize/status/{paymentId}`
Назначение: проверить завершение токенизации и получить токен карты.  
Ответ:
```json
{
  "paymentId": "tok_...",
  "status": "created|paid|failed|cancelled",
  "cardToken": "token_...",
  "card": {
    "id": "card_...",
    "holderName": "John Smith",
    "numberMasked": "**** **** **** 4242",
    "last4": "4242",
    "expiry": "12/30",
    "brand": "visa",
    "token": "token_..."
  }
}
```

### POST `/Bff/payments/tokenize`
Назначение: сохранить карту по уже полученному токену.  
Тело:
```json
{
  "userId": "user-123",
  "holderName": "John Smith",
  "cardToken": "token_...",
  "last4": "4242",
  "numberMasked": "**** **** **** 4242",
  "brand": "visa",
  "expiry": "12/30",
  "saveCard": true
}
```

### GET `/Bff/payments/cards/{userId}`
Назначение: получить список сохранённых карт пользователя.

### POST `/Bff/payments/charge-saved-card`
Назначение: провести оплату сохранённой картой по `card_token`.
Тело:
```json
{
  "userId": "user123",
  "cardId": "card_...",
  "bookingId": "draft-123",
  "amount": 2900,
  "currency": "UAH"
}
```
Ответ:
```json
{
  "paymentId": "saved-...",
  "status": "created|hold|paid|failed|cancelled",
  "redirectUrl": null
}
```

## 4) Переменные окружения backend (!!!ОБЯЗАТЕЛЬНО!!!)

В корневом `.env` проекта:
```env
LIQPAY_PUBLIC_KEY=...
LIQPAY_PRIVATE_KEY=...
LIQPAY_SERVER_URL=https://<публичный-домен>/Bff/payments/callback
LIQPAY_RESULT_URL=mobileapp://payment/result
```

Примечание:
- `LIQPAY_SERVER_URL` должен быть публичным (LiqPay callback не достучится до `localhost`). Поэтому в терминале запускаем в корне проекта cloudflared tunnel --url http://localhost:5010, получаем URL и добавляем в .env
- `LIQPAY_RESULT_URL` можно оставить deep-link приложения или web-страницу возврата.


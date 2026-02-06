### PAYMENTS.md

Платёжный слой (Frontend) — передача на интеграцию Backend

В проекте реализован платёжный слой с разделением на mock и API-реализации, переключаемые флагом USE_MOCKS.
Frontend полностью изолирован от платёжного провайдера (LiqPay) и не хранит ключи.

Цель архитектуры — позволить:
	•	разрабатывать UI без backend,
	•	безопасно подключить реальные платежи позже,
	•	передать backend-разработчику чёткий контракт без переписывания UI.


## 1. Архитектура

Переключение mock / api

Используется флаг:

USE_MOCKS=true | false

Источник:
src/config/constants.ts

export const paymentService =
  USE_MOCKS ? paymentServiceMock : paymentServiceApi;

UI всегда импортирует только paymentService.


## 2. Структура файлов

src/services/payment/
├── payment.types.ts        // Общие типы
├── paymentService.mock.ts  // Mock-реализация (без LiqPay)
├── paymentService.api.ts   // API-клиент под backend
└── index.ts                // Переключение mock/api

Дополнительно:

src/config/endpoints.ts     // /payments/create, /payments/confirm-hold



## 3. Типы (Frontend ↔ Backend контракт)

payment.types.ts

export type PaymentMethod =
  | 'pay'
  | 'hold'
  | 'subscribe'
  | 'paydonate'
  | 'split_rules'
  | 'apay'
  | 'gpay';

export type PaymentStatus =
  | 'created'
  | 'hold'
  | 'paid'
  | 'failed'
  | 'cancelled';

export interface CreatePaymentPayload {
  bookingId: string;
  amount: number;
  currency: 'UAH';
  method: PaymentMethod;
}

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  redirectUrl?: string;
}



## 4. Использование в UI

import { paymentService } from '@/services/payment';

await paymentService.createPayment({
  bookingId,
  amount,
  currency: 'UAH',
  method: 'hold',
});

UI:
	•	не знает, mock или backend используется;
	•	не знает, LiqPay это или другой провайдер;
	•	не хранит ключи.


## 5. Текущее поведение

Mock (paymentService.mock.ts)
	•	эмулирует сетевую задержку;
	•	генерирует paymentId;
	•	возвращает:
	•	status: 'hold' для метода hold;
	•	status: 'paid' для остальных методов;
	•	возвращает mock redirectUrl;
	•	confirmHold(paymentId) переводит hold → paid.

Mock используется для:
	•	UI-разработки;
	•	QA;
	•	демо без backend.

API (paymentService.api.ts)
	•	вызывает backend через apiClient;
	•	методы:
	•	createPayment(payload)
	•	confirmHold(paymentId)
	•	не содержит LiqPay логики.


## 6. Что должен реализовать backend

## 6.1 POST /payments/create

Вход:

{
  "bookingId": "string",
  "amount": 1200,
  "currency": "UAH",
  "method": "hold"
}

Выход:

{
  "paymentId": "string",
  "status": "created | hold | paid",
  "redirectUrl": "string | null"
}

Backend:
	•	генерирует LiqPay params и signature;
	•	использует sandbox или production ключи;
	•	возвращает redirectUrl для checkout (если требуется).


## 6.2 POST /payments/confirm-hold

Используется для двухстадийной оплаты (hold → paid).

Вход:

{
  "paymentId": "string"
}

Выход:

{
  "paymentId": "string",
  "status": "paid | failed"
}



## 6.3 Callback / Webhook от LiqPay

Backend обязан:
	•	принимать callback’и от LiqPay;
	•	обновлять статус платежа;
	•	хранить финальное состояние (paid / failed / cancelled);
	•	возвращать UI тот же формат, что и выше.


## 7. Ключи и безопасность

❗ Frontend не хранит и не использует LiqPay ключи

Ключи находятся только на backend:

LIQPAY_PUBLIC_KEY=sandbox_xxx
LIQPAY_PRIVATE_KEY=sandbox_xxx

Frontend:
	•	не знает public_key;
	•	не знает private_key;
	•	не формирует signature.


## 8. Режимы работы

Mock-режим (по умолчанию)

USE_MOCKS=true

	•	backend не требуется;
	•	платежи симулируются.

Реальный backend

USE_MOCKS=false

Требования:
	•	backend доступен;
	•	эндпоинты /payments/* реализованы;
	•	ключи LiqPay настроены на сервере.


## 9. Бизнес-правила
	•	Бронирования используют method: 'hold' по умолчанию.
	•	pay (мгновенная оплата) может быть включена позже.
	•	Apple Pay / Google Pay:
	•	полностью через backend + LiqPay;
	•	изменения во frontend не требуются.


## 10. Чек-лист приёмки для backend-разработчика
	•	/payments/create возвращает paymentId, status, redirectUrl
	•	/payments/confirm-hold завершает двухстадийный платёж
	•	Callback’и LiqPay корректно обновляют статус
	•	Статусы соответствуют PaymentStatus
	•	UI продолжает работать без изменений


## 11. Примечание

Архитектура специально сделана провайдер-независимой.
При необходимости LiqPay можно заменить на Stripe / Fondy / WayForPay без изменений UI — только через backend и paymentService.api.ts.
# Payment Integration Map (LiqPay + Saved Cards)

This document is a recovery checklist for payment integration in `mobile-app`.
Use it after branch overwrite/merge to restore all payment-related pieces quickly.

## 1) Core Architecture

Payment flow is split into two paths:

1. Saved card flow (`cardId`) via BFF
2. LiqPay redirect flow (create -> redirect -> status polling -> confirm hold)

Main business entry point:

- `src/components/Bookings/BookingScreenView.tsx`

Service layer:

- `src/services/payment/index.ts`
- `src/services/payment/paymentService.api.ts`
- `src/services/payment/payment.types.ts`

Saved cards repository:

- `src/data/payment/index.ts`
- `src/data/payment/types.ts`

## 2) Endpoints (BFF contract)

Defined in:

- `src/config/endpoints.ts` (`payment` section)

Required endpoints:

- `POST /Bff/payments/create`
- `POST /Bff/payments/confirm-hold`
- `GET /Bff/payments/status/{paymentId}`
- `POST /Bff/payments/tokenize`
- `GET /Bff/payments/cards/{userId}`
- `POST /Bff/payments/charge-saved-card`

## 3) Files That Must Stay In Sync

### Booking flow UI + logic

- `src/components/Booking/BookingPaymentMethod.tsx`
  - payment method selector (`card`, `paypal`, `googlePay`, `applePay`, `cash`)
- `src/components/Bookings/BookingScreenView.tsx`
  - map UI payment method -> API payment method
  - saved card / LiqPay switch
  - LiqPay redirect + status handling
  - booking creation only after successful payment

### Saved cards (profile area)

- `src/screens/Profile/PaymentInfoScreen.tsx`
  - load cards from `PaymentRepository.getCards`
- `src/screens/Profile/AddCardScreen.tsx`
  - add card via `PaymentRepository.addCard`

### Payment API and types

- `src/services/payment/paymentService.api.ts`
- `src/services/payment/payment.types.ts`
- `src/services/payment/index.ts`

### Repository for card tokenization/saved card charge

- `src/data/payment/index.ts`
- `src/data/payment/types.ts`

## 4) Runtime Flow (Current)

Entry point:

- `BookingScreenView` -> `mutationFn`

Steps:

1. Calculate total amount from nights.
2. If `card + saved`:
   - require selected `cardId`
   - call `PaymentRepository.chargeSavedCard(...)`
   - require `status === 'paid'`
3. If LiqPay flow:
   - call `paymentService.createPayment(...)`
   - if `redirectUrl`, open with `Linking.openURL`
   - wait app to return foreground
   - if hold: `confirmHold`
   - poll `getStatus` (up to 15 attempts x 2s)
   - treat `paid` as success, `failed/cancelled` as error
4. Only after successful payment call `bookingService.create(...)`.

## 5) Security Notes (Important)

Current model allows `token?: string` in `PaymentCard`:

- `src/data/payment/types.ts`
- mapped from backend in `src/data/payment/index.ts`

Target security posture:

- do not expose reusable payment token to mobile client
- keep only `cardId`, `masked PAN`, `brand`, `last4`, `expiry` on client
- perform token operations only on backend
- verify user ownership and payment signature server-side

## 6) Recovery Plan After Partner Merge

If payment integration is overwritten:

1. Restore service layer:
   - `src/services/payment/*`
2. Restore repository layer:
   - `src/data/payment/*`
3. Restore booking integration:
   - `src/components/Booking/BookingPaymentMethod.tsx`
   - `src/components/Bookings/BookingScreenView.tsx`
4. Restore profile card screens:
   - `src/screens/Profile/PaymentInfoScreen.tsx`
   - `src/screens/Profile/AddCardScreen.tsx`
5. Restore endpoint definitions:
   - payment section in `src/config/endpoints.ts`
6. Verify navigation routes exist:
   - `PaymentInfo`, `AddCard` in `src/navigation/RootNavigator.tsx`

## 7) Quick Verification Checklist

1. Open booking screen and choose `Card`.
2. Toggle between `Saved card` and `LiqPay`.
3. Saved card path:
   - select existing card
   - complete booking without redirect
4. LiqPay path:
   - press booking CTA
   - app opens payment URL
   - return to app
   - status resolves to `paid` and booking is created
5. Profile -> Payment Info:
   - cards list loads
6. Add Card:
   - card is tokenized and appears in list

## 8) Recommended Backup Commands Before Any Overwrite

From `mobile-app`:

```bash
git switch -c codex/payment-backup
git add src/services/payment src/data/payment \
  src/components/Bookings/BookingScreenView.tsx \
  src/components/Booking/BookingPaymentMethod.tsx \
  src/screens/Profile/AddCardScreen.tsx \
  src/screens/Profile/PaymentInfoScreen.tsx \
  src/config/endpoints.ts src/config/constants.ts
git commit -m "backup: payment + liqpay integration"
git format-patch -1 HEAD --stdout > /tmp/payment-backup.patch
```

Re-apply later:

```bash
git apply /tmp/payment-backup.patch
```

# Mobile App — Rental Service (DIPLOMA)

Мобільний застосунок для сервісу оренди житла, розроблений на **React Native (Expo)** з підтримкою двох ролей користувачів:

- **Орендар (User)**
- **Орендодавець (Owner)**

Проєкт реалізовано з акцентом на масштабовану UI-архітектуру та чітке розділення відповідальності між шарами застосунку.

На поточному етапі застосунок працює на mock-даних з можливістю швидкого переходу на реальний API.

## Технологічний стек

- React Native (Expo)
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- Zustand + SecureStore (авторизація, роль, тема)
- React Query (завантаження даних, кешування, синхронізація)
- Axios (HTTP-клієнт)
- react-hook-form + yup (форми та валідація)
- Власний i18n-шар (`src/i18n`)
- Light / Dark тема на базі design tokens

## UI-архітектура

Проєкт використовує строгий підхід до побудови UI з розділенням логіки екрану та візуального представлення.

### Screens (`src/screens`)

Screens виконують роль **оркестраторів сторінок**.

Відповідальність:

- навігація
- підключення даних (React Query, stores)
- обробка screen-level стану
- передача props у View
- обгортка `ScreenContainer`

Screens **не містять**:

- UI-примітивів (`Text`, `Pressable`, `TouchableOpacity`)
- стилів
- `useTheme`
- бізнес-логіки
- анімацій

### Views (`src/components/**/**ScreenView.tsx`)

View-компоненти містять **весь візуальний шар**.

Відповідальність:

- layout та стилі
- робота з темою
- анімації
- користувацькі взаємодії
- локалізовані тексти (`t('...')`)

Такий підхід забезпечує:

- чисті та компактні screens
- високу переюзабельність UI
- контрольований рефакторинг
- стабільну еволюцію дизайну

## Структура проєкту

src/
├─ api HTTP-клієнт (axios, interceptors)
├─ assets Зображення та іконки
├─ components Feature-компоненти та ScreenView
├─ config Конфігурація, флаги, API-ендпоинти
├─ hooks Кастомні React-хуки
├─ i18n Локалізація
├─ navigation Навігація та Routes
├─ screens Тонкі wrapper-екрани
├─ services API-сервіси (mock / real)
├─ store Zustand-стори
├─ theme Design tokens та теми
├─ types Глобальні TypeScript-типи
├─ ui Базові UI-примітиви
└─ utils Допоміжні функції

## Реалізований функціонал

### Орендар (User)

- пошук об’єктів (місто, дати, гості)
- перегляд деталей об’єкта
- створення бронювання
- список бронювань (активні / минулі)
- збережені об’єкти
- повідомлення
- профіль користувача

### Орендодавець (Owner)

- dashboard власника
- список об’єктів
- створення та редагування об’єктів
- бронювання по об’єктах

## Mock-режим та підготовка до API

- Флаг: `src/config/constants.ts` → `USE_MOCKS`
- Всі ендпоинти описані в `src/config/endpoints.ts`
- Сервіси автоматично перемикаються між mock / real

### Підключення реального API

EXPO_PUBLIC_API_URL=https://demo.odelya.app
EXPO_PUBLIC_USE_MOCKS=false

## Запуск проєкту

cd mobile-app
npm install
npm run typecheck
npm run lint
USE_MOCKS=true npm run start

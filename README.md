# Mobile App (DIPLOMA)

Реализованная мобильная часть (React Native + Expo) с поддержкой двух ролей — Арендатор (User) и Арендодатель (Owner). Сейчас работает на моках с флагом `USE_MOCKS=true` и готова к переключению на реальные API через `ENDPOINTS` / `USE_MOCKS`.

## Стек и архитектура

- React Native (Expo), React Navigation (stack + tabs)
- Zustand + SecureStore (auth, роль, тема), React Query (данные/кеш)
- Axios-клиент (`src/api/client`), конфиг `API_BASE_URL`, флаг `USE_MOCKS`
- Формы: react-hook-form + yup, общие компоненты `FormContainer`/`FormField`
- Темы: `useThemeColors` + хранилище `themeStore` (light/dark)
- UI: ChipSelect, Skeleton, OfferCard/BookingCard, кеш изображений
- Структура `/src`: api, components, hooks, navigation, screens, services, store, theme, types, utils
- Эндпоинты вынесены в `src/config/endpoints.ts`

## Соответствие ТЗ (реализовано на моках)

- Роли: хранение/переключение user/owner, разные табы, мок-JWT при смене роли
- User:
  - Поиск объектов с фильтрами (город/категории/удобства/даты/гости/сортировка)
  - Просмотр деталей объекта (галерея, описание, удобства)
  - Создание брони из деталей, список броней с отменой и деталями
  - Профиль: просмотр/редактирование имени/email/языка, переключение роли, тема
- Owner:
  - Список своих объектов, создание/редактирование/удаление, выбор фото из галереи, выбор удобств
  - Список бронирований по объектам с фильтром по объекту
- Пуши: получение токена (expo-notifications), переход по пушу на объект/бронь (через navigationRef)
- Скелетоны и плавные появления карточек/чипов для UX
- Моки данных и сервисы переключаются флагом `USE_MOCKS`

## Переключение моков / подготовка к API

- Флаг: `src/config/constants.ts` → `USE_MOCKS` (по умолчанию true)
- Все URL заданы в `src/config/endpoints.ts`
- Сервисы (authService, offerService, bookingService, notificationService) используют `ENDPOINTS.*` и оборачивают логику мок/реал
- При появлении контрактов: задать `EXPO_PUBLIC_API_URL` и `EXPO_PUBLIC_USE_MOCKS=false`

## Структура основных экранов

- AuthStack: Login, Register
- AppStack: табы по роли (UserTabs: Поиск/Брони/Профиль; OwnerTabs: Объекты/Бронирования/Профиль)
- OfferDetails: просмотр + форма бронирования
- OwnerObjectForm: создание/редактирование объекта, загрузка фото, удобства-чипы
- Bookings/OwnerBookings: списки с отменой/фильтрами + скелетоны
- Profile: редактирование профиля, переключение роли/темы

## Запуск (моки)

```bash
cd mobile-app
# 1) Установить зависимости
npm install

# 2) Быстрый статический прогон
npm run typecheck

# 3) Запустить (моки остаются включёнными)
USE_MOCKS=true npm run start
# или единым шагом на эмулятор:
USE_MOCKS=true CI=1 ./node_modules/.bin/expo run:android --variant debug --port 8082
```

## Сборка Android (debug)

```bash
cd mobile-app/android
./gradlew :app:assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Как переключить на реальные API

1. Настроить переменные среды: `EXPO_PUBLIC_API_URL=https://api-gateway.example.com` и `EXPO_PUBLIC_USE_MOCKS=false`
2. Убедиться, что контракты совпадают с моделями `types/index.ts` (User, Offer, Booking)
3. Запустить `npm install` (при наличии сети), затем `npm run start` или `expo run:android`

## Полезные файлы

- `src/config/constants.ts` — флаг моков, базовый URL
- `src/config/endpoints.ts` — все используемые пути API
- `src/services/*.ts` — клиентские сервисы с мок-логикой
- `src/store/authStore.ts` — авторизация, роль, SecureStore
- `src/store/themeStore.ts` — тема light/dark
- `src/components` — Form, ChipSelect, Skeleton, Cards
- `src/screens` — основные экраны (Auth, Home, Offer, Bookings, Owner, Profile)

## Примечания

- Пуши работают через `expo-notifications` (в моках только регистрация/логирование токена); переходы по пушу доступны при наличии авторизации.
- Все формы используют общие компоненты и тему; интерактивные элементы имеют анимации нажатия/появления.
- При интеграции с backend: убрать моки, подключить реальные данные, проверить ошибки/валидацию под ответы API.
- Если Metro предупреждает про recrawl от Watchman, выполните:
  - `watchman watch-del '/Users/yuliia9009/DIPLOMA/mobile-app' ; watchman watch-project '/Users/yuliia9009/DIPLOMA/mobile-app'`

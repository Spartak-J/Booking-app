export const ENDPOINTS = {
  auth: {
    login: '/User/login',
    google: '/User/google',
    register: '/User/register/client',
    registerOwner: '/User/register/owner',
    reset: '/User/me/change-password',
  },
  user: {
    me: (lang: string) => `/User/me/${lang}`,
    myOrders: (lang: string) => `/User/me/orders/${lang}`,
    byId: (id: string | number) => `/User/get/${id}`,
    all: '/User/get-all',
    update: '/User/me/update',
    historyOffers: (lang: string) => `/Bff/me/offers/history/${lang}`,
    myOffers: (lang: string) => `/User/me/offers/${lang}`,
    addFavoriteOffer: (offerId: string | number) => `/Bff/favorites/offer/${offerId}`,
  },
  offers: {
    searchShort: (lang: string) => `/Bff/search/offers/${lang}`,
    searchPublic: (lang: string) => `/Bff/search/offers/${lang}`,
    fullById: (id: string | number, lang: string) => `/Bff/search/booking-offer/${id}/${lang}`,
    allRaw: '/Offer/get-all',
  },
  params: {
    categories: (lang: string) => `/Bff/params/category/${lang}`,
    items: (lang: string) => `/Bff/paramitem/${lang}`,
  },
  locations: {
    cities: (lang: string) => `/get/cities/${lang}`,
    cityTranslations: (lang: string) => `/Bff/city/get-all-translations/${lang}`,
  },
  attractions: {
    byCity: (cityId: string | number, lang: string) =>
      `/Bff/attractions/get/byCityId/${cityId}/${lang}`,
    byId: (id: string | number, lang: string) => `/Bff/attractions/get/${id}/${lang}`,
  },
  booking: {
    create: (lang: string) => `/Bff/create/booking-order/${lang}`,
    byOffer: (offerId: string | number, lang: string) => `/Bff/offer/${offerId}/orders/${lang}`,
    updateStatus: (orderId: string | number) => `/Bff/update_status/booking/${orderId}`,
    all: '/Order/get-all',
    byId: (id: string | number) => `/Order/get/${id}`,
  },
  reviews: {
    byOffer: (offerId: string | number, lang: string) =>
      `/Bff/offer/${offerId}/reviews/get/${lang}`,
    byUser: (lang: string) => `/Bff/me/reviews/get/${lang}`,
    create: (orderId: string | number) => `/Bff/user/orders/${orderId}/reviews/create`,
    update: (orderId: string | number, reviewId: string | number, lang: string) =>
      `/Bff/me/${orderId}/reviews/update/${reviewId}/${lang}`,
    delete: (userId: string | number, orderId: string | number, reviewId: string | number) =>
      `/Bff/me/${userId}/${orderId}/reviews/delete/${reviewId}`,
  },
  notifications: {
    register: '/notifications/register',
  },
  payment: {
    create: '/Bff/payments/create',
    confirmHold: '/Bff/payments/confirm-hold',
    status: (paymentId: string) => `/Bff/payments/status/${paymentId}`,
    tokenize: '/Bff/payments/tokenize',
    tokenizeStart: '/Bff/payments/tokenize/start',
    tokenizeStatus: (paymentId: string) => `/Bff/payments/tokenize/status/${paymentId}`,
    cards: (userId: string) => `/Bff/payments/cards/${userId}`,
    chargeSavedCard: '/Bff/payments/charge-saved-card',
  },
  currency: {
    rates: '/Bff/currency/rates',
  },
  admin: {
    health: '/Bff/admin/health',
  },
};

export const ENDPOINTS = {
  auth: {
    login: '/User/login',
    register: '/User/register/client',
    reset: '/User/me/change-password',
  },
  user: {
    me: (lang: string) => `/User/me/${lang}`,
    byId: (id: string | number) => `/User/get/${id}`,
    all: '/User/get-all',
    update: '/User/me/update',
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
    cities: '/Location/get-all-cities',
    cityTranslations: (lang: string) => `/Bff/city/get-all-translations/${lang}`,
  },
  booking: {
    create: '/Bff/create/booking-order',
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
};

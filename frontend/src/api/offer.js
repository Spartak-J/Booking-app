import http from "./http";


export const offerApi = {
  createOffer: ({ formData, lang }) => {
    return http.post(`/Bff/create/booking-offer?lang=${encodeURIComponent(lang ?? '')}`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  createOfferImg: ({ formData, offerId }) =>
    http.post(`/Bff/img/booking-offer/${offerId}/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateOffer: ({ formData, lang }) => {
    return http.post(`/Bff/update/booking-offer?lang=${encodeURIComponent(lang ?? '')}`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  searchOffers: ({ startDate, endDate, guests, userDiscountPercent, lang, cityId, paramItemFilters }) => {

    const startIso = new Date(startDate).toISOString();
    const endIso = new Date(endDate).toISOString();

    const params = new URLSearchParams({
      CityId: cityId.toString(),
      StartDate: startIso,
      EndDate: endIso,
      Guests: guests.toString(),
      userDiscountPercent: (userDiscountPercent || 0).toString(),
      paramItemFilters: JSON.stringify(paramItemFilters || {}) // всегда передаём строку
    });

    return http.get(`/Bff/search/offers/${lang}?${params.toString()}`);
  },


  searchId: ({ id, startDate, endDate, guests, userDiscountPercent, lang }) => {
    const params = new URLSearchParams({
      StartDate: startDate,   // ВАЖНО: PascalCase
      EndDate: endDate,
      Guests: guests.toString(),
      userDiscountPercent: userDiscountPercent.toString(),
    });

    return http.get(
      `/Bff/search/booking-offer/${id}/${lang}?${params.toString()}`
    );
  }
}

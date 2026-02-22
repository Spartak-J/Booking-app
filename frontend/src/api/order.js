import http from "./http";

export const orderApi = {

createOrder: ({ formData, lang }) => {

  return http.post(`/Bff/create/booking-order/${encodeURIComponent(lang ?? '')}`, formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
},


 getByOfferId: (offerId, lang) => http.get(`/Bff/offer/${offerId}/orders/${lang}`),

  getAll: () => http.get("/Order/get-all"),
  getById: (id) => http.get(`/Order/get/${id}`),
  create: (data) => http.post("/Order/create", data),
  update: (id, data) => http.put(`/Order/update/${id}`, data),
  delete: (id) => http.delete(`/Order/del/${id}`),
};

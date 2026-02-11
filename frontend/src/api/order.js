import http from "./http";

export const orderApi = {

createOrder: ({ formData, lang }) => {
  // lang идет как часть пути, а не query
  return http.post(`/Bff/create/booking-order/${encodeURIComponent(lang ?? '')}`, formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
},


  getAll: () => http.get("/Order/get-all"),
  getById: (id) => http.get(`/Order/get/${id}`),
  create: (data) => http.post("/Order/create", data),
  update: (id, data) => http.put(`/Order/update/${id}`, data),
  delete: (id) => http.delete(`/Order/del/${id}`),
};

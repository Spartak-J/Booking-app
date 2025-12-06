export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    reset: '/auth/reset-password',
  },
  user: (id: string) => `/user/${id}`,
  rent: {
    list: '/rentobj/get-all',
    byId: (id: string) => `/rentobj/get/${id}`,
    create: '/rentobj',
    update: (id: string) => `/rentobj/${id}`,
    delete: (id: string) => `/rentobj/${id}`,
  },
  booking: {
    create: '/order/create',
    user: (id: string) => `/order/user/${id}`,
    owner: (id: string) => `/order/owner/${id}`,
    byId: (id: string) => `/order/${id}`,
    delete: (id: string) => `/order/${id}`,
  },
  notifications: {
    register: '/notifications/register',
  },
};

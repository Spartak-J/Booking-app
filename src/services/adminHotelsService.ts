import { offersAdminService, type AdminOffer } from '@/services/admin';

// Backward-compatible alias. New code should use offersAdminService/AdminOffer.
export type AdminHotel = AdminOffer;
export const adminHotelsService = offersAdminService;

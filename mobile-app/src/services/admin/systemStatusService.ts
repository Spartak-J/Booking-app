import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';

export type AdminServiceStatus = {
  id: string;
  name: string;
  category?: 'db' | 'bff' | 'rabbit' | 'payments' | 'logs' | string;
  status: 'ok' | 'degraded' | 'down' | 'unknown';
  message?: string | null;
  latencyMs?: number;
};

export type AdminHealthResponse = {
  checkedAt: string;
  services: AdminServiceStatus[];
};

export const systemStatusService = {
  getStatus: async (): Promise<AdminHealthResponse> => {
    const { data } = await apiClient.get<AdminHealthResponse>(ENDPOINTS.admin.health);
    return data;
  },
};

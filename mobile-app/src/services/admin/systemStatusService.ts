import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';

export type SystemStatusLevel = 'ok' | 'warning' | 'degraded' | 'down' | 'unknown';

export type SystemStatusItem = {
  id: string;
  name: string;
  status: SystemStatusLevel;
  message?: string;
  latencyMs?: number;
};

export type SystemStatusResponse = {
  checkedAt: string;
  items: SystemStatusItem[];
};

const fallbackItems: SystemStatusItem[] = [
  { id: 'db', name: 'PostgreSQL', status: 'unknown' },
  { id: 'gateway', name: 'API Gateway', status: 'unknown' },
  { id: 'user', name: 'User API', status: 'unknown' },
  { id: 'offer', name: 'Offer API', status: 'unknown' },
  { id: 'order', name: 'Order API', status: 'unknown' },
  { id: 'payment', name: 'Payment API', status: 'unknown' },
  { id: 'review', name: 'Review API', status: 'unknown' },
  { id: 'translation', name: 'Translation API', status: 'unknown' },
];

const normalizeStatus = (value?: string): SystemStatusLevel => {
  if (!value) return 'unknown';
  const normalized = value.toLowerCase();
  if (['ok', 'healthy', 'up'].includes(normalized)) return 'ok';
  if (['warn', 'warning'].includes(normalized)) return 'warning';
  if (['degraded', 'slow'].includes(normalized)) return 'degraded';
  if (['down', 'error', 'failed'].includes(normalized)) return 'down';
  return 'unknown';
};

const mapItems = (raw: any[]): SystemStatusItem[] =>
  raw
    .filter(Boolean)
    .map((item) => ({
      id: String(item.id ?? item.name ?? item.service ?? Math.random()),
      name: String(item.name ?? item.service ?? 'Service'),
      status: normalizeStatus(item.status ?? item.state),
      message: item.message ? String(item.message) : undefined,
      latencyMs:
        typeof item.latencyMs === 'number'
          ? item.latencyMs
          : typeof item.latency === 'number'
            ? item.latency
            : undefined,
    }));

export const systemStatusService = {
  getStatus: async (): Promise<SystemStatusResponse> => {
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.admin.health);
      const items = Array.isArray(data)
        ? mapItems(data)
        : Array.isArray(data?.services)
          ? mapItems(data.services)
          : Array.isArray(data?.data)
            ? mapItems(data.data)
            : [];

      return {
        checkedAt: data?.checkedAt ?? data?.timestamp ?? new Date().toISOString(),
        items: items.length ? items : fallbackItems,
      };
    } catch (error) {
      console.warn('[systemStatusService.getStatus] fallback to defaults', error);
      return { checkedAt: new Date().toISOString(), items: fallbackItems };
    }
  },
};

export default systemStatusService;

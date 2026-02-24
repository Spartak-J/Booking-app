import axios from 'axios';

const DEFAULT_ERROR_MESSAGE = 'Сервис временно недоступен. Попробуйте снова.';

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: string; title?: string; errors?: Record<string, string[] | string> }
      | string
      | undefined;

    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.title) return data.title;
      if (data.errors && typeof data.errors === 'object') {
        const flat = Object.entries(data.errors)
          .flatMap(([field, value]) => {
            const items = Array.isArray(value) ? value : [String(value)];
            return items.map((item) => `${field}: ${item}`);
          })
          .filter(Boolean);
        if (flat.length > 0) return flat.join('\n');
      }
    }

    if (status === 404) return 'Данные не найдены.';
    if (status && status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const toUserFacingApiError = (error: unknown, fallback?: string) =>
  new Error(getApiErrorMessage(error, fallback));

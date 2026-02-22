import axios from 'axios';

const DEFAULT_ERROR_MESSAGE = 'Сервис временно недоступен. Попробуйте снова.';

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: string; title?: string }
      | string
      | undefined;

    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.title) return data.title;
    }

    if (status === 404) return 'Данные не найдены.';
    if (status && status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const toUserFacingApiError = (error: unknown, fallback?: string) =>
  new Error(getApiErrorMessage(error, fallback));

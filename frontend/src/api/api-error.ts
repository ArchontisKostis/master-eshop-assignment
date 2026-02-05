import axios, { type AxiosError } from 'axios';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}

export const isApiErrorPayload = (data: unknown): data is ApiError => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const payload = data as Partial<ApiError>;

  return (
    typeof payload.status === 'number' &&
    typeof payload.error === 'string' &&
    typeof payload.code === 'string' &&
    typeof payload.message === 'string'
  );
};

export const getApiErrorFromAxiosError = (error: AxiosError | any): ApiError | null => {
  if (!axios.isAxiosError(error) || !error.response) {
    return null;
  }

  // If a parsed ApiError was already attached by an interceptor, prefer that.
  const attached = (error as any).apiError;
  if (attached && isApiErrorPayload(attached)) {
    return attached;
  }

  const data = error.response.data;

  if (isApiErrorPayload(data)) {
    return data;
  }

  // Backwards compatibility: older responses might only contain a message
  if (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string') {
    const message = (data as any).message as string;

    return {
      timestamp: new Date().toISOString(),
      status: error.response.status ?? 0,
      error: error.response.statusText || 'Error',
      code:
        typeof (data as any).code === 'string'
          ? (data as any).code
          : error.response.status === 500
          ? 'InternalServerError'
          : 'UnknownError',
      message,
      path:
        (error.response.config && 'url' in error.response.config
          ? String((error.response.config as any).url)
          : '') || '',
    };
  }

  return null;
};

/**
 * Asynchronously extract an ApiError from an Axios error.
 * This is able to parse JSON bodies even when the responseType is "blob".
 */
export const getApiErrorAsync = async (error: unknown): Promise<ApiError | null> => {
  if (!axios.isAxiosError(error) || !error.response) {
    return null;
  }

  // If an ApiError is already attached (e.g. by a previous interceptor), reuse it.
  const attached = (error as any).apiError;
  if (attached && isApiErrorPayload(attached)) {
    return attached;
  }

  const { data, status, statusText, config } = error.response;

  // Normal JSON payload that already matches our ApiError shape
  if (isApiErrorPayload(data)) {
    return data;
  }

  // Backwards compatibility: objects that only contain a message (and maybe a code)
  if (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string') {
    const message = (data as any).message as string;

    return {
      timestamp: new Date().toISOString(),
      status: status ?? 0,
      error: statusText || 'Error',
      code:
        typeof (data as any).code === 'string'
          ? (data as any).code
          : status === 500
          ? 'InternalServerError'
          : 'UnknownError',
      message,
      path: (config && 'url' in config ? String((config as any).url) : '') || '',
    };
  }

  // If the backend responded with a Blob (common when using generated clients with responseType "blob"),
  // try to decode it as JSON and extract an ApiError or at least a message.
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);

      if (isApiErrorPayload(parsed)) {
        return parsed;
      }

      if (parsed && typeof parsed === 'object' && 'message' in parsed && typeof (parsed as any).message === 'string') {
        const message = (parsed as any).message as string;

        return {
          timestamp: new Date().toISOString(),
          status: status ?? 0,
          error: statusText || 'Error',
          code:
            typeof (parsed as any).code === 'string'
              ? (parsed as any).code
              : status === 500
              ? 'InternalServerError'
              : 'UnknownError',
          message,
          path: (config && 'url' in config ? String((config as any).url) : '') || '',
        };
      }
    } catch {
      // Ignore parse errors and fall through to generic error
    }
  }

  // Generic fallback when we can't see a structured payload.
  return {
    timestamp: new Date().toISOString(),
    status: status ?? 0,
    error: statusText || 'Error',
    code: status === 500 ? 'InternalServerError' : 'UnknownError',
    message: '',
    path: (config && 'url' in config ? String((config as any).url) : '') || '',
  };
};

/**
 * Safely extract an ApiError from any thrown error.
 */
export const getApiError = (error: unknown): ApiError | null => {
  return getApiErrorFromAxiosError(error as AxiosError);
};

/**
 * Convenience helper to get a user‑facing message from an error.
 * Falls back to the provided default if no ApiError/message is available.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  const apiError = getApiError(error);
  if (apiError?.message) {
    return apiError.message;
  }

  if (axios.isAxiosError(error)) {
    const responseMessage = (error.response?.data as any)?.message;
    if (typeof responseMessage === 'string' && responseMessage.length > 0) {
      return responseMessage;
    }
  }

  return fallback;
};


/**
 * Small helpers for working with Axios responses that use `responseType: 'blob'`.
 *
 * Our generated API clients currently return `AxiosResponse<Blob>` even when the
 * payload is JSON. These helpers decode the Blob into typed JSON so the rest
 * of the app can work with proper TypeScript types without modifying the
 * generated orval code.
 */

/**
 * Parse a JSON payload from a Blob (or already-parsed value) into type T.
 *
 * - If `data` is a Blob, it is decoded as UTF‑8 text and `JSON.parse`d.
 * - If `data` is not a Blob, it is returned as‑is and just asserted to T.
 */
export const parseJsonFromBlob = async <T>(data: Blob | T): Promise<T> => {
  if (data instanceof Blob) {
    const text = await data.text();

    // If there is no body, return null/undefined as‑is to avoid JSON.parse errors.
    if (!text || text.trim().length === 0) {
      return null as unknown as T;
    }

    return JSON.parse(text) as T;
  }

  return data as T;
};


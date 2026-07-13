import { ApiErrorResponse } from '@flowstate/shared';

export class ResponseHandler {
  public static async parse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;
      try {
        errorData = await response.json();
      } catch {
        // Fallback if not JSON
      }
      const message = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`[ApiClient Error] ${message}`);
    }

    return (await response.json()) as T;
  }
}

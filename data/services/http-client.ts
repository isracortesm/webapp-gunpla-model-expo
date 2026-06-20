import { logHttpRequest, logHttpResponse, logHttpError } from '@/shared/utils/http-debug';
import { ApplicationError } from '@/domain/entities/error/application-error';

const HOST_URI = process.env.NEXT_PUBLIC_HOST_URI || '';

export class HttpService {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = HOST_URI, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Handles HTTP response parsing exactly once.
   * Parses the body using clone().json() and reuses it for logging, error creation, and successful responses.
   */
  private async _handleResponse<T>(response: Response): Promise<T> {
    let responseBody: unknown | undefined;

    try {
      responseBody = await response.clone().json();
    } catch {
      // ignore parse errors for non-JSON responses
    }

    logHttpResponse(
      response.status,
      Date.now() - ((response as Response & { _startTime?: number })._startTime ?? 0),
      Object.fromEntries(response.headers.entries()),
      responseBody,
    );

    if (!response.ok) {
      const error = ApplicationError.fromResponse(response.status, responseBody);
      logHttpError(error.status, error.message);
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string, params?: Record<string, string | string[]>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;

    if (params && Object.keys(params).length > 0) {
      const queryStringParts: string[] = [];

      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          // Strapi v4 expects multiple params for arrays (e.g., populate=image&populate=category)
          for (const item of value) {
            queryStringParts.push(`${key}=${encodeURIComponent(item)}`);
          }
        } else {
          queryStringParts.push(`${key}=${encodeURIComponent(value)}`);
        }
      }

      url += `?${queryStringParts.join('&')}`;
    }

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    logHttpRequest('GET', url, headers);
    const startTime = Date.now();
    const response = await fetch(url, { headers });
    (response as Response & { _startTime?: number })._startTime = startTime;

    return this._handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    logHttpRequest('POST', url, headers, body);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    (response as Response & { _startTime?: number })._startTime = startTime;

    return this._handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    logHttpRequest('PUT', url, headers, body);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    (response as Response & { _startTime?: number })._startTime = startTime;

    return this._handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    logHttpRequest('DELETE', url, headers);
    const startTime = Date.now();
    const response = await fetch(url, { headers });
    (response as Response & { _startTime?: number })._startTime = startTime;

    return this._handleResponse<T>(response);
  }
}

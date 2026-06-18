import { logHttpRequest, logHttpResponse, logHttpError } from '@/shared/utils/http-debug';
import { ApplicationError } from '@/domain/entities/error/application-error';

const HOST_URI = process.env.NEXT_PUBLIC_HOST_URI || '';

export class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = HOST_URI) {
    this.baseUrl = baseUrl;
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

    logHttpRequest('GET', url, { 'Accept': 'application/json' });
    const startTime = Date.now();
    const response = await fetch(url);
    const elapsed = Date.now() - startTime;
    
    let responseBody: unknown | undefined;
    try {
      responseBody = await response.clone().json();
    } catch {
      // ignore parse errors for non-JSON responses
    }
    
    logHttpResponse(response.status, elapsed, Object.fromEntries(response.headers.entries()), responseBody);

    if (!response.ok) {
      let errorMessage: string;
      
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = ApplicationError.fromResponse(response.status, await response.clone().json());
      logHttpError(error.status, error.message);
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    logHttpRequest('POST', url, { 'Content-Type': 'application/json' }, body);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const elapsed = Date.now() - startTime;
    
    let responseBody: unknown | undefined;
    try {
      responseBody = await response.clone().json();
    } catch {
      // ignore parse errors for non-JSON responses
    }
    
    logHttpResponse(response.status, elapsed, Object.fromEntries(response.headers.entries()), responseBody);

    if (!response.ok) {
      let errorMessage: string;

      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = ApplicationError.fromResponse(response.status, await response.clone().json());
      logHttpError(error.status, error.message);
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    logHttpRequest('PUT', url, { 'Content-Type': 'application/json' }, body);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const elapsed = Date.now() - startTime;

    let responseBody: unknown | undefined;
    try {
      responseBody = await response.clone().json();
    } catch {
      // ignore parse errors for non-JSON responses
    }

    logHttpResponse(response.status, elapsed, Object.fromEntries(response.headers.entries()), responseBody);

    if (!response.ok) {
      let errorMessage: string;

      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = ApplicationError.fromResponse(response.status, await response.clone().json());
      logHttpError(error.status, error.message);
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    logHttpRequest('DELETE', url, { 'Accept': 'application/json' });
    const startTime = Date.now();
    const response = await fetch(url);
    const elapsed = Date.now() - startTime;

    let responseBody: unknown | undefined;
    try {
      responseBody = await response.clone().json();
    } catch {
      // ignore parse errors for non-JSON responses
    }

    logHttpResponse(response.status, elapsed, Object.fromEntries(response.headers.entries()), responseBody);

    if (!response.ok) {
      let errorMessage: string;

      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = ApplicationError.fromResponse(response.status, await response.clone().json());
      logHttpError(error.status, error.message);
      throw error;
    }

    return response.json() as Promise<T>;
  }
}

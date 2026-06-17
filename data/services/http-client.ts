const BASE_URL = process.env.BASE_URL || '';

export class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
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

    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage: string;
      
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage: string;

      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }
}

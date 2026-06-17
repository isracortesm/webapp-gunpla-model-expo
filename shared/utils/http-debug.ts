const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

export function logHttpRequest(method: string, url: string, headers?: Record<string, string>, body?: unknown): void {
  if (!isDebugEnabled) return;

  console.group(`%cHTTP ${method}`, 'color: blue; font-weight: bold', url);

  if (headers && Object.keys(headers).length > 0) {
    console.log('%cHeaders:', 'color: green;', headers);
  }

  if (body !== undefined) {
    console.log('%cBody:', 'color: green;', JSON.stringify(body, null, 2));
  }

  console.groupEnd();
}

export function logHttpResponse(status: number, elapsedMs: number, headers?: Record<string, string>, body?: unknown): void {
  if (!isDebugEnabled) return;

  const statusColor = status >= 400 ? 'color: red;' : 'color: green;';
  console.group(`%cHTTP ${status} (${elapsedMs}ms)`, `${statusColor}; font-weight: bold`);

  if (headers && Object.keys(headers).length > 0) {
    console.log('%cHeaders:', 'color: green;', headers);
  }

  if (body !== undefined) {
    console.log('%cBody:', 'color: green;', JSON.stringify(body, null, 2));
  }

  console.groupEnd();
}

export function logHttpError(status: number, errorMessage: string): void {
  if (!isDebugEnabled) return;

  console.error(`%cHTTP ${status} Error`, 'color: red; font-weight: bold;', errorMessage);
}

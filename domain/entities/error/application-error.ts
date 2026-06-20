export interface ApplicationErrorDetails {
  [key: string]: unknown;
}

export class ApplicationError extends Error {
  public readonly status: number;
  public readonly name: string;
  public readonly details: ApplicationErrorDetails;

  constructor(status: number, message: string, name: string = 'ApplicationError', details: ApplicationErrorDetails = {}) {
    super(message);
    this.name = name;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new Error().constructor.prototype);
  }

  static fromResponse(status: number, body: unknown): ApplicationError {
    if (body && typeof body === 'object' && 'error' in body) {
      const errorBody = (body as Record<string, unknown>).error as Record<string, unknown> | undefined;
      
      if (errorBody && 'message' in errorBody && typeof errorBody.message === 'string') {
        return new ApplicationError(
          status,
          errorBody.message,
          (errorBody.name as string) || 'ApplicationError',
          (errorBody.details as Record<string, unknown>) || {},
        );
      }
    }

    return new ApplicationError(status, `HTTP ${status}: Request failed`);
  }
}

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} ${id} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super(400, 'VALIDATION_ERROR', 'Request validation failed', details);
  }
}

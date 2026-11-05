import type { ErrorRequestHandler } from 'express';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

// All errors leave the API in one shape: { error: { code, message, details? } }
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    return;
  }
  logger.error('unhandled_error', { requestId: res.locals.requestId, err: String(err) });
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong' } });
};

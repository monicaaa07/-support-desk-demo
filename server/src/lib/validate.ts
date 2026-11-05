import type { ZodTypeAny, z } from 'zod';
import { ValidationError } from './errors.js';

/** Parse untrusted input with a zod schema; throws a 400 ValidationError on failure. */
export function validate<S extends ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input);
  if (!result.success) throw new ValidationError(result.error.flatten());
  return result.data;
}

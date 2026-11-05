export const config = {
  port: Number(process.env.PORT ?? 4000),
  logLevel: (process.env.LOG_LEVEL ?? 'info') as 'debug' | 'info' | 'warn' | 'error',
  maxPageSize: 100,
} as const;

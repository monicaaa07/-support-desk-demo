import { config } from '../config.js';

const levels = { debug: 10, info: 20, warn: 30, error: 40 } as const;
type Level = keyof typeof levels;

function log(level: Level, msg: string, meta: Record<string, unknown> = {}) {
  if (levels[level] < levels[config.logLevel]) return;
  if (process.env.NODE_ENV === 'test') return;
  // Structured JSON logs — one line per event, ready for a log shipper.
  console.log(JSON.stringify({ level, msg, time: new Date().toISOString(), ...meta }));
}

export const logger = {
  debug: (m: string, meta?: Record<string, unknown>) => log('debug', m, meta),
  info: (m: string, meta?: Record<string, unknown>) => log('info', m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => log('warn', m, meta),
  error: (m: string, meta?: Record<string, unknown>) => log('error', m, meta),
};

import { TranslatableField } from '@/api/types';

/**
 * Validates in DEV mode that a payload (JSON or FormData) contains required keys
 * and does not contain unexpected undefined values.
 */
export function validateDevPayload(
  resource: string,
  payload: FormData | Record<string, unknown> | object,
  requiredFields: string[]
): void {
  if (!import.meta.env.DEV) return;

  const presentKeys = new Set<string>();

  if (payload instanceof FormData) {
    payload.forEach((_, key) => {
      // Normalize bracket keys like 'title[ar]' to 'title'
      const baseKey = key.split('[')[0];
      presentKeys.add(baseKey);
      presentKeys.add(key);
    });
  } else if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        presentKeys.add(key);
      }
    });
  }

  const missing = requiredFields.filter((req) => !presentKeys.has(req));
  if (missing.length > 0) {
    console.warn(
      `⚠️ [Contract Warning] ${resource} payload is missing required field(s): ${missing.join(', ')}`,
      { payload, missing }
    );
  }
}

/**
 * Appends a translatable field ({ ar, en }) to FormData.
 * Guarantees that empty string optional translations are either omitted or normalized.
 */
export function appendTranslatable(
  fd: FormData,
  baseKey: string,
  field?: TranslatableField | null,
  options: { requiredAr?: boolean; requiredEn?: boolean } = {}
): void {
  if (!field) return;

  const ar = field.ar?.trim() || '';
  const en = field.en?.trim() || '';

  if (ar || options.requiredAr) {
    fd.append(`${baseKey}[ar]`, ar);
  }
  if (en || options.requiredEn) {
    fd.append(`${baseKey}[en]`, en);
  }
}

/**
 * Converts a boolean to '1' or '0' for FormData (Laravel convention).
 */
export function appendBoolean(fd: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  fd.append(key, value ? '1' : '0');
}

/**
 * Appends a primitive value if present and non-empty.
 */
export function appendPrimitive(fd: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  if (typeof value === 'string' && value.trim() === '') return;
  fd.append(key, String(value));
}

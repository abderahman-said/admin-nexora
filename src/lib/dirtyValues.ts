import { FieldValues, FormState } from 'react-hook-form';

/**
 * Fields that should never be sent in PATCH / update payloads.
 * Many backend endpoints prohibit immutable keys (e.g., Laravel returns 422 if slug or section_key is sent).
 */
export const UNEDITABLE_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'created_at',
  'updated_at',
  'last_login_at',
  'slug',
  'section_key',
  'ip_address',
]);

/**
 * Deep equality check comparing values, not object references.
 * Ensures that if a user changes a field and reverts it back to original value,
 * it is correctly treated as NOT changed.
 */
export function isEqualValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, i) => isEqualValue(item, b[i]));
    }
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) =>
      isEqualValue(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k]
      )
    );
  }

  return false;
}

/**
 * Returns ONLY the fields that the user actually changed in the form.
 *
 * Requirements satisfied:
 * - Uses react-hook-form's dirtyFields (formState.dirtyFields).
 * - Handles nested objects (e.g., translatable { ar, en }) and arrays:
 *   sends the full array/object if any part of it changed.
 * - Value comparison: A field changed and then changed back to original value is discarded.
 * - Excludes uneditable/read-only fields (id, slug, section_key, createdAt, updatedAt, etc.).
 * - Strips undefined values. Sends null only when intentionally cleared.
 * - Typed with TypeScript Partial<T>, no `any`.
 */
export function getDirtyValues<T extends FieldValues>(
  dirtyFields: FormState<T>['dirtyFields'],
  allValues: T,
  originalValues?: T
): Partial<T> {
  const dirtyPayload: Partial<T> = {};

  if (!dirtyFields || typeof dirtyFields !== 'object') {
    return dirtyPayload;
  }

  for (const key in dirtyFields) {
    if (!Object.prototype.hasOwnProperty.call(dirtyFields, key)) continue;
    if (UNEDITABLE_FIELDS.has(key)) continue;

    const isDirty = (dirtyFields as Record<string, unknown>)[key];
    if (!isDirty) continue;

    const currentValue = allValues[key];

    // Never include undefined values
    if (currentValue === undefined) continue;

    // Compare by value, not by reference. If reverted back, skip it.
    if (originalValues && isEqualValue(currentValue, originalValues[key])) {
      continue;
    }

    // Send the full object/array if any part of it changed
    dirtyPayload[key as keyof T] = currentValue;
  }

  return dirtyPayload;
}

/**
 * Checks if there are actual changes between dirty values or newly selected files.
 */
export function hasFormChanges<T extends FieldValues>(
  dirtyValues: Partial<T>,
  files?: Record<string, File | null | undefined>
): boolean {
  if (Object.keys(dirtyValues).length > 0) {
    return true;
  }
  if (files) {
    return Object.values(files).some((f) => f instanceof File);
  }
  return false;
}

/**
 * Creates a FormData payload for multipart PATCH updates, containing ONLY
 * the changed fields and any newly selected files.
 */
function appendToFormData(fd: FormData, prefix: string, val: unknown): void {
  if (val === undefined) return;
  if (val === null) {
    fd.append(prefix, '');
  } else if (typeof val === 'boolean') {
    fd.append(prefix, val ? '1' : '0');
  } else if (typeof val === 'number') {
    fd.append(prefix, String(val));
  } else if (typeof val === 'string') {
    fd.append(prefix, val);
  } else if (val instanceof File || val instanceof Blob) {
    fd.append(prefix, val);
  } else if (Array.isArray(val)) {
    val.forEach((item, index) => {
      appendToFormData(fd, `${prefix}[${index}]`, item);
    });
  } else if (typeof val === 'object') {
    for (const [subKey, subVal] of Object.entries(val as Record<string, unknown>)) {
      appendToFormData(fd, `${prefix}[${subKey}]`, subVal);
    }
  }
}

/**
 * Creates a FormData payload for multipart PATCH updates, containing ONLY
 * the changed fields and any newly selected files.
 */
export function createPatchFormData<T extends Record<string, unknown>>(
  dirtyValues: Partial<T>,
  files?: Record<string, File | null | undefined>
): FormData {
  const formData = new FormData();
  formData.append('_method', 'PATCH');

  for (const [key, value] of Object.entries(dirtyValues)) {
    if (value === undefined) continue;
    if (UNEDITABLE_FIELDS.has(key)) continue;

    appendToFormData(formData, key, value);
  }

  // Append new files only
  if (files) {
    for (const [key, file] of Object.entries(files)) {
      if (file instanceof File) {
        formData.append(key, file);
      }
    }
  }

  return formData;
}

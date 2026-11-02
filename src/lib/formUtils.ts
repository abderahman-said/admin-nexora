import { FieldErrors } from 'react-hook-form';
import toast from 'react-hot-toast';

export interface FormErrorDetail {
  name: string;
  message: string;
}

/**
 * Recursively find the first error message and field path from a React Hook Form errors tree.
 */
export function getFirstError(errors: FieldErrors | Record<string, unknown>, parentPath = ''): FormErrorDetail | null {
  if (!errors || typeof errors !== 'object') return null;

  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;

    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    // Check if this node is an error object with a message string
    if (typeof value === 'object' && value !== null) {
      if ('message' in value && typeof (value as { message?: unknown }).message === 'string' && (value as { message?: string }).message) {
        return {
          name: currentPath,
          message: (value as { message: string }).message,
        };
      }

      // If it's a nested object (e.g. title.en or parts[0].title)
      const nested = getFirstError(value as Record<string, unknown>, currentPath);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

/**
 * Handle form submission validation errors:
 * 1. Shows a clear toast notification with the error message.
 * 2. Emits a 'translatable-field-error' event so TranslatableInput can auto-switch language tabs.
 * 3. Smoothly scrolls to the first invalid field and focuses it.
 */
export function handleFormErrors(errors: FieldErrors, fallbackMessage?: string) {
  const firstError = getFirstError(errors);
  const message =
    firstError?.message ||
    fallbackMessage ||
    'يرجى إكمال جميع الحقول المطلوبة باللغتين العربية والإنجليزية قبل الحفظ.';

  toast.error(message);

  if (!firstError?.name) return;

  const fieldName = firstError.name;

  // 1. Notify TranslatableInput components to switch to the active tab for this field
  window.dispatchEvent(
    new CustomEvent('translatable-field-error', {
      detail: { name: fieldName },
    })
  );

  // 2. Allow tab visibility update to render, then scroll and focus
  const attemptFocus = (attempt = 0) => {
    // Find input element by name attribute
    let element: HTMLElement | null =
      (document.getElementsByName(fieldName)[0] as HTMLElement) ||
      document.querySelector(`[name="${fieldName}"]`);

    // If not found by name, try data-field attributes or container
    if (!element) {
      element =
        document.querySelector(`[data-field-name="${fieldName}"]`) ||
        document.querySelector(`[data-field-name-en="${fieldName}"]`) ||
        document.querySelector(`[data-field-name-ar="${fieldName}"]`);
    }

    if (element) {
      // If element is hidden (e.g. still animating or nested), try finding its parent container
      const container = element.closest('[data-translatable-container]') || element;
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Focus the input if possible
      setTimeout(() => {
        if (typeof element?.focus === 'function') {
          element.focus({ preventScroll: true });
        }
      }, 100);
    } else if (attempt < 3) {
      // Retry in next frame if tab animation / re-render is still in progress
      setTimeout(() => attemptFocus(attempt + 1), 80);
    }
  };

  requestAnimationFrame(() => attemptFocus(0));
}

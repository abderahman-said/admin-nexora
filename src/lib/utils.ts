import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | number | boolean | undefined | null)[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function getMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media === 'string') return media;
  if (typeof media === 'object' && media.url) return media.url;
  if (typeof media === 'object' && media.file_path) return media.file_path;
  return null;
}

/**
 * Standard regex for strict kebab-case:
 * - lowercase letters and numbers
 * - single hyphens between words
 * - no leading or trailing hyphens
 * - no consecutive hyphens
 */
export const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Converts text to a clean, valid kebab-case slug (max 100 chars).
 */
export function toKebabCase(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/**
 * Validates whether a slug matches strict kebab-case rules.
 */
export function isValidKebabCase(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return false;
  return KEBAB_CASE_REGEX.test(trimmed);
}

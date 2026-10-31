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

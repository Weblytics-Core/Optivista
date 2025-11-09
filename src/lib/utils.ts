import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Google Drive sharing URL into a direct image link.
 * If the URL is not a Google Drive link, it returns the original URL.
 * @param url The image URL to process.
 * @returns A direct image link for Google Drive images, or the original URL.
 */
export function processImageUrl(url: string): string {
  const googleDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(googleDriveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return url;
}

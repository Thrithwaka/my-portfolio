import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transforms a standard Google Drive sharing link into a direct link
 * that can be used directly in <img> or <video> tags.
 */
export function getDirectLink(url: string | undefined): string {
  if (!url) return '';
  
  // Hande Google Drive links
  if (url.includes('drive.google.com')) {
    // Standard link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Direct link format: https://drive.google.com/uc?export=view&id=FILE_ID
    const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  
  return url;
}

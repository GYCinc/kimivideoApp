import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format time in seconds to mm:ss display
 */
export function formatTimeDisplay(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time with milliseconds precision (mm:ss.ms)
 */
export function formatTimeWithMs(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00.0';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
}

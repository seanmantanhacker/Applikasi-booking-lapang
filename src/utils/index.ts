// ============================================================
// JIOS Padel & Coffee — Utility Functions
// ============================================================

import { format, parse, addMinutes, isBefore, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale/id';

// ── Time Helpers ─────────────────────────────────────────────

/** Convert "HH:MM" string to total minutes from midnight */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Convert total minutes from midnight to "HH:MM" string */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Calculate end time given a start time and duration in hours */
export function calculateEndTime(startTime: string, durationHours: number): string {
  const totalMinutes = timeToMinutes(startTime) + durationHours * 60;
  return minutesToTime(totalMinutes);
}

/** Check whether two time ranges overlap */
export function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);
  return startAMin < endBMin && endAMin > startBMin;
}

// ── Date Helpers ─────────────────────────────────────────────

/** Format a date string "YYYY-MM-DD" to a human-readable form */
export function formatDateDisplay(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'EEEE, d MMMM yyyy', { locale: localeId });
  } catch {
    return dateStr;
  }
}

/** Format a date string "YYYY-MM-DD" to short form */
export function formatDateShort(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'd MMM yyyy', { locale: localeId });
  } catch {
    return dateStr;
  }
}

/** Get today's date as "YYYY-MM-DD" */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Check if a date+time combination is in the past */
export function isSlotInPast(date: string, startTime: string, bufferMinutes = 30): boolean {
  try {
    const slotDateTime = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const cutoff = addMinutes(new Date(), bufferMinutes);
    return isBefore(slotDateTime, cutoff);
  } catch {
    return true;
  }
}

/** Check if a date string is today or in the future */
export function isDateAvailable(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isBefore(date, today);
  } catch {
    return false;
  }
}

// ── Validation ───────────────────────────────────────────────

/** Validate an Indonesian phone number */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+62|62|0)[0-9]{8,12}$/.test(cleaned);
}

/** Validate customer name */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

// ── Reference ID ─────────────────────────────────────────────

/** 
 * Generate a unique 6-character alphanumeric booking reference.
 * Excludes ambiguous characters (0, O, 1, I) to prevent confusion for customers and staff.
 */
export function generateReferenceId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JIOS-${result}`;
}

// ── Formatting ───────────────────────────────────────────────

/** Format a phone number for display */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
}

/** Format duration for display */
export function formatDuration(hours: number): string {
  if (hours === 1) return '1 Hour';
  if (hours === 1.5) return '1.5 Hours';
  if (hours === 2) return '2 Hours';
  return `${hours} Hours`;
}

// ── Misc ─────────────────────────────────────────────────────

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Clamp a number between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

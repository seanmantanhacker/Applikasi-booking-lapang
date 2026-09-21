// ============================================================
// JIOS Padel & Coffee — Central Site Configuration
// Edit this file to update business information, time slots,
// court setup, and booking options.
// ============================================================

import type { Court, TimeSlot } from '../types';

export const SITE_CONFIG = {
  BUSINESS_NAME: 'JIOS Padel & Coffee',
  BUSINESS_TAGLINE: 'Play Padel. Sip Coffee. Enjoy JIOS.',
  BUSINESS_DESCRIPTION:
    'A premium padel venue combined with a cozy coffee shop. Come for the game, stay for the coffee.',

  // ── Location ─────────────────────────────────────────────
  ADDRESS: 'Jl. BKR no. 180 Bandung',
  PHONE: '+62 8777 105 1800',
  EMAIL: 'jiosofficial10@gmail.com',
  GOOGLE_MAPS_URL: 'https://maps.google.com/?q=JIOS+Padel+Coffee',

  // ── Opening Hours ─────────────────────────────────────────
  OPENING_HOURS: [
    { day: 'Monday – Friday', hours: '08:00 – 22:00' },
    { day: 'Saturday', hours: '07:00 – 23:00' },
    { day: 'Sunday', hours: '07:00 – 22:00' },
  ],

  // ── Social ───────────────────────────────────────────────
  INSTAGRAM: 'https://instagram.com/jios.cafe',
  WHATSAPP: 'https://wa.me/6287771051800',
} as const;

// ── Single Court (fixed — only 1 court) ──────────────────────
export const COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Court 1',
    isActive: true,
    order: 1,
  },
];

// ── Booking Durations (hours) ────────────────────────────────
export const BOOKING_DURATIONS: { value: number; label: string }[] = [
  { value: 1, label: '1 Hour' },
  { value: 1.5, label: '1.5 Hours' },
  { value: 2, label: '2 Hours' },
  { value: 2.5, label: '2.5 Hours' },
  { value: 3, label: '3 Hours' },
  { value: 3.5, label: '3.5 Hours' },
  { value: 4, label: '4 Hours' },
  { value: 5, label: '5 Hours' },
  { value: 6, label: '6 Hours' },
];

// ── Player Count Options ─────────────────────────────────────
export const PLAYER_COUNTS = [1, 2, 3, 4];

// ── Maximum players per court ───────────────────────────────
export const MAX_PLAYERS_PER_COURT = 4;

// ── Time Slots (every 30 minutes from 08:00 to 21:00) ───────
// Bookings can START at any of these times
export const TIME_SLOTS: TimeSlot[] = [
  { time: '08:00', label: '08:00' },
  { time: '08:30', label: '08:30' },
  { time: '09:00', label: '09:00' },
  { time: '09:30', label: '09:30' },
  { time: '10:00', label: '10:00' },
  { time: '10:30', label: '10:30' },
  { time: '11:00', label: '11:00' },
  { time: '11:30', label: '11:30' },
  { time: '12:00', label: '12:00' },
  { time: '12:30', label: '12:30' },
  { time: '13:00', label: '13:00' },
  { time: '13:30', label: '13:30' },
  { time: '14:00', label: '14:00' },
  { time: '14:30', label: '14:30' },
  { time: '15:00', label: '15:00' },
  { time: '15:30', label: '15:30' },
  { time: '16:00', label: '16:00' },
  { time: '16:30', label: '16:30' },
  { time: '17:00', label: '17:00' },
  { time: '17:30', label: '17:30' },
  { time: '18:00', label: '18:00' },
  { time: '18:30', label: '18:30' },
  { time: '19:00', label: '19:00' },
  { time: '19:30', label: '19:30' },
  { time: '20:00', label: '20:00' },
  { time: '20:30', label: '20:30' },
  { time: '21:00', label: '21:00' },
];

// ── Venue Open / Close ────────────────────────────────────────
export const VENUE_OPEN_TIME = '08:00';
export const VENUE_CLOSE_TIME = '22:00';

/** Get venue closing time for a specific date YYYY-MM-DD */
export function getVenueCloseTime(dateStr?: string): string {
  if (!dateStr) return VENUE_CLOSE_TIME;
  try {
    const d = new Date(dateStr + 'T00:00:00');
    // Saturday is day 6
    if (d.getDay() === 6) {
      return '23:00';
    }
  } catch {
    // fallback
  }
  return '22:00';
}

// ── Minimum advance booking time (minutes) ──────────────────
export const MIN_ADVANCE_BOOKING_MINUTES = 30;

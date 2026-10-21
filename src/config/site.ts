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
  GOOGLE_MAPS_URL: 'https://maps.app.goo.gl/Eup3cYSEkMSfRUqt9',

  // ── Opening Hours ─────────────────────────────────────────
  OPENING_HOURS: [
    { day: 'Monday – Friday', hours: '08:00 – 22:00' },
    { day: 'Saturday', hours: '08:00 – 22:00' },
    { day: 'Sunday', hours: '08:00 – 22:00' },
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
  { value: 2, label: '2 Hours' },
  { value: 3, label: '3 Hours' },
  { value: 4, label: '4 Hours' },
  { value: 5, label: '5 Hours' },
  { value: 6, label: '6 Hours' },
];

// ── Player Count Options ─────────────────────────────────────
export const PLAYER_COUNTS = [1, 2, 3, 4];

// ── Maximum players per court ───────────────────────────────
export const MAX_PLAYERS_PER_COURT = 4;

// ── Time Slots (every 1 hour from 08:00 to 21:00) ───────────
// Bookings can START at any of these times
export const TIME_SLOTS: TimeSlot[] = [
  { time: '08:00', label: '08:00' },
  { time: '09:00', label: '09:00' },
  { time: '10:00', label: '10:00' },
  { time: '11:00', label: '11:00' },
  { time: '12:00', label: '12:00' },
  { time: '13:00', label: '13:00' },
  { time: '14:00', label: '14:00' },
  { time: '15:00', label: '15:00' },
  { time: '16:00', label: '16:00' },
  { time: '17:00', label: '17:00' },
  { time: '18:00', label: '18:00' },
  { time: '19:00', label: '19:00' },
  { time: '20:00', label: '20:00' },
  { time: '21:00', label: '21:00' },
];

// ── Venue Open / Close ────────────────────────────────────────
export const VENUE_OPEN_TIME = '08:00';
export const VENUE_CLOSE_TIME = '22:00';

/** Get venue closing time for a specific date YYYY-MM-DD */
export function getVenueCloseTime(dateStr?: string): string {
  if (!dateStr) return VENUE_CLOSE_TIME;
  return '22:00';
}

// ── Minimum advance booking time (minutes) ──────────────────
export const MIN_ADVANCE_BOOKING_MINUTES = 60;

// ── Pricelist Configuration ───────────────────────────────────
export interface HourlyPriceRule {
  id: string;
  name: string;
  timeRange: string;
  pricePerHour: number;
  badge?: string;
  description: string;
}

export interface MembershipPackage {
  id: string;
  name: string;
  hours: number;
  price: number;
  validity: string;
  timeAllowed: string;
  popular?: boolean;
  badge?: string;
  features: string[];
}

export const PRICING_CONFIG = {
  weekday: [
    {
      id: 'weekday-happy',
      name: 'Happy Hour',
      timeRange: '11:00 – 14:00',
      pricePerHour: 60000,
      badge: 'Hemat Siang',
      description: 'Slot siang santai dengan harga paling terjangkau sambil menikmati kopi.',
    },
    {
      id: 'weekday-regular',
      name: 'Regular Hour',
      timeRange: '08:00 – 11:00 & 14:00 – 18:00',
      pricePerHour: 75000,
      description: 'Sesi segar pagi hari dan sore hari yang nyaman untuk latihan.',
    },
    {
      id: 'weekday-peak',
      name: 'Peak Hour',
      timeRange: '18:00 – 22:00',
      pricePerHour: 85000,
      badge: 'Favorit',
      description: 'Waktu bermain paling favorit di malam hari setelah jam kerja.',
    },
  ] as HourlyPriceRule[],

  weekend: [
    {
      id: 'weekend-regular',
      name: 'Weekend Regular',
      timeRange: '08:00 – 22:00',
      pricePerHour: 100000,
      badge: 'Weekend',
      description: 'Sabtu & Minggu penuh energi untuk bermain bersama teman & komunitas.',
    },
  ] as HourlyPriceRule[],

  membership: [
    {
      id: 'member-happy',
      name: 'Happy Hour Member',
      hours: 10,
      price: 500000,
      validity: '30 Hari (Monthly)',
      timeAllowed: 'Senin – Jumat (11:00 – 14:00)',
      popular: false,
      features: [
        'Total kuota 10 jam bermain',
        'Hanya Rp 50.000 / jam (Hemat Rp 100k)',
        'Berlaku di jam Happy Hour (11:00 – 14:00)',
        'Diskon spesial menu kopi di JIOS Café',
      ],
    },
    {
      id: 'member-weekday',
      name: 'Regular Weekdays',
      hours: 10,
      price: 700000,
      validity: '30 Hari (Monthly)',
      timeAllowed: 'Senin – Jumat (All Time)',
      popular: false,
      features: [
        'Total kuota 10 jam bermain',
        'Bebas pilih jam Senin s/d Jumat',
        'Bisa dipakai untuk slot Peak Hour malam',
        'Prioritas booking slot harian',
      ],
    },
    {
      id: 'member-alltime',
      name: 'Regular (All Time)',
      hours: 10,
      price: 800000,
      validity: '30 Hari (Monthly)',
      timeAllowed: 'Setiap Hari (Weekday & Weekend)',
      popular: true,
      badge: 'Paling Populer',
      features: [
        'Total kuota 10 jam bermain',
        'Bebas dipakai setiap hari (Senin – Minggu)',
        'Termasuk slot Weekend',
      ],
    },
    {
      id: 'member-vip',
      name: 'VIP (All Time)',
      hours: 20,
      price: 1500000,
      validity: '30 Hari (Monthly)',
      timeAllowed: 'Setiap Hari (Weekday & Weekend)',
      popular: false,
      badge: 'Best Value',
      features: [
        'Total kuota 20 jam bermain (Rp 75k/jam)',
        'Bebas akses kapan saja termasuk weekend',
        'Dedicated VIP booking & support',
      ],
    },
  ] as MembershipPackage[],
};

export interface HourlyBreakdown {
  slot: string;
  rate: number;
  label: string;
}

export interface BookingPriceResult {
  total: number;
  breakdown: HourlyBreakdown[];
  isWeekend: boolean;
}

/**
 * Calculate the exact total price and hour-by-hour breakdown
 * based on date, start time, and duration in hours.
 */
export function calculateBookingPrice(
  dateStr: string,
  startTime: string,
  durationHours: number
): BookingPriceResult {
  if (!dateStr || !startTime || !durationHours) {
    return { total: 0, breakdown: [], isWeekend: false };
  }

  let isWeekend = false;
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = d.getDay();
    isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  } catch {
    isWeekend = false;
  }

  const [startHour, startMin] = startTime.split(':').map(Number);
  const totalMinutes = (startHour || 0) * 60 + (startMin || 0);
  const breakdown: HourlyBreakdown[] = [];
  let total = 0;

  for (let i = 0; i < durationHours; i++) {
    const curMin = totalMinutes + i * 60;
    const curHour = Math.floor(curMin / 60);
    const curMinPart = curMin % 60;
    const nextMin = curMin + 60;
    const nextHour = Math.floor(nextMin / 60);
    const nextMinPart = nextMin % 60;

    const timeLabel = `${String(curHour).padStart(2, '0')}:${String(curMinPart).padStart(2, '0')} - ${String(nextHour).padStart(2, '0')}:${String(nextMinPart).padStart(2, '0')}`;

    if (isWeekend) {
      breakdown.push({
        slot: timeLabel,
        rate: 100000,
        label: 'Weekend Regular',
      });
      total += 100000;
    } else {
      // Weekday
      if (curHour >= 11 && curHour < 14) {
        breakdown.push({
          slot: timeLabel,
          rate: 60000,
          label: 'Happy Hour',
        });
        total += 60000;
      } else if (curHour >= 18 && curHour < 22) {
        breakdown.push({
          slot: timeLabel,
          rate: 85000,
          label: 'Peak Hour',
        });
        total += 85000;
      } else {
        breakdown.push({
          slot: timeLabel,
          rate: 75000,
          label: 'Regular Hour',
        });
        total += 75000;
      }
    }
  }

  return { total, breakdown, isWeekend };
}


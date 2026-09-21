// ============================================================
// JIOS Padel & Coffee — TypeScript Type Definitions
// ============================================================

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Court {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

export interface Booking {
  id: string;
  referenceId: string;         // e.g. "JIOS-1023"
  customerName: string;
  phone: string;
  date: string;                // "YYYY-MM-DD"
  startTime: string;           // "HH:MM"
  endTime: string;             // "HH:MM"
  duration: number;            // hours (1, 1.5, 2)
  courtId: string;
  playerCount: number;
  notes?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilitySlot {
  date: string;                // "YYYY-MM-DD"
  courtId: string;
  startTime: string;           // "HH:MM"
  endTime: string;             // "HH:MM"
  status: 'available' | 'booked';
}

export interface TimeSlot {
  time: string;                // "HH:MM"
  label: string;               // "09:00"
}

export interface BookingFormData {
  customerName: string;
  phone: string;
  date: string;
  startTime: string;
  duration: number;
  playerCount: number;
  notes: string;
  courtId: string;
}

export interface BookingConflictError {
  type: 'conflict';
  message: string;
}

export interface SiteSettings {
  openTime: string;
  closeTime: string;
  maxPlayersPerCourt: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

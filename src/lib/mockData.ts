// ============================================================
// JIOS Padel & Coffee — Mock / Sample Data
// Used when VITE_USE_MOCK_DATA=true
// This simulates real Firebase data for UI testing.
// ============================================================

import type { Booking, Court } from '../types';
import { addDays, format } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const dayAfter = format(addDays(new Date(), 2), 'yyyy-MM-dd');

export const MOCK_COURTS: Court[] = [
  { id: 'court-1', name: 'Court 1', isActive: true, order: 1 },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'mock-booking-001',
    referenceId: 'JIOS-0001',
    customerName: 'Rafi Ananta',
    phone: '08111234567',
    date: today,
    startTime: '09:00',
    endTime: '10:00',
    duration: 1,
    courtId: 'court-1',
    playerCount: 4,
    notes: 'Birthday game!',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-booking-002',
    referenceId: 'JIOS-0002',
    customerName: 'Sari Dewi',
    phone: '08119876543',
    date: today,
    startTime: '11:00',
    endTime: '12:30',
    duration: 1.5,
    courtId: 'court-1',
    playerCount: 3,
    notes: '',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-booking-003',
    referenceId: 'JIOS-0003',
    customerName: 'Budi Santoso',
    phone: '08125551234',
    date: today,
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    courtId: 'court-1',
    playerCount: 4,
    notes: 'Corporate event',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-booking-004',
    referenceId: 'JIOS-0004',
    customerName: 'Diana Putri',
    phone: '08137778888',
    date: tomorrow,
    startTime: '10:00',
    endTime: '11:00',
    duration: 1,
    courtId: 'court-1',
    playerCount: 2,
    notes: '',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-booking-005',
    referenceId: 'JIOS-0005',
    customerName: 'Hendra Wijaya',
    phone: '08159990000',
    date: tomorrow,
    startTime: '16:00',
    endTime: '18:00',
    duration: 2,
    courtId: 'court-1',
    playerCount: 4,
    notes: 'Friendly match',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-booking-006',
    referenceId: 'JIOS-0006',
    customerName: 'Citra Lestari',
    phone: '08112223333',
    date: dayAfter,
    startTime: '09:00',
    endTime: '10:30',
    duration: 1.5,
    courtId: 'court-1',
    playerCount: 4,
    notes: '',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// In-memory store for mock CRUD operations
let mockBookingsStore: Booking[] = [...MOCK_BOOKINGS];
let mockIdCounter = 7;

export const mockDb = {
  getBookings(): Booking[] {
    return mockBookingsStore.filter((b) => b.status !== 'cancelled');
  },

  getBookingsByDate(date: string): Booking[] {
    return mockBookingsStore.filter(
      (b) => b.date === date && b.status !== 'cancelled'
    );
  },

  getBookingsByDateAndCourt(date: string, courtId: string): Booking[] {
    return mockBookingsStore.filter(
      (b) => b.date === date && b.courtId === courtId && b.status !== 'cancelled'
    );
  },

  createBooking(data: Omit<Booking, 'id' | 'referenceId' | 'createdAt' | 'updatedAt' | 'status'>): Booking {
    const newBooking: Booking = {
      ...data,
      id: `mock-booking-${String(mockIdCounter).padStart(3, '0')}`,
      referenceId: `JIOS-${String(mockIdCounter).padStart(4, '0')}`,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockIdCounter++;
    mockBookingsStore.push(newBooking);
    return newBooking;
  },

  updateBooking(id: string, data: Partial<Booking>): Booking | null {
    const index = mockBookingsStore.findIndex((b) => b.id === id);
    if (index === -1) return null;
    mockBookingsStore[index] = { ...mockBookingsStore[index], ...data, updatedAt: new Date() };
    return mockBookingsStore[index];
  },

  deleteBooking(id: string): boolean {
    const index = mockBookingsStore.findIndex((b) => b.id === id);
    if (index === -1) return false;
    mockBookingsStore[index] = { ...mockBookingsStore[index], status: 'cancelled', updatedAt: new Date() };
    return true;
  },

  reset(): void {
    mockBookingsStore = [...MOCK_BOOKINGS];
    mockIdCounter = 7;
  },
};

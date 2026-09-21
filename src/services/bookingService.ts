// ============================================================
// JIOS Padel & Coffee — Booking Service
// Handles all booking CRUD operations.
// Switches between mock data and Firebase based on env flag.
// ============================================================

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  runTransaction,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mockDb } from '../lib/mockData';
import type { Booking, AvailabilitySlot, BookingFormData } from '../types';
import {
  calculateEndTime,
  timesOverlap,
  generateReferenceId,
  isSlotInPast,
  timeToMinutes,
} from '../utils';
import { getVenueCloseTime } from '../config/site';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ── Firestore helpers ────────────────────────────────────────

function convertFirestoreBooking(docData: Record<string, unknown>, id: string): Booking {
  return {
    id,
    referenceId: docData.referenceId as string,
    customerName: docData.customerName as string,
    phone: docData.phone as string,
    date: docData.date as string,
    startTime: docData.startTime as string,
    endTime: docData.endTime as string,
    duration: docData.duration as number,
    courtId: docData.courtId as string,
    playerCount: docData.playerCount as number,
    notes: (docData.notes as string) || '',
    status: docData.status as Booking['status'],
    createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt.toDate() : new Date(),
    updatedAt: docData.updatedAt instanceof Timestamp ? docData.updatedAt.toDate() : new Date(),
  };
}

// ── Public: Get Availability (no PII exposed) ────────────────

export async function getAvailabilityByDate(
  date: string,
  courtId: string
): Promise<AvailabilitySlot[]> {
  let bookings: Booking[] = [];

  if (USE_MOCK) {
    bookings = mockDb.getBookingsByDateAndCourt(date, courtId);
  } else {
    const q = query(
      collection(db, 'bookings'),
      where('date', '==', date),
      where('courtId', '==', courtId),
      where('status', '==', 'confirmed')
    );
    const snapshot = await getDocs(q);
    bookings = snapshot.docs.map((d) =>
      convertFirestoreBooking(d.data() as Record<string, unknown>, d.id)
    );
  }

  // Return anonymized availability — NO PII
  return bookings.map((b) => ({
    date: b.date,
    courtId: b.courtId,
    startTime: b.startTime,
    endTime: b.endTime,
    status: 'booked' as const,
  }));
}

// ── Check if a specific slot is available ────────────────────

export async function checkSlotAvailability(
  date: string,
  courtId: string,
  startTime: string,
  durationHours: number
): Promise<{ available: boolean; reason?: string }> {
  const endTime = calculateEndTime(startTime, durationHours);
  const closingTime = getVenueCloseTime(date);

  // Don't allow bookings ending after venue closing time
  if (timeToMinutes(endTime) > timeToMinutes(closingTime)) {
    return {
      available: false,
      reason: `Venue closes at ${closingTime}. A ${durationHours}-hour session starting at ${startTime} would end at ${endTime}.`,
    };
  }

  // Don't allow past bookings
  if (isSlotInPast(date, startTime)) {
    return { available: false, reason: 'Cannot book a time slot in the past.' };
  }

  const existingSlots = await getAvailabilityByDate(date, courtId);

  for (const slot of existingSlots) {
    if (timesOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
      return { available: false, reason: 'This time slot conflicts with an existing booking.' };
    }
  }

  return { available: true };
}

// ── Create a New Booking (with conflict check) ───────────────

export async function createBooking(formData: BookingFormData): Promise<Booking> {
  const endTime = calculateEndTime(formData.startTime, formData.duration);

  if (USE_MOCK) {
    // Re-check availability in mock mode
    const check = await checkSlotAvailability(
      formData.date,
      formData.courtId,
      formData.startTime,
      formData.duration
    );
    if (!check.available) {
      throw new Error(check.reason || 'This slot is no longer available.');
    }

    return mockDb.createBooking({
      customerName: formData.customerName,
      phone: formData.phone,
      date: formData.date,
      startTime: formData.startTime,
      endTime,
      duration: formData.duration,
      courtId: formData.courtId,
      playerCount: formData.playerCount,
      notes: formData.notes,
    });
  }

  // Validate closing time
  const closingTime = getVenueCloseTime(formData.date);
  if (timeToMinutes(endTime) > timeToMinutes(closingTime)) {
    throw new Error(`Venue closes at ${closingTime}. Session cannot end at ${endTime}.`);
  }

  // Firebase: use a transaction to prevent double booking
  const bookingsRef = collection(db, 'bookings');
  const referenceId = generateReferenceId();

  const newBooking = await runTransaction(db, async (transaction) => {
    // Query for conflicting bookings within the transaction
    const q = query(
      bookingsRef,
      where('date', '==', formData.date),
      where('courtId', '==', formData.courtId),
      where('status', '==', 'confirmed')
    );
    const snapshot = await getDocs(q);
    const existingBookings = snapshot.docs.map((d) =>
      convertFirestoreBooking(d.data() as Record<string, unknown>, d.id)
    );

    // Check overlaps
    for (const existing of existingBookings) {
      if (timesOverlap(formData.startTime, endTime, existing.startTime, existing.endTime)) {
        throw new Error('Sorry, this slot has just been booked. Please choose another time.');
      }
    }

    // Create the booking document
    const newDocRef = doc(bookingsRef);
    transaction.set(newDocRef, {
      referenceId,
      customerName: formData.customerName,
      phone: formData.phone,
      date: formData.date,
      startTime: formData.startTime,
      endTime,
      duration: formData.duration,
      courtId: formData.courtId,
      playerCount: formData.playerCount,
      notes: formData.notes || '',
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: newDocRef.id,
      referenceId,
      customerName: formData.customerName,
      phone: formData.phone,
      date: formData.date,
      startTime: formData.startTime,
      endTime,
      duration: formData.duration,
      courtId: formData.courtId,
      playerCount: formData.playerCount,
      notes: formData.notes || '',
      status: 'confirmed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return newBooking;
}

// ── Admin: Get All Bookings ───────────────────────────────────

export async function getAdminBookings(date?: string): Promise<Booking[]> {
  if (USE_MOCK) {
    if (date) return mockDb.getBookingsByDate(date);
    return mockDb.getBookings();
  }

  let q;
  if (date) {
    q = query(
      collection(db, 'bookings'),
      where('date', '==', date),
      where('status', '==', 'confirmed'),
      orderBy('startTime')
    );
  } else {
    q = query(
      collection(db, 'bookings'),
      where('status', '==', 'confirmed'),
      orderBy('date'),
      orderBy('startTime')
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) =>
    convertFirestoreBooking(d.data() as Record<string, unknown>, d.id)
  );
}

// ── Admin: Update Booking ────────────────────────────────────

export async function updateBooking(id: string, data: Partial<Booking>): Promise<void> {
  if (USE_MOCK) {
    mockDb.updateBooking(id, data);
    return;
  }

  const bookingRef = doc(db, 'bookings', id);
  await updateDoc(bookingRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Admin: Delete Booking ────────────────────────────────────

export async function deleteBooking(id: string): Promise<void> {
  if (USE_MOCK) {
    mockDb.deleteBooking(id);
    return;
  }

  // Soft delete — mark as cancelled
  const bookingRef = doc(db, 'bookings', id);
  await updateDoc(bookingRef, {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
}

// ── Admin: Hard Delete ───────────────────────────────────────

export async function hardDeleteBooking(id: string): Promise<void> {
  if (USE_MOCK) {
    mockDb.deleteBooking(id);
    return;
  }

  await deleteDoc(doc(db, 'bookings', id));
}

// ── Admin: Move Booking ──────────────────────────────────────

export async function moveBooking(
  id: string,
  newDate: string,
  newStartTime: string,
  newDuration: number,
  newCourtId: string
): Promise<void> {
  const newEndTime = calculateEndTime(newStartTime, newDuration);

  if (USE_MOCK) {
    // Check for conflicts (excluding this booking)
    const bookings = mockDb.getBookingsByDateAndCourt(newDate, newCourtId);
    for (const b of bookings) {
      if (b.id !== id && timesOverlap(newStartTime, newEndTime, b.startTime, b.endTime)) {
        throw new Error('The target slot is already booked.');
      }
    }
    mockDb.updateBooking(id, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      duration: newDuration,
      courtId: newCourtId,
    });
    return;
  }

  // Firebase transaction to prevent conflicts
  await runTransaction(db, async (transaction) => {
    const q = query(
      collection(db, 'bookings'),
      where('date', '==', newDate),
      where('courtId', '==', newCourtId),
      where('status', '==', 'confirmed')
    );
    const snapshot = await getDocs(q);
    const existing = snapshot.docs
      .map((d) => convertFirestoreBooking(d.data() as Record<string, unknown>, d.id))
      .filter((b) => b.id !== id);

    for (const b of existing) {
      if (timesOverlap(newStartTime, newEndTime, b.startTime, b.endTime)) {
        throw new Error('The target slot is already booked.');
      }
    }

    const bookingRef = doc(db, 'bookings', id);
    transaction.update(bookingRef, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      duration: newDuration,
      courtId: newCourtId,
      updatedAt: serverTimestamp(),
    });
  });
}

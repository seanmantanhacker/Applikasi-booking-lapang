// ============================================================
// JIOS — useBookings hook (admin)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getAdminBookings } from '../services/bookingService';
import type { Booking } from '../types';

export function useBookings(date?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBookings(date);
      setBookings(data);
    } catch (err) {
      setError('Unable to load bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

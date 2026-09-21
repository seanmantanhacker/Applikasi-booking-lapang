// ============================================================
// JIOS — useAvailability hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getAvailabilityByDate } from '../services/bookingService';
import type { AvailabilitySlot } from '../types';

export function useAvailability(date: string, courtId: string) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!date || !courtId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailabilityByDate(date, courtId);
      setSlots(data);
    } catch (err) {
      setError('Unable to load availability. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date, courtId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { slots, loading, error, refetch: fetchAvailability };
}

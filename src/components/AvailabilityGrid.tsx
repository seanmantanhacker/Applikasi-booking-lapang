// ============================================================
// JIOS — Availability Grid Component
// Shows time slots for a court — AVAILABLE / BOOKED / SELECTED
// No customer PII is ever shown here.
// ============================================================

import { Clock } from 'lucide-react';
import { TIME_SLOTS, BOOKING_DURATIONS } from '../config/site';
import type { AvailabilitySlot } from '../types';
import { timesOverlap, calculateEndTime, isSlotInPast } from '../utils';
import { LoadingState } from './States';

interface AvailabilityGridProps {
  date: string;
  courtId: string;
  courtName: string;
  bookedSlots: AvailabilitySlot[];
  selectedTime: string | null;
  selectedDuration: number;
  onSelectTime: (time: string) => void;
  loading?: boolean;
}

type SlotStatus = 'available' | 'booked' | 'selected' | 'past' | 'partial-conflict';

function getSlotStatus(
  time: string,
  duration: number,
  bookedSlots: AvailabilitySlot[],
  selectedTime: string | null,
  date: string
): SlotStatus {
  if (isSlotInPast(date, time)) return 'past';

  const endTime = calculateEndTime(time, duration);

  // Check if this slot is the selected one
  if (selectedTime === time) return 'selected';

  // Check if this slot would overlap with any booking
  for (const slot of bookedSlots) {
    if (timesOverlap(time, endTime, slot.startTime, slot.endTime)) {
      return 'booked';
    }
  }

  return 'available';
}

export default function AvailabilityGrid({
  date,
  courtName,
  bookedSlots,
  selectedTime,
  selectedDuration,
  onSelectTime,
  loading = false,
}: AvailabilityGridProps) {
  if (loading) {
    return <LoadingState message="Checking availability..." />;
  }

  const statusCounts = TIME_SLOTS.reduce(
    (acc, slot) => {
      const status = getSlotStatus(slot.time, selectedDuration, bookedSlots, selectedTime, date);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<SlotStatus, number>
  );

  return (
    <div>
      {/* Court header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <Clock className="w-4 h-4 text-cream-200" />
          </div>
          <h3 className="font-serif text-navy text-lg">{courtName}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-navy-300">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cream-300 border border-cream-400 inline-block" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-navy inline-block" />
            Selected
          </span>
        </div>
      </div>

      {/* Duration info */}
      <p className="text-xs text-navy-300 mb-4">
        Showing availability for{' '}
        <span className="font-semibold text-navy">
          {BOOKING_DURATIONS.find((d) => d.value === selectedDuration)?.label ?? `${selectedDuration}h`}
        </span>{' '}
        slot.{' '}
        {statusCounts.available
          ? `${statusCounts.available} slot${statusCounts.available > 1 ? 's' : ''} available.`
          : 'No slots available for this duration.'}
      </p>

      {/* Time grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {TIME_SLOTS.map((slot) => {
          const status = getSlotStatus(
            slot.time,
            selectedDuration,
            bookedSlots,
            selectedTime,
            date
          );

          const endTime = calculateEndTime(slot.time, selectedDuration);

          if (status === 'available') {
            return (
              <button
                key={slot.time}
                onClick={() => onSelectTime(slot.time)}
                className="slot-available text-center"
                aria-label={`Select ${slot.time} – ${endTime}`}
                title={`${slot.time} – ${endTime}`}
                id={`slot-${slot.time.replace(':', '')}`}
              >
                <div className="font-semibold">{slot.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">– {endTime}</div>
              </button>
            );
          }

          if (status === 'selected') {
            return (
              <button
                key={slot.time}
                onClick={() => onSelectTime(slot.time)}
                className="slot-selected text-center"
                aria-label={`Selected: ${slot.time} – ${endTime}`}
                aria-pressed="true"
                id={`slot-${slot.time.replace(':', '')}`}
              >
                <div className="font-semibold">{slot.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">– {endTime}</div>
              </button>
            );
          }

          if (status === 'booked') {
            return (
              <div
                key={slot.time}
                className="slot-booked text-center"
                aria-label={`${slot.time} is fully booked`}
                role="img"
                title="Fully Booked"
              >
                <div className="font-semibold">{slot.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">Full</div>
              </div>
            );
          }

          // Past slot
          return (
            <div
              key={slot.time}
              className="slot-past text-center"
              aria-label={`${slot.time} — passed`}
              role="img"
              title="Time Passed"
            >
              <div className="font-semibold">{slot.label}</div>
              <div className="text-[10px] opacity-50 mt-0.5">Passed</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

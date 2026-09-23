// ============================================================
// JIOS — Availability Grid Component
// Shows time slots for a court — AVAILABLE / BOOKED / SELECTED
// No customer PII is ever shown here.
// ============================================================

import { Clock } from 'lucide-react';
import { TIME_SLOTS, BOOKING_DURATIONS, getVenueCloseTime } from '../config/site';
import type { AvailabilitySlot } from '../types';
import { timesOverlap, calculateEndTime, isSlotInPast, timeToMinutes } from '../utils';
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

type SlotStatus = 'available' | 'booked' | 'selected' | 'past' | 'closed';

function getSlotStatus(
  time: string,
  duration: number,
  bookedSlots: AvailabilitySlot[],
  selectedTime: string | null,
  date: string
): SlotStatus {
  if (isSlotInPast(date, time)) return 'past';

  const endTime = calculateEndTime(time, duration);
  const closingTime = getVenueCloseTime(date);

  // Check if session ends after venue closing time
  if (timeToMinutes(endTime) > timeToMinutes(closingTime)) {
    return 'closed';
  }

  // Check if this slot would overlap with ANY existing booking
  for (const slot of bookedSlots) {
    if (timesOverlap(time, endTime, slot.startTime, slot.endTime)) {
      return 'booked';
    }
  }

  // Check if this slot is the selected one (only if it doesn't conflict)
  if (selectedTime === time) return 'selected';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-cream-200" />
          </div>
          <h3 className="font-serif text-navy text-lg">{courtName}</h3>
        </div>
        
        {/* Status Legend */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:flex-wrap gap-2.5 sm:gap-4 text-xs text-navy-400 bg-cream-100/80 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cream-300 border border-cream-400 flex-shrink-0" />
            <span className="truncate font-medium text-navy-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-200 border border-red-300 flex-shrink-0" />
            <span className="truncate font-medium text-red-500">Booked</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cream-300/80 border border-cream-400 flex-shrink-0" />
            <span className="truncate font-medium text-navy-300">Closed</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-navy flex-shrink-0" />
            <span className="truncate font-medium text-navy">Selected</span>
          </div>
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
                className="slot-available text-center min-w-0"
                aria-label={`Select ${slot.time} – ${endTime}`}
                title={`${slot.time} – ${endTime}`}
                id={`slot-${slot.time.replace(':', '')}`}
              >
                <div className="font-semibold text-xs sm:text-sm truncate">{slot.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5 truncate leading-tight">– {endTime}</div>
              </button>
            );
          }

          if (status === 'selected') {
            return (
              <button
                key={slot.time}
                onClick={() => onSelectTime(slot.time)}
                className="slot-selected text-center min-w-0"
                aria-label={`Selected: ${slot.time} – ${endTime}`}
                aria-pressed="true"
                id={`slot-${slot.time.replace(':', '')}`}
              >
                <div className="font-semibold text-xs sm:text-sm truncate">{slot.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5 truncate leading-tight">– {endTime}</div>
              </button>
            );
          }

          if (status === 'booked') {
            return (
              <div
                key={slot.time}
                className="slot-booked text-center min-w-0"
                aria-label={`${slot.time} is fully booked`}
                role="img"
                title="Fully Booked"
              >
                <div className="font-semibold text-xs sm:text-sm truncate">{slot.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5 truncate leading-tight">Booked</div>
              </div>
            );
          }

          if (status === 'closed') {
            return (
              <div
                key={slot.time}
                className="slot-past text-center opacity-60 bg-cream-300/40 text-navy-400 cursor-not-allowed min-w-0"
                aria-label={`${slot.time} ends after venue closing time`}
                role="img"
                title={`Venue closes at ${getVenueCloseTime(date)}. Session would end at ${endTime}.`}
              >
                <div className="font-semibold text-xs sm:text-sm truncate">{slot.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5 truncate leading-tight">Closed</div>
              </div>
            );
          }

          // Past slot
          return (
            <div
              key={slot.time}
              className="slot-past text-center min-w-0"
              aria-label={`${slot.time} — passed`}
              role="img"
              title="Time Passed"
            >
              <div className="font-semibold text-xs sm:text-sm truncate">{slot.label}</div>
              <div className="text-[10px] opacity-50 mt-0.5 truncate leading-tight">Passed</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

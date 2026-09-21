// ============================================================
// JIOS — Admin Timetable / Calendar
// Shows the day's bookings as a visual schedule grid
// ============================================================

import { useState } from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import type { Booking } from '../../types';
import { TIME_SLOTS, COURTS } from '../../config/site';
import { timesOverlap, formatDuration } from '../../utils';
import BookingModal from './BookingModal';
import { EmptyState } from '../States';

interface AdminCalendarProps {
  bookings: Booking[];
  date: string;
  onRefresh: () => void;
}

export default function AdminCalendar({ bookings, date: _date, onRefresh }: AdminCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const court = COURTS[0];

  // Get booking for a specific time slot
  const getBookingForSlot = (courtId: string, time: string): Booking | null => {
    return (
      bookings.find(
        (b) =>
          b.courtId === courtId &&
          timesOverlap(time, nextSlot(time), b.startTime, b.endTime)
      ) || null
    );
  };

  const nextSlot = (time: string): string => {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + 60; // 1 hour increments for display
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };

  // Get the "starting" booking for a slot (to avoid rendering it multiple times)
  const getStartingBooking = (courtId: string, time: string): Booking | null => {
    return bookings.find((b) => b.courtId === courtId && b.startTime === time) || null;
  };

  // Calculate display rows for a booking (how many hour slots it spans)
  const getBookingRowSpan = (booking: Booking): number => {
    return Math.ceil(booking.duration);
  };

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings today"
        description="There are no bookings for this date. Check back later or create a new booking."
      />
    );
  }

  return (
    <>
      {/* Timetable */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[400px]">
          {/* Header */}
          <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
            <div className="text-xs font-semibold text-navy-300 uppercase tracking-wide px-2">Time</div>
            <div className="text-xs font-semibold text-navy uppercase tracking-wide px-3 py-2 bg-navy rounded-xl text-cream-200">
              {court.name}
            </div>
          </div>

          {/* Time rows — hourly display */}
          {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((slot) => {
            const startingBooking = getStartingBooking(court.id, slot.time);
            const occupyingBooking = getBookingForSlot(court.id, slot.time);
            const isOccupied = !!occupyingBooking;
            const isStart = !!startingBooking;

            return (
              <div
                key={slot.time}
                className="grid grid-cols-[80px_1fr] gap-2 mb-1"
              >
                {/* Time label */}
                <div className="flex items-center text-xs text-navy-300 font-medium px-2 h-14">
                  {slot.time}
                </div>

                {/* Court cell */}
                <div className="relative h-14">
                  {isStart && startingBooking ? (
                    <button
                      onClick={() => setSelectedBooking(startingBooking)}
                      className="absolute inset-0 w-full bg-caramel/15 border-2 border-caramel/40 rounded-xl
                                 hover:bg-caramel/25 hover:border-caramel transition-all duration-150
                                 text-left px-3 flex items-center gap-2 group"
                      style={{
                        height: `${getBookingRowSpan(startingBooking) * 3.5 + (getBookingRowSpan(startingBooking) - 1) * 0.25}rem`,
                      }}
                      id={`booking-cell-${startingBooking.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-navy truncate">
                            {startingBooking.referenceId}
                          </span>
                          <span className="text-[10px] text-navy-300">
                            {startingBooking.startTime}–{startingBooking.endTime}
                          </span>
                        </div>
                        <div className="text-xs text-navy font-semibold truncate">
                          {startingBooking.customerName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] text-navy-400">
                            <Users className="w-3 h-3" />
                            {startingBooking.playerCount}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-navy-400">
                            <Clock className="w-3 h-3" />
                            {formatDuration(startingBooking.duration)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-caramel opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ) : isOccupied && !isStart ? (
                    // Continuation of a booking — show faint indicator
                    <div className="absolute inset-0 bg-caramel/8 border-x-2 border-b-2 border-caramel/20 rounded-b-xl" />
                  ) : (
                    // Available
                    <div className="absolute inset-0 rounded-xl border border-dashed border-cream-400/60 flex items-center justify-center">
                      <span className="text-[10px] text-navy-200 uppercase tracking-widest">Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking count */}
      <div className="mt-4 text-sm text-navy-300">
        <strong className="text-navy">{bookings.length}</strong>{' '}
        booking{bookings.length !== 1 ? 's' : ''} on this date
      </div>

      {/* Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={() => {
            setSelectedBooking(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}

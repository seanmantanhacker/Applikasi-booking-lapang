// ============================================================
// JIOS — Admin Timetable / Calendar
// Shows the day's bookings as a visual schedule grid
// ============================================================

import { useState } from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import type { Booking } from '../../types';
import { TIME_SLOTS, COURTS } from '../../config/site';
import { formatDuration } from '../../utils';
import BookingModal from './BookingModal';
import { EmptyState } from '../States';

interface AdminCalendarProps {
  bookings: Booking[];
  date: string;
  onRefresh: () => void;
}

// ROW HEIGHT in rem — must match h-14 (3.5rem) + mb-1 (0.25rem) gap
const ROW_HEIGHT_REM = 3.5;
const ROW_GAP_REM = 0.25;

export default function AdminCalendar({ bookings, date: _date, onRefresh }: AdminCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const court = COURTS[0];

  // Get the booking that STARTS at this exact time slot for this court
  const getStartingBooking = (courtId: string, time: string): Booking | null =>
    bookings.find((b) => b.courtId === courtId && b.startTime === time) || null;

  // Check if this slot is occupied by a booking that started EARLIER (continuation row)
  const getContinuationBooking = (courtId: string, time: string): Booking | null => {
    return (
      bookings.find((b) => {
        if (b.courtId !== courtId) return false;
        if (b.startTime === time) return false; // it's a start, not continuation
        // Is `time` between startTime (exclusive) and endTime (exclusive)?
        return b.startTime < time && time < b.endTime;
      }) || null
    );
  };

  // Calculate absolute pixel height for a booking block based on duration
  const getBookingHeight = (booking: Booking): string => {
    const spans = Math.ceil(booking.duration);
    const totalRem = spans * ROW_HEIGHT_REM + (spans - 1) * ROW_GAP_REM;
    return `${totalRem}rem`;
  };

  // Status-based colour classes
  const getBookingColors = (booking: Booking) => {
    if (booking.status === 'initiated') {
      return {
        block: 'bg-amber-50 border-amber-400 hover:bg-amber-100 hover:border-amber-500',
        continuation: 'bg-amber-50/60 border-x-2 border-b-2 border-amber-300/60',
        chevron: 'text-amber-500',
        badge: 'bg-amber-100 text-amber-700',
        badgeLabel: 'Initiated',
      };
    }
    return {
      block: 'bg-caramel/15 border-caramel/40 hover:bg-caramel/25 hover:border-caramel',
      continuation: 'bg-caramel/8 border-x-2 border-b-2 border-caramel/20',
      chevron: 'text-caramel',
      badge: 'bg-emerald-100 text-emerald-700',
      badgeLabel: 'Confirmed',
    };
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

          {/* Time rows — 1-hour intervals, all slots rendered */}
          {TIME_SLOTS.map((slot) => {
            const startingBooking = getStartingBooking(court.id, slot.time);
            const continuationBooking = getContinuationBooking(court.id, slot.time);

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
                  {startingBooking ? (() => {
                    const colors = getBookingColors(startingBooking);
                    return (
                      <button
                        onClick={() => setSelectedBooking(startingBooking)}
                        className={`absolute left-0 right-0 w-full border-2 rounded-xl
                                   transition-all duration-150
                                   text-left px-3 flex items-center gap-2 group z-10
                                   ${colors.block}`}
                        style={{ height: getBookingHeight(startingBooking), top: 0 }}
                        id={`booking-cell-${startingBooking.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-xs font-bold text-navy truncate">
                              {startingBooking.referenceId}
                            </span>
                            <span className="text-[10px] text-navy-300">
                              {startingBooking.startTime}–{startingBooking.endTime}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${colors.badge}`}>
                              {colors.badgeLabel}
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
                        <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${colors.chevron}`} />
                      </button>
                    );
                  })() : continuationBooking ? (
                    // Continuation row — faint background matching the booking color
                    <div className={`absolute inset-0 rounded-b-xl ${getBookingColors(continuationBooking).continuation}`} />
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
      <div className="mt-4 flex items-center gap-4 text-sm text-navy-300">
        <span><strong className="text-navy">{bookings.length}</strong> booking{bookings.length !== 1 ? 's' : ''} on this date</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-caramel/40 border border-caramel/60 inline-block" />
          Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400 inline-block" />
          Initiated
        </span>
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

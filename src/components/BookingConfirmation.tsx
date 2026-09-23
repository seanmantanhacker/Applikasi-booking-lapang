// ============================================================
// JIOS — Booking Confirmation Screen
// ============================================================

import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Hash, MapPin, ArrowLeft } from 'lucide-react';
import type { Booking } from '../types';
import { formatDateDisplay, formatDuration } from '../utils';

interface BookingConfirmationProps {
  booking: Booking;
  onReset: () => void;
}

export default function BookingConfirmation({ booking, onReset }: BookingConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto text-center animate-slide-up">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      <h2 className="font-serif text-3xl text-navy mb-2">Booking Initiated!</h2>
      <p className="text-navy-300 mb-8">
        Your slot is reserved temporarily. Please confirm your payment via WhatsApp to secure the court! ☕
      </p>

      {/* Reference */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy rounded-xl mb-8">
        <Hash className="w-4 h-4 text-caramel" />
        <span className="text-cream-200 font-mono font-bold text-lg tracking-widest">
          {booking.referenceId}
        </span>
      </div>

      {/* Details */}
      <div className="card text-left mb-6">
        <div className="space-y-4">
          {[
            {
              icon: <Calendar className="w-4 h-4 text-caramel" />,
              label: 'Date',
              value: formatDateDisplay(booking.date),
            },
            {
              icon: <MapPin className="w-4 h-4 text-caramel" />,
              label: 'Court',
              value: 'Court 1',
            },
            {
              icon: <Clock className="w-4 h-4 text-caramel" />,
              label: 'Time',
              value: `${booking.startTime} – ${booking.endTime} (${formatDuration(booking.duration)})`,
            },
            {
              icon: <Users className="w-4 h-4 text-caramel" />,
              label: 'Players',
              value: `${booking.playerCount} player${booking.playerCount > 1 ? 's' : ''}`,
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
                {row.icon}
              </div>
              <div>
                <div className="text-xs text-navy-300 font-medium uppercase tracking-wide">
                  {row.label}
                </div>
                <div className="text-navy font-semibold text-sm">{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-navy-300 text-xs mb-8">
        Please save your booking reference number:{' '}
        <strong className="text-navy">{booking.referenceId}</strong>. If WhatsApp did not open automatically, please contact us manually to confirm your payment.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link to="/schedule" className="btn-primary w-full justify-center">
          View Schedule
        </Link>
        <button onClick={onReset} className="btn-ghost w-full justify-center">
          <ArrowLeft className="w-4 h-4" />
          Make Another Booking
        </button>
      </div>
    </div>
  );
}

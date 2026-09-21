// ============================================================
// JIOS — Booking Summary (Review before confirm)
// ============================================================

import { ArrowLeft, Calendar, Clock, Users, User, Phone, MapPin, Loader2 } from 'lucide-react';
import type { BookingFormData } from '../types';
import { calculateEndTime, formatDateDisplay, formatDuration } from '../utils';

interface BookingSummaryProps {
  form: BookingFormData;
  courtName: string;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export default function BookingSummary({
  form,
  courtName,
  onBack,
  onConfirm,
  submitting,
}: BookingSummaryProps) {
  const endTime = calculateEndTime(form.startTime, form.duration);

  const rows = [
    { icon: <User className="w-4 h-4" />, label: 'Name', value: form.customerName },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: form.phone },
    { icon: <Calendar className="w-4 h-4" />, label: 'Date', value: formatDateDisplay(form.date) },
    { icon: <MapPin className="w-4 h-4" />, label: 'Court', value: courtName },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Time',
      value: `${form.startTime} – ${endTime} (${formatDuration(form.duration)})`,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Players',
      value: `${form.playerCount} player${form.playerCount > 1 ? 's' : ''}`,
    },
    ...(form.notes ? [{ icon: null, label: 'Notes', value: form.notes }] : []),
  ];

  return (
    <div className="card max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-2">
          Review
        </span>
        <h2 className="font-serif text-2xl text-navy">Booking Summary</h2>
        <p className="text-navy-300 text-sm mt-1">
          Please review your booking details before confirming.
        </p>
      </div>

      {/* Summary table */}
      <div className="bg-cream-200 rounded-2xl overflow-hidden mb-8">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start gap-4 px-5 py-4 ${
              i < rows.length - 1 ? 'border-b border-cream-400' : ''
            }`}
          >
            {row.icon && (
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-caramel flex-shrink-0 mt-0.5">
                {row.icon}
              </div>
            )}
            {!row.icon && <div className="w-8 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-navy-300 mb-0.5">
                {row.label}
              </div>
              <div className="text-navy font-medium text-sm">{row.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-xs leading-relaxed">
          <span className="font-semibold">Please note:</span> Once confirmed, your booking will be
          reserved immediately. If you need to cancel or change your booking, please contact us
          directly via WhatsApp or phone.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="btn-secondary flex-1 sm:flex-none"
          id="booking-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="btn-primary flex-1"
          id="booking-confirm-btn"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Confirming...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  );
}

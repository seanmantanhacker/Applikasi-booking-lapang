// ============================================================
// JIOS — Booking Form Component
// Multi-step: form → summary → confirmation
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { User, Phone, Calendar, Clock, Users, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { COURTS, BOOKING_DURATIONS } from '../config/site';
import type { BookingFormData, Booking } from '../types';
import {
  validateName,
  validatePhone,
  calculateEndTime,
  formatDateDisplay,
  getTodayString,
  isDateAvailable,
} from '../utils';
import { checkSlotAvailability, createBooking } from '../services/bookingService';
import { useAvailability } from '../hooks/useAvailability';
import AvailabilityGrid from './AvailabilityGrid';
import BookingSummary from './BookingSummary';
import BookingConfirmation from './BookingConfirmation';

type Step = 'form' | 'summary' | 'confirmation';

const DEFAULT_FORM: BookingFormData = {
  customerName: '',
  phone: '',
  date: getTodayString(),
  startTime: '',
  duration: 1,
  playerCount: 4,
  notes: '',
  courtId: COURTS[0].id,
};

interface FormErrors {
  customerName?: string;
  phone?: string;
  date?: string;
  startTime?: string;
  duration?: string;
  playerCount?: string;
}

export default function BookingForm() {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<BookingFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const court = COURTS[0];
  const { slots, loading: availLoading, error: availError, refetch } = useAvailability(form.date, form.courtId);

  const isFirstMount = useRef(true);

  // Scroll into view only when user advances step (not on first page load)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Reset selected time when date or duration changes
  useEffect(() => {
    setForm((f) => ({ ...f, startTime: '' }));
    setSlotError(null);
  }, [form.date, form.duration]);

  const set = (key: keyof BookingFormData, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === 'startTime') setSlotError(null);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!validateName(form.customerName)) {
      errs.customerName = 'Please enter a valid name (2–100 characters).';
    }
    if (!validatePhone(form.phone)) {
      errs.phone = 'Please enter a valid Indonesian phone number.';
    }
    if (!form.date || !isDateAvailable(form.date)) {
      errs.date = 'Please select today or a future date.';
    }
    if (!form.startTime) {
      errs.startTime = 'Please select a time slot.';
    }
    if (!form.duration) {
      errs.duration = 'Please select a duration.';
    }
    if (!form.playerCount || form.playerCount < 1) {
      errs.playerCount = 'Please select number of players.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSlotError(null);

    try {
      const check = await checkSlotAvailability(
        form.date,
        form.courtId,
        form.startTime,
        form.duration
      );

      if (!check.available) {
        setSlotError(check.reason || 'This slot is no longer available.');
        await refetch();
        setSubmitting(false);
        return;
      }

      setStep('summary');
    } catch {
      setSlotError('Could not verify availability. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const booking = await createBooking(form);
      setConfirmedBooking(booking);
      setStep('confirmation');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Booking failed. Please try again.';
      setSlotError(message);
      setStep('form');
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setSlotError(null);
    setConfirmedBooking(null);
    setStep('form');
  };

  if (step === 'confirmation' && confirmedBooking) {
    return (
      <div ref={containerRef} id="booking-confirmation-container" className="scroll-mt-28">
        <BookingConfirmation booking={confirmedBooking} onReset={handleReset} />
      </div>
    );
  }

  if (step === 'summary') {
    return (
      <div ref={containerRef} id="booking-summary-container" className="scroll-mt-28">
        <BookingSummary
          form={form}
          courtName={court.name}
          onBack={() => setStep('form')}
          onConfirm={handleConfirm}
          submitting={submitting}
        />
      </div>
    );
  }

  const endTime = form.startTime ? calculateEndTime(form.startTime, form.duration) : null;

  return (
    <div ref={containerRef} id="booking" className="scroll-mt-28">
      <div className="card max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-2">
            Reserve a Court
          </span>
          <h2 className="font-serif text-2xl text-navy">Book a Session</h2>
          <p className="text-navy-300 text-sm mt-1">
            Select your preferred time, fill in your details, and confirm.
          </p>
        </div>

        <div className="space-y-6">
          {/* Date */}
          <div>
            <label htmlFor="booking-date" className="form-label flex items-center gap-2">
              <Calendar className="w-4 h-4 text-caramel" />
              Date
            </label>
            <input
              id="booking-date"
              type="date"
              value={form.date}
              min={getTodayString()}
              onChange={(e) => set('date', e.target.value)}
              className={`form-input ${errors.date ? 'form-input-error' : ''}`}
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="form-label flex items-center gap-2 mb-0">
                <Clock className="w-4 h-4 text-caramel" />
                Duration
              </label>
              <span className="text-xs text-navy-400 font-medium">
                Selected: <strong className="text-navy font-semibold">{form.duration} {form.duration === 1 ? 'Hour' : 'Hours'}</strong>
              </span>
            </div>

            {/* Quick Chips for Most Common Durations */}
            <div className="grid grid-cols-3 gap-2.5 mb-2.5">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('duration', val)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-150
                    ${form.duration === val
                      ? 'bg-navy text-cream-200 border-navy shadow-soft'
                      : 'bg-white text-navy border-cream-400 hover:border-navy'
                    }`}
                >
                  {val} {val === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>

            {/* Dropdown for custom durations up to 6 hours */}
            <div className="relative">
              <select
                id="booking-duration-select"
                value={form.duration}
                onChange={(e) => set('duration', parseFloat(e.target.value))}
                aria-label="Select custom booking duration"
                className="form-input text-sm font-medium py-2.5 bg-white text-navy border-cream-400 focus:border-navy cursor-pointer"
              >
                <option value="" disabled>Or choose extended duration (up to 6 hours)...</option>
                {BOOKING_DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} {d.value >= 4 ? '🔥 Long Session' : ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-navy-300 mt-1.5">Extended sessions up to 6 hours are supported for tournaments or private group play.</p>
          </div>

          {/* Availability Grid */}
          {form.date && (
            <div>
              <label className="form-label flex items-center gap-2">
                <Clock className="w-4 h-4 text-caramel" />
                Select Time
              </label>
              {availError ? (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                  {availError}
                </div>
              ) : (
                <AvailabilityGrid
                  date={form.date}
                  courtId={court.id}
                  courtName={court.name}
                  bookedSlots={slots}
                  selectedTime={form.startTime}
                  selectedDuration={form.duration}
                  onSelectTime={(t) => set('startTime', t)}
                  loading={availLoading}
                />
              )}
              {errors.startTime && <p className="form-error mt-2">{errors.startTime}</p>}
              {slotError && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                  {slotError}
                </div>
              )}

              {/* Selected slot preview */}
              {form.startTime && endTime && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-navy/5 rounded-xl border border-navy/10">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-navy">
                    Selected:{' '}
                    <strong>
                      {form.startTime} – {endTime}
                    </strong>{' '}
                    on{' '}
                    <strong>{formatDateDisplay(form.date)}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="divider" />

          {/* Customer Name */}
          <div>
            <label htmlFor="booking-name" className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-caramel" />
              Full Name
            </label>
            <input
              id="booking-name"
              type="text"
              placeholder="Your full name"
              value={form.customerName}
              onChange={(e) => set('customerName', e.target.value)}
              className={`form-input ${errors.customerName ? 'form-input-error' : ''}`}
              autoComplete="name"
            />
            {errors.customerName && <p className="form-error">{errors.customerName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="booking-phone" className="form-label flex items-center gap-2">
              <Phone className="w-4 h-4 text-caramel" />
              Phone Number
            </label>
            <input
              id="booking-phone"
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Players */}
          <div>
            <label htmlFor="booking-players" className="form-label flex items-center gap-2">
              <Users className="w-4 h-4 text-caramel" />
              Number of Players
            </label>
            <div className="flex items-center gap-3 max-w-[220px]">
              <button
                type="button"
                onClick={() => set('playerCount', Math.max(1, form.playerCount - 1))}
                className="w-11 h-11 rounded-xl border-2 border-cream-400 bg-white hover:border-navy text-navy font-bold text-lg flex items-center justify-center transition-colors"
                aria-label="Decrease players"
              >
                −
              </button>
              <input
                id="booking-players"
                type="number"
                min="1"
                max="50"
                value={form.playerCount || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  set('playerCount', isNaN(val) ? 1 : Math.max(1, val));
                }}
                className={`form-input text-center font-semibold text-lg py-2.5 ${errors.playerCount ? 'form-input-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => set('playerCount', (form.playerCount || 0) + 1)}
                className="w-11 h-11 rounded-xl border-2 border-cream-400 bg-white hover:border-navy text-navy font-bold text-lg flex items-center justify-center transition-colors"
                aria-label="Increase players"
              >
                +
              </button>
            </div>
            <p className="text-xs text-navy-300 mt-1.5">Standard court plays 4, but larger groups and friends are welcome.</p>
            {errors.playerCount && <p className="form-error">{errors.playerCount}</p>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="booking-notes" className="form-label flex items-center gap-2">
              <FileText className="w-4 h-4 text-caramel" />
              Notes{' '}
              <span className="text-navy-300 font-normal">(optional)</span>
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              placeholder="Any special requests or notes..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleProceed}
            disabled={submitting}
            className="btn-primary w-full btn-lg group"
            id="booking-proceed-btn"
          >
            {submitting ? (
              'Checking availability...'
            ) : (
              <>
                Review Booking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

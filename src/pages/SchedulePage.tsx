// ============================================================
// JIOS — Schedule Page (Public)
// Shows court availability by date — NO PII exposed
// ============================================================

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format, subDays } from 'date-fns';
import { COURTS } from '../config/site';
import { useAvailability } from '../hooks/useAvailability';
import AvailabilityGrid from '../components/AvailabilityGrid';
import { ErrorState } from '../components/States';
import { getTodayString, formatDateDisplay } from '../utils';

function CourtSchedule({ date, courtId, courtName }: {
  date: string;
  courtId: string;
  courtName: string;
}) {
  const { slots, loading, error, refetch } = useAvailability(date, courtId);

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="card">
      <AvailabilityGrid
        date={date}
        courtId={courtId}
        courtName={courtName}
        bookedSlots={slots}
        selectedTime={null}
        selectedDuration={1}
        onSelectTime={() => {}} // read-only on schedule page
        loading={loading}
      />
    </div>
  );
}

export default function SchedulePage() {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState(today);

  const goToDate = (dateStr: string) => {
    if (dateStr >= today) setSelectedDate(dateStr);
  };

  const prevDay = () => {
    const prev = format(subDays(new Date(selectedDate), 1), 'yyyy-MM-dd');
    if (prev >= today) setSelectedDate(prev);
  };

  const nextDay = () => {
    const next = format(addDays(new Date(selectedDate), 1), 'yyyy-MM-dd');
    setSelectedDate(next);
  };

  return (
    <main className="min-h-screen bg-cream-200">
      {/* Top spacer for header */}
      <div className="h-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-10">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-3">
            Availability
          </span>
          <h1 className="section-title">Court Schedule</h1>
          <p className="text-navy-300 mt-2">
            View available time slots. Book a court to secure your session.
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={prevDay}
            disabled={selectedDate <= today}
            className="p-2.5 rounded-xl border border-cream-400 bg-white text-navy
                       hover:bg-cream-200 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-150"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-4 h-4 text-caramel" />
              </div>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => goToDate(e.target.value)}
                className="form-input pl-10 cursor-pointer"
                id="schedule-date-picker"
                aria-label="Select date"
              />
            </div>

            {/* Quick date buttons */}
            <div className="hidden sm:flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                const d = format(addDays(new Date(today), offset), 'yyyy-MM-dd');
                const label = offset === 0 ? 'Today' : format(addDays(new Date(today), offset), 'EEE d');
                const isSelected = d === selectedDate;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap
                      ${isSelected
                        ? 'bg-navy text-cream-200'
                        : 'bg-white text-navy border border-cream-400 hover:border-navy'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={nextDay}
            className="p-2.5 rounded-xl border border-cream-400 bg-white text-navy
                       hover:bg-cream-200 transition-all duration-150"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date display */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-navy">
            {formatDateDisplay(selectedDate)}
          </h2>
          {selectedDate === today && (
            <span className="badge badge-available">Today</span>
          )}
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-sm text-blue-700">
          🔒 For privacy, only availability status is shown. Customer details are not displayed.
        </div>

        {/* Court schedules — 1 court only */}
        <div className="space-y-6">
          {COURTS.map((court) => (
            <CourtSchedule
              key={court.id}
              date={selectedDate}
              courtId={court.id}
              courtName={court.name}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center p-8 bg-navy rounded-3xl">
          <h3 className="font-serif text-2xl text-cream-200 mb-2">Ready to play?</h3>
          <p className="text-cream-400 text-sm mb-6">Select an available slot and book your court in minutes.</p>
          <a href="/booking" className="btn-caramel">
            Book a Court
          </a>
        </div>
      </div>
    </main>
  );
}

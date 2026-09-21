// ============================================================
// JIOS — Booking Page (dedicated /booking route)
// ============================================================

import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-cream-200">
      <div className="h-20" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-3">
            Reserve a Court
          </span>
          <h1 className="section-title">Book a Session</h1>
          <p className="text-navy-300 mt-2">
            Select your preferred time, enter your details, and confirm.
          </p>
        </div>
        <BookingForm />
      </div>
    </main>
  );
}

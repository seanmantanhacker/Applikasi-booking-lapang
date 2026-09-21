// ============================================================
// JIOS — Home Page
// ============================================================

import Hero from '../components/Hero';
import PadelInfo from '../components/PadelInfo';
import AboutJios from '../components/AboutJios';
import BookingForm from '../components/BookingForm';
import LocationSection from '../components/LocationSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PadelInfo />
      <AboutJios />

      {/* Booking Section */}
      <section className="section-padding bg-cream-200" id="booking-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-4">
              Reserve Now
            </span>
            <h2 className="section-title">Book a Court</h2>
            <p className="section-subtitle mx-auto text-center mt-3">
              Select your date, pick a time, and you're on the court.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>

      <LocationSection />
    </main>
  );
}

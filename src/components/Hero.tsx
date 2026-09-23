// ============================================================
// JIOS — Hero Section
// ============================================================

import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-hero-pattern"
      aria-label="Hero section"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full max-w-full">
        {/* Large circle — padel ball echo */}
        <div
          className="absolute -top-32 -right-32 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #F5F0E7 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #B9783F 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,240,231,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,231,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-caramel/20 border border-caramel/30 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse-soft" />
          <span className="text-caramel text-xs font-semibold uppercase tracking-widest">
            Premium Padel Venue & Coffee
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-cream-200 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight">
            JIOS
          </span>
          <span
            className="block text-xl sm:text-3xl md:text-4xl font-light mt-2 tracking-widest uppercase break-words"
            style={{ color: '#D0BF9D', letterSpacing: '0.2em' }}
          >
            Padel & Coffee
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-lg sm:text-xl md:text-2xl mb-12 font-light max-w-xl mx-auto"
          style={{ color: '#A09080', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
        >
          Play Padel. Sip Coffee. Enjoy JIOS.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/booking"
            id="hero-book-cta"
            className="btn-caramel btn-lg group w-full sm:w-auto"
          >
            <Calendar className="w-5 h-5" />
            Book a Court
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/schedule"
            id="hero-schedule-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                       px-8 py-4 rounded-2xl text-lg font-medium
                       border-2 border-cream-300/30 text-cream-300
                       hover:border-cream-300/60 hover:text-cream-200
                       transition-all duration-200"
          >
            View Schedule
          </Link>
        </div>

        {/* Stats / Social proof */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { value: '1', label: 'Premium Court' },
            { value: '7am', label: 'Opens Early' },
            { value: '☕', label: 'Coffee & More' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: '#F5F0E7', fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: '#706050' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToBooking}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-cream-400/50 hover:text-cream-400 transition-colors duration-200"
        aria-label="Scroll down"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-cream-400/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-cream-400/50 animate-bounce" />
        </div>
      </button>
    </section>
  );
}

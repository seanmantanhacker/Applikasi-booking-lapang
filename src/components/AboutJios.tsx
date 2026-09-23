// ============================================================
// JIOS — About JIOS Section
// ============================================================

import { Link } from 'react-router-dom';
import { Coffee, Target, Heart } from 'lucide-react';

const pillars = [
  {
    icon: <Target className="w-6 h-6" />,
    title: 'World-Class Padel',
    description:
      'A fully equipped, premium indoor padel court with professional glass walls, great lighting, and perfect playing surface.',
    accent: 'bg-navy',
    bg: 'bg-cream-200',
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: 'Specialty Coffee',
    description:
      'Handcrafted specialty coffee and café drinks to fuel your game. Sip while you watch, or settle in after a match.',
    accent: 'bg-caramel',
    bg: 'bg-navy',
    inverted: true,
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Community First',
    description:
      'JIOS is more than a venue. It is a gathering place — for weekend warriors, friends, and anyone who loves the good life.',
    accent: 'bg-navy',
    bg: 'bg-cream-200',
  },
];

export default function AboutJios() {
  return (
    <section id="about" className="section-padding bg-cream-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-4">
            Our Story
          </span>
          <h2 className="section-title mx-auto">About JIOS</h2>
          <p className="section-subtitle mx-auto text-center mt-4">
            Where the energy of padel meets the warmth of a great cup of coffee.
          </p>
        </div>

        {/* Main concept callout */}
        <div className="relative bg-navy rounded-3xl sm:rounded-4xl p-6 sm:p-12 mb-12 overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #B9783F 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
          <div className="relative z-10 max-w-2xl">
            <blockquote
              className="text-3xl sm:text-4xl font-light leading-relaxed mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#F5F0E7', fontStyle: 'italic' }}
            >
              "Come for the game. Stay for the coffee."
            </blockquote>
            <p className="text-cream-400 leading-relaxed text-base sm:text-lg">
              JIOS was born from a simple idea: that the best moments in life happen when
              sport and community come together. We built a space where you can push your
              limits on the court, then unwind with a carefully crafted drink and good company.
            </p>
            <div className="mt-8">
              <Link to="/booking" className="btn-caramel">
                Reserve Your Spot
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={`${p.bg} rounded-3xl p-8 ${p.inverted ? 'text-cream-200' : ''}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${p.accent} flex items-center justify-center mb-6
                  ${p.inverted ? 'text-cream-200' : 'text-cream-200'}`}
              >
                {p.icon}
              </div>
              <h3
                className={`font-serif text-xl mb-3 ${p.inverted ? 'text-cream-100' : 'text-navy'}`}
              >
                {p.title}
              </h3>
              <p className={`text-sm leading-relaxed ${p.inverted ? 'text-cream-400' : 'text-navy-300'}`}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

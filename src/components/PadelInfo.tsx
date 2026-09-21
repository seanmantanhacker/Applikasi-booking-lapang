// ============================================================
// JIOS — What is Padel? Section
// ============================================================

import { Users, Zap, Star, Award } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Easy to Learn',
    description: 'Padel has simple rules and a short learning curve — perfect for first-timers.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Social & Fun',
    description: 'Always played in doubles, padel is about teamwork, banter, and good energy.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Great for All Levels',
    description: 'Whether you are a complete beginner or a seasoned player, padel welcomes everyone.',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Fast & Dynamic',
    description: 'Points are short and rallies are exciting. Every game keeps you on your toes.',
  },
];

export default function PadelInfo() {
  return (
    <section id="padel" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-4">
              The Sport
            </span>
            <h2 className="section-title mb-6">What is Padel?</h2>
            <p className="text-navy-400 text-lg leading-relaxed mb-8">
              Padel is a fast, social racket sport that combines elements of{' '}
              <span className="font-semibold text-navy">tennis and squash</span>. Played on an
              enclosed court smaller than a tennis court, the walls are part of the game — adding
              a unique tactical dimension you won't find anywhere else.
            </p>
            <p className="text-navy-400 leading-relaxed mb-10">
              It is easy to pick up, incredibly addictive, and best enjoyed with friends.
              Most people are rallying within minutes of picking up a racket.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-cream-200 hover:bg-cream-300 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-cream-200 flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm mb-1">{f.title}</h3>
                    <p className="text-navy-300 text-xs leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Court diagram */}
            <div className="relative bg-navy rounded-4xl p-8 aspect-[3/4] flex items-center justify-center overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #F5F0E7, #F5F0E7 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #F5F0E7, #F5F0E7 1px, transparent 1px, transparent 40px)',
                }}
              />

              {/* Padel court SVG diagram */}
              <svg viewBox="0 0 200 280" className="w-full max-w-[260px] relative z-10" fill="none">
                {/* Court outline */}
                <rect x="10" y="10" width="180" height="260" rx="4" stroke="#F5F0E7" strokeWidth="3" opacity="0.6" />
                {/* Net */}
                <line x1="10" y1="140" x2="190" y2="140" stroke="#B9783F" strokeWidth="3" />
                {/* Service lines */}
                <line x1="10" y1="96" x2="190" y2="96" stroke="#F5F0E7" strokeWidth="1.5" opacity="0.3" />
                <line x1="10" y1="184" x2="190" y2="184" stroke="#F5F0E7" strokeWidth="1.5" opacity="0.3" />
                {/* Center line */}
                <line x1="100" y1="96" x2="100" y2="184" stroke="#F5F0E7" strokeWidth="1.5" opacity="0.3" />
                {/* Players */}
                <circle cx="65" cy="70" r="8" fill="#B9783F" opacity="0.8" />
                <circle cx="135" cy="70" r="8" fill="#B9783F" opacity="0.8" />
                <circle cx="65" cy="210" r="8" fill="#F5F0E7" opacity="0.5" />
                <circle cx="135" cy="210" r="8" fill="#F5F0E7" opacity="0.5" />
                {/* Ball trajectory */}
                <path d="M65 70 Q100 130 135 210" stroke="#B9783F" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                {/* Glass walls */}
                <rect x="10" y="10" width="10" height="260" rx="2" fill="#F5F0E7" opacity="0.05" />
                <rect x="180" y="10" width="10" height="260" rx="2" fill="#F5F0E7" opacity="0.05" />
              </svg>

              {/* Labels */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="text-cream-400 text-xs uppercase tracking-widest">Padel Court</span>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-caramel rounded-2xl p-4 shadow-strong">
              <p className="text-cream-100 text-xs font-semibold uppercase tracking-wide">Court Size</p>
              <p className="text-cream-200 text-lg font-bold mt-1">10 × 20 m</p>
              <p className="text-cream-300 text-xs mt-0.5">Enclosed glass walls</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

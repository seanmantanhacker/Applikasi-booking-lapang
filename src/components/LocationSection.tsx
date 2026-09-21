// ============================================================
// JIOS — Location Section
// ============================================================

import { MapPin, Phone, Clock, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function LocationSection() {
  return (
    <section id="location" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-4">
            Find Us
          </span>
          <h2 className="section-title">Location & Hours</h2>
          <p className="section-subtitle mx-auto text-center mt-3">
            Come visit us — we're easy to find and always ready to welcome you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map placeholder */}
          <div className="lg:col-span-3">
            <div className="relative h-72 sm:h-96 bg-navy rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Decorative map visual */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #F5F0E7, #F5F0E7 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #F5F0E7, #F5F0E7 1px, transparent 1px, transparent 30px)',
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-caramel/20 border-2 border-caramel flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-caramel" />
                </div>
                <div className="text-center">
                  <p className="text-cream-200 font-semibold">{SITE_CONFIG.BUSINESS_NAME}</p>
                  <p className="text-cream-400 text-sm mt-1">{SITE_CONFIG.ADDRESS}</p>
                </div>
                <a
                  href={SITE_CONFIG.GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-caramel btn-sm"
                  id="get-directions-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Directions
                </a>
              </div>

              {/* Decorative road pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 300">
                <line x1="0" y1="150" x2="400" y2="150" stroke="#F5F0E7" strokeWidth="20" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#F5F0E7" strokeWidth="20" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#F5F0E7" strokeWidth="8" />
                <line x1="0" y1="220" x2="400" y2="220" stroke="#F5F0E7" strokeWidth="8" />
                <line x1="100" y1="0" x2="100" y2="300" stroke="#F5F0E7" strokeWidth="8" />
                <line x1="300" y1="0" x2="300" y2="300" stroke="#F5F0E7" strokeWidth="8" />
              </svg>
            </div>
          </div>

          {/* Info cards */}
          <div className="lg:col-span-2 space-y-5">
            {/* Address */}
            <div className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-cream-200" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Address</h3>
                <p className="text-navy-300 text-sm leading-relaxed">{SITE_CONFIG.ADDRESS}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-cream-200" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Phone</h3>
                <a
                  href={`tel:${SITE_CONFIG.PHONE}`}
                  className="text-caramel hover:text-caramel-600 text-sm font-medium transition-colors"
                >
                  {SITE_CONFIG.PHONE}
                </a>
                <div className="flex items-center gap-3 mt-2">
                  <a
                    href={SITE_CONFIG.WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-navy-300 hover:text-navy transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${SITE_CONFIG.EMAIL}`}
                    className="flex items-center gap-1.5 text-xs text-navy-300 hover:text-navy transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-cream-200" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy mb-3">Opening Hours</h3>
                  <div className="space-y-2">
                    {SITE_CONFIG.OPENING_HOURS.map((h) => (
                      <div key={h.day} className="flex justify-between items-center text-sm">
                        <span className="text-navy-300">{h.day}</span>
                        <span className="font-semibold text-navy">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

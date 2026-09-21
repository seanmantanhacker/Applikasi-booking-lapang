// ============================================================
// JIOS — Footer Component
// ============================================================

import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, MapPin, Phone, Clock } from 'lucide-react';
import JiosLogo from './JiosLogo';
import { SITE_CONFIG } from '../config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <JiosLogo variant="light" size="lg" />
            <p className="text-cream-400 text-sm leading-relaxed max-w-xs">
              {SITE_CONFIG.BUSINESS_DESCRIPTION}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-cream-200/10 flex items-center justify-center
                           hover:bg-caramel hover:text-cream-100 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-cream-200/10 flex items-center justify-center
                           hover:bg-caramel hover:text-cream-100 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.EMAIL}`}
                className="w-9 h-9 rounded-xl bg-cream-200/10 flex items-center justify-center
                           hover:bg-caramel hover:text-cream-100 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-cream-200 text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Book a Court', to: '/booking' },
                { label: 'View Schedule', to: '/schedule' },
                { label: 'Admin', to: '/admin' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-cream-400 hover:text-cream-200 text-sm transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-cream-200 text-lg mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-caramel flex-shrink-0 mt-0.5" />
                <span className="text-cream-400 text-sm">{SITE_CONFIG.ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-caramel flex-shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.PHONE}`}
                  className="text-cream-400 hover:text-cream-200 text-sm transition-colors"
                >
                  {SITE_CONFIG.PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-caramel flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  {SITE_CONFIG.OPENING_HOURS.map((h) => (
                    <div key={h.day} className="text-cream-400">
                      <span className="text-cream-300 font-medium">{h.day}:</span> {h.hours}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-200/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-500 text-xs">
            © {year} JIOS Padel & Coffee. All rights reserved.
          </p>
          <p className="text-cream-500 text-xs">
            Made with ♥ for the padel community
          </p>
        </div>
      </div>
    </footer>
  );
}

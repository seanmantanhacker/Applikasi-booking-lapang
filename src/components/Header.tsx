// ============================================================
// JIOS — Header Component
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import JiosLogo from './JiosLogo';

const NAV_LINKS = [
  { label: 'Home', href: '/', hash: '' },
  { label: 'Padel', href: '/#padel', hash: 'padel' },
  { label: 'About', href: '/#about', hash: 'about' },
  { label: 'Schedule', href: '/schedule', hash: '' },
  { label: 'Location', href: '/#location', hash: 'location' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const isHeaderSolid = scrolled || !isHomePage;

  useEffect(() => {
    // If arriving at home page with a hash in URL (or location state), scroll to it
    if (isHomePage && location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location, isHomePage]);

  const handleNavClick = (href: string, hash: string) => {
    if (hash) {
      if (isHomePage) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate({ pathname: '/', hash: `#${hash}` });
      }
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
        isHeaderSolid
          ? 'bg-white/95 backdrop-blur-soft shadow-soft border-b border-cream-300/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full">
          {/* Logo */}
          <Link to="/" aria-label="JIOS Padel & Coffee Home" className="flex-shrink-0">
            <JiosLogo
              variant={isHeaderSolid ? 'dark' : 'light'}
              size="md"
              className="transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === location.pathname;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.hash)}
                  className={`nav-link text-sm font-medium transition-colors ${
                    isHeaderSolid
                      ? isActive
                        ? 'text-caramel font-semibold'
                        : 'text-navy-400 hover:text-navy'
                      : 'text-cream-300 hover:text-cream-100'
                  }`}
                  style={{ color: isHeaderSolid ? undefined : '#D0BF9D' }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/booking" className="btn-caramel btn-sm">
              Book a Court
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors flex-shrink-0 ${
              isHeaderSolid ? 'text-navy hover:bg-cream-300' : 'text-cream-200 hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            id="mobile-menu-button"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden bg-white rounded-2xl shadow-strong mb-4 p-4 mobile-menu-enter"
            id="mobile-menu"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.hash)}
                  className="w-full text-left px-4 py-3 rounded-xl text-navy font-medium hover:bg-cream-200 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-cream-300">
                <Link
                  to="/booking"
                  className="btn-caramel w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Book a Court
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

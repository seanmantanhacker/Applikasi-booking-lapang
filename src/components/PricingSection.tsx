// ============================================================
// JIOS Padel & Coffee — Pricing Section Component
// Displays hourly rates (Weekday/Weekend) & Monthly Member packages
// ============================================================

import { useState } from 'react';
import { Clock, Calendar, Check, Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRICING_CONFIG, SITE_CONFIG } from '../config/site';
import { formatRupiah } from '../utils';

type PricingTab = 'hourly' | 'membership';

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<PricingTab>('hourly');

  const handleBookClick = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/booking';
    }
  };

  const getWaLinkForMember = (packageName: string, price: number) => {
    const phone = SITE_CONFIG.PHONE.replace(/[^\d+]/g, '').replace('+', '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    const text = `Halo Admin JIOS Padel & Coffee, saya tertarik untuk mendaftar paket member:
Paket: ${packageName} (${formatRupiah(price)})
Mohon info ketersediaan slot dan cara pendaftarannya. Terima kasih!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="section-padding bg-cream-100 relative overflow-hidden" id="pricing">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-caramel text-xs font-semibold uppercase tracking-widest mb-3">
            Pricelist & Memberships
          </span>
          <h2 className="section-title">Tarif Lapangan & Paket Member</h2>
          <p className="section-subtitle mt-3 text-navy-300">
            Transparan, terjangkau, dan fleksibel. Pilih tarif per jam sesuai jam main favoritmu atau hemat lebih banyak dengan paket member bulanan.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 bg-cream-300/70 backdrop-blur-sm rounded-2xl mt-8 border border-cream-400/50">
            <button
              onClick={() => setActiveTab('hourly')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'hourly'
                  ? 'bg-navy text-cream-200 shadow-soft'
                  : 'text-navy/70 hover:text-navy hover:bg-white/40'
                }`}
            >
              <Clock className="w-4 h-4" />
              Tarif Per Jam
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'membership'
                  ? 'bg-navy text-cream-200 shadow-soft'
                  : 'text-navy/70 hover:text-navy hover:bg-white/40'
                }`}
            >
              <Sparkles className="w-4 h-4 text-caramel" />
              Paket Member Bulanan
            </button>
          </div>
        </div>

        {/* Tab 1: Hourly Rates */}
        {activeTab === 'hourly' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Weekday Card */}
              <div className="card p-6 sm:p-8 flex flex-col justify-between border border-cream-300 hover:border-caramel/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-cream-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
                        <Calendar className="w-5 h-5 text-caramel" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-navy font-bold">Weekday Sessions</h3>
                        <p className="text-xs text-navy-300 font-medium">Senin s/d Jumat (08:00 – 22:00)</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase px-3 py-1 bg-cream-200 text-navy-400 rounded-full">
                      Mon – Fri
                    </span>
                  </div>

                  <div className="divide-y divide-cream-200 my-6">
                    {PRICING_CONFIG.weekday.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-navy text-base">{item.name}</span>
                            {item.badge && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-caramel/15 text-caramel">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-navy-300 font-medium">
                            <Clock className="w-3.5 h-3.5 text-caramel" />
                            <span>{item.timeRange}</span>
                          </div>
                          <p className="text-xs text-navy-400 leading-relaxed pr-2 pt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 pt-0.5">
                          <div className="font-serif font-bold text-xl sm:text-2xl text-navy">
                            {formatRupiah(item.pricePerHour)}
                          </div>
                          <span className="text-[11px] text-navy-300 font-medium">/ jam</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-cream-200">
                  <button
                    onClick={handleBookClick}
                    className="btn-primary w-full justify-center group"
                  >
                    <span>Pilih Jam Weekday & Booking</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Weekend Card */}
              <div className="card-navy p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-caramel/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-navy-400/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-caramel/20 flex items-center justify-center text-caramel">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-cream-100 font-bold">Weekend Sessions</h3>
                        <p className="text-xs text-cream-400 font-medium">Sabtu & Minggu (08:00 – 22:00)</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase px-3 py-1 bg-caramel text-cream-100 rounded-full">
                      Sat – Sun
                    </span>
                  </div>

                  <div className="my-6 space-y-6">
                    {PRICING_CONFIG.weekend.map((item) => (
                      <div key={item.id} className="p-5 rounded-2xl bg-navy-600/70 border border-navy-400/30">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="font-semibold text-cream-100 text-lg block">{item.name}</span>
                            <div className="flex items-center gap-1.5 text-xs text-caramel-200 font-medium mt-1">
                              <Clock className="w-3.5 h-3.5 text-caramel" />
                              <span>{item.timeRange}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-serif font-bold text-2xl sm:text-3xl text-caramel">
                              {formatRupiah(item.pricePerHour)}
                            </div>
                            <span className="text-[11px] text-cream-400 font-medium">/ jam</span>
                          </div>
                        </div>
                        <p className="text-xs text-cream-300 leading-relaxed mt-3">
                          {item.description}
                        </p>
                      </div>
                    ))}

                    <div className="p-4 rounded-xl bg-navy-700/60 border border-navy-400/20 text-xs text-cream-300 space-y-2">
                      <div className="flex items-center gap-2 font-medium text-cream-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Fasilitas Termasuk dalam Setiap Sesi:</span>
                      </div>
                      <p className="pl-6 text-cream-400">
                        Peminjaman bola padel, akses ruang istirahat ber-AC, locker room, serta spot nongkrong nyaman di JIOS Café.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-navy-400/30">
                  <button
                    onClick={handleBookClick}
                    className="btn-caramel w-full justify-center group"
                  >
                    <span>Cek Slot Weekend Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Membership Packages */}
        {activeTab === 'membership' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {PRICING_CONFIG.membership.map((pkg) => {
                const isPopular = pkg.popular;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${isPopular
                        ? 'bg-navy text-cream-200 shadow-strong ring-2 ring-caramel scale-[1.02] z-10'
                        : 'bg-white text-navy shadow-soft border border-cream-300 hover:shadow-medium hover:-translate-y-1'
                      }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-caramel text-cream-100 shadow-md">
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Title & Quota */}
                      <div className="mb-4">
                        <h3 className={`font-serif text-lg font-bold ${isPopular ? 'text-cream-100' : 'text-navy'}`}>
                          {pkg.name}
                        </h3>
                        <p className={`text-xs mt-1 font-medium ${isPopular ? 'text-caramel-200' : 'text-navy-300'}`}>
                          {pkg.timeAllowed}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="pb-5 mb-5 border-b border-cream-300/40">
                        <div className="flex items-baseline gap-1">
                          <span className={`font-serif font-bold text-2xl sm:text-3xl ${isPopular ? 'text-caramel' : 'text-navy'}`}>
                            {formatRupiah(pkg.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs font-medium ${isPopular ? 'text-cream-400' : 'text-navy-300'}`}>
                            Kuota: <strong>{pkg.hours} Jam</strong>
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-md ${isPopular ? 'bg-navy-600 text-cream-300' : 'bg-cream-200 text-navy-400'}`}>
                            {pkg.validity}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6 text-xs">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? 'bg-caramel/20 text-caramel' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className={isPopular ? 'text-cream-300 leading-relaxed' : 'text-navy-400 leading-relaxed'}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="pt-4">
                      <a
                        href={getWaLinkForMember(pkg.name, pkg.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${isPopular
                            ? 'bg-caramel text-cream-100 hover:bg-caramel-600 shadow-soft'
                            : 'bg-navy text-cream-200 hover:bg-navy-600'
                          }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Daftar Member Ini</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note banner */}
            <div className="card bg-cream-200 border border-cream-400/60 p-4 text-xs text-navy-400 text-center max-w-3xl mx-auto rounded-2xl">
              💡 <strong>Catatan Member:</strong> Masa aktif kuota berlaku 30 hari sejak tanggal aktivasi. Reservasi slot member dapat dilakukan langsung ke kasir atau via WhatsApp resmi JIOS.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

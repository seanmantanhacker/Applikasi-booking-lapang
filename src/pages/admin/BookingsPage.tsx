// ============================================================
// JIOS — Admin Bookings List Page
// ============================================================

import { useState, useMemo } from 'react';
import { Search, RefreshCw, Edit2, MoveRight, Calendar } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import BookingModal from '../../components/admin/BookingModal';
import { useBookings } from '../../hooks/useBookings';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import type { Booking } from '../../types';
import { formatDateDisplay, formatDuration } from '../../utils';

export default function AdminBookingsPage() {
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { bookings, loading, error, refetch } = useBookings(filterDate || undefined);

  const filtered = useMemo(() => {
    let result = bookings;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.referenceId.toLowerCase().includes(q) ||
          b.phone.includes(q)
      );
    }
    
    return [...result].sort((a, b) => {
      // 1. Sort by status: initiated first (weight 1), confirmed (weight 2), others last
      const getWeight = (status: string) => {
        if (status === 'initiated') return 1;
        if (status === 'confirmed') return 2;
        return 3;
      };
      const weightA = getWeight(a.status);
      const weightB = getWeight(b.status);

      if (weightA !== weightB) {
        return weightA - weightB;
      }

      // 2. Sort by createdAt: newest first (descending)
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;

      return dateB - dateA;
    });
  }, [bookings, search]);

  return (
    <AdminLayout title="All Bookings">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">All Bookings</h1>
          <p className="text-navy-300 text-sm mt-1">
            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}{' '}
            {filterDate ? `on ${formatDateDisplay(filterDate)}` : 'total'}
          </p>
        </div>
        <button onClick={refetch} className="btn-ghost btn-sm">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date filter */}
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-4 h-4 text-caramel flex-shrink-0" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="form-input text-sm"
              placeholder="Filter by date"
              id="bookings-date-filter"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="text-xs text-navy-300 hover:text-navy transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, reference, phone..."
              className="form-input pl-10 text-sm"
              id="bookings-search"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading bookings..." />
      ) : error ? (
        <ErrorState description={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={search ? 'No bookings match your search.' : 'No bookings for this date.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="card-hover flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedBooking(booking)}
              id={`booking-row-${booking.id}`}
            >
              {/* Reference & Status */}
              <div className="flex-shrink-0 flex flex-col items-start gap-1.5 w-24">
                <span className="badge bg-cream-300 text-navy-500 text-[10px]">
                  {booking.referenceId}
                </span>
                {booking.status === 'initiated' && (
                  <span className="badge bg-amber-100 text-amber-700 text-[9px]">Initiated</span>
                )}
                {booking.status === 'confirmed' && (
                  <span className="badge bg-emerald-100 text-emerald-700 text-[9px]">Confirmed</span>
                )}
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-navy text-sm truncate">{booking.customerName}</div>
                <div className="text-navy-300 text-xs mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>{formatDateDisplay(booking.date)}</span>
                  <span>·</span>
                  <span>{booking.startTime} – {booking.endTime}</span>
                  <span>·</span>
                  <span>{formatDuration(booking.duration)}</span>
                  <span>·</span>
                  <span>{booking.playerCount} players</span>
                </div>
              </div>

              {/* Phone */}
              <div className="text-navy-300 text-sm hidden md:block">
                {booking.phone}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="p-2 rounded-lg text-navy-300 hover:text-navy hover:bg-cream-200 transition-colors"
                  title="View/Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="p-2 rounded-lg text-navy-300 hover:text-navy hover:bg-cream-200 transition-colors"
                  title="Move"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={() => {
            setSelectedBooking(null);
            refetch();
          }}
        />
      )}
    </AdminLayout>
  );
}

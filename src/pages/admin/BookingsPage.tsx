// ============================================================
// JIOS — Admin Bookings List Page
// ============================================================

import { useState, useMemo } from 'react';
import { Search, RefreshCw, Edit2, MoveRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import AdminLayout from '../../layouts/AdminLayout';
import BookingModal from '../../components/admin/BookingModal';
import { useBookings } from '../../hooks/useBookings';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import type { Booking } from '../../types';
import { formatDateDisplay, formatDuration, getTodayString } from '../../utils';

type FilterPreset = 'today' | 'month' | 'custom' | 'all';

const ITEMS_PER_PAGE = 10;

export default function AdminBookingsPage() {
  const today = getTodayString();
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('today');
  const [customDate, setCustomDate] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // If filter is specific to single date (today or custom), pass to backend query to optimize network payload
  const backendDateFilter = 
    filterPreset === 'today' 
      ? today 
      : filterPreset === 'custom' && customDate 
        ? customDate 
        : undefined;

  const { bookings, loading, error, refetch } = useBookings(backendDateFilter);

  // Filter and sort bookings
  const filtered = useMemo(() => {
    let result = bookings;

    // Filter by This Month if selected
    if (filterPreset === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      result = result.filter((b) => {
        try {
          const bookingDate = parseISO(b.date);
          return isWithinInterval(bookingDate, { start: monthStart, end: monthEnd });
        } catch {
          return false;
        }
      });
    }

    // Filter by Search Query
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

      // 2. Sort by date: newest first
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }

      // 3. Sort by createdAt: newest first
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;

      return dateB - dateA;
    });
  }, [bookings, filterPreset, search]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBookings = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, validCurrentPage]);

  const handlePresetChange = (preset: FilterPreset) => {
    setFilterPreset(preset);
    setCurrentPage(1);
  };

  const getSubheaderText = () => {
    if (filterPreset === 'today') return `Today (${formatDateDisplay(today)})`;
    if (filterPreset === 'month') return `This Month (${format(new Date(), 'MMMM yyyy')})`;
    if (filterPreset === 'custom' && customDate) return `on ${formatDateDisplay(customDate)}`;
    return 'All Records / History';
  };

  return (
    <AdminLayout title="All Bookings">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">All Bookings</h1>
          <p className="text-navy-300 text-sm mt-1">
            {filtered.length} booking{filtered.length !== 1 ? 's' : ''} · {getSubheaderText()}
          </p>
        </div>
        <button onClick={refetch} className="btn-ghost btn-sm self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Preset Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => handlePresetChange('today')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterPreset === 'today'
              ? 'bg-navy text-cream-100 shadow-sm'
              : 'bg-cream-200 text-navy-400 hover:bg-cream-300'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handlePresetChange('month')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterPreset === 'month'
              ? 'bg-navy text-cream-100 shadow-sm'
              : 'bg-cream-200 text-navy-400 hover:bg-cream-300'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => handlePresetChange('custom')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterPreset === 'custom'
              ? 'bg-navy text-cream-100 shadow-sm'
              : 'bg-cream-200 text-navy-400 hover:bg-cream-300'
          }`}
        >
          Pick Date
        </button>
        <button
          onClick={() => handlePresetChange('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterPreset === 'all'
              ? 'bg-navy text-cream-100 shadow-sm'
              : 'bg-cream-200 text-navy-400 hover:bg-cream-300'
          }`}
        >
          All Records
        </button>
      </div>

      {/* Search & Custom Date Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Custom Date Input (shown when custom is selected) */}
          {filterPreset === 'custom' && (
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-4 h-4 text-caramel flex-shrink-0" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input text-sm"
                placeholder="Choose date"
                id="bookings-date-filter"
              />
            </div>
          )}

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, reference code, phone..."
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
          description={
            search
              ? 'No bookings match your search.'
              : filterPreset === 'today'
              ? 'No bookings scheduled for today.'
              : 'No bookings found for the selected period.'
          }
        />
      ) : (
        <div className="space-y-3">
          {paginatedBookings.map((booking) => (
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
                <span className="badge bg-cream-300 text-navy-500 font-mono font-medium text-[10px]">
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-cream-200">
              <span className="text-xs text-navy-300">
                Page {validCurrentPage} of {totalPages} ({filtered.length} total items)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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

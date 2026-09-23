// ============================================================
// JIOS — Admin Dashboard Page
// ============================================================

import { useState } from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { addDays, format } from 'date-fns';
import AdminLayout from '../../layouts/AdminLayout';
import AdminCalendar from '../../components/admin/AdminCalendar';
import { useBookings } from '../../hooks/useBookings';
import { LoadingState } from '../../components/States';
import { getTodayString, formatDateDisplay } from '../../utils';
import { COURTS } from '../../config/site';

export default function AdminDashboardPage() {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState(today);

  const { bookings, loading, error, refetch } = useBookings(selectedDate);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    initiated: bookings.filter((b) => b.status === 'initiated').length,
    players: bookings.reduce((sum, b) => sum + b.playerCount, 0),
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">Dashboard</h1>
          <p className="text-navy-300 text-sm mt-1">
            Manage bookings and court schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="btn-ghost btn-sm"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <a href="/booking" className="btn-caramel btn-sm">
            <Plus className="w-4 h-4" />
            New Booking
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Bookings', value: stats.total, color: 'bg-navy' },
          { label: 'Confirmed', value: stats.confirmed, color: 'bg-emerald-600' },
          { label: 'Initiated', value: stats.initiated, color: 'bg-amber-600' },
          { label: 'Players Today', value: stats.players, color: 'bg-caramel' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className={`text-2xl sm:text-3xl font-bold font-serif text-navy mb-1`}>
              {stat.value}
            </div>
            <div className="text-navy-300 text-xs uppercase tracking-wide font-semibold">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Date selector */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Calendar className="w-5 h-5 text-caramel" />
            <span className="font-semibold text-navy text-sm">View Date:</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input text-sm"
              id="admin-date-picker"
            />
          </div>

          {/* Quick nav */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[-1, 0, 1, 2, 3, 4, 5, 6].map((offset) => {
              const d = format(addDays(new Date(today), offset), 'yyyy-MM-dd');
              const label =
                offset === -1
                  ? 'Yesterday'
                  : offset === 0
                  ? 'Today'
                  : format(addDays(new Date(today), offset), 'EEE d');
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                    ${selectedDate === d
                      ? 'bg-navy text-cream-200'
                      : 'bg-cream-200 text-navy hover:bg-cream-300'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Court label */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-navy">{formatDateDisplay(selectedDate)}</h2>
        <div className="text-xs text-navy-300 bg-cream-300 px-3 py-1 rounded-full">
          {COURTS[0].name}
        </div>
      </div>

      {/* Calendar / Timetable */}
      <div className="card">
        {loading ? (
          <LoadingState message="Loading schedule..." />
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-sm">{error}</div>
        ) : (
          <AdminCalendar
            bookings={bookings}
            date={selectedDate}
            onRefresh={refetch}
          />
        )}
      </div>
    </AdminLayout>
  );
}

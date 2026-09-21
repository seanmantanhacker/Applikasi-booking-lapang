// ============================================================
// JIOS — Admin Booking Modal (View / Edit / Move / Delete)
// ============================================================

import { useState } from 'react';
import { X, Edit2, Trash2, MoveRight, Save, AlertTriangle, Loader2 } from 'lucide-react';
import type { Booking } from '../../types';
import { BOOKING_DURATIONS, COURTS, TIME_SLOTS } from '../../config/site';
import { updateBooking, deleteBooking, moveBooking } from '../../services/bookingService';
import { formatDateDisplay, calculateEndTime, formatDuration } from '../../utils';

type ModalMode = 'view' | 'edit' | 'move' | 'delete-confirm';

interface BookingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdated: () => void;
}

export default function BookingModal({ booking, onClose, onUpdated }: BookingModalProps) {
  const [mode, setMode] = useState<ModalMode>('view');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editName, setEditName] = useState(booking.customerName);
  const [editPhone, setEditPhone] = useState(booking.phone);
  const [editPlayerCount, setEditPlayerCount] = useState(booking.playerCount);
  const [editNotes, setEditNotes] = useState(booking.notes || '');

  // Move state
  const [moveDate, setMoveDate] = useState(booking.date);
  const [moveTime, setMoveTime] = useState(booking.startTime);
  const [moveDuration, setMoveDuration] = useState(booking.duration);

  const court = COURTS[0];

  const handleSaveEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateBooking(booking.id, {
        customerName: editName,
        phone: editPhone,
        playerCount: editPlayerCount,
        notes: editNotes,
      });
      onUpdated();
      onClose();
    } catch {
      setError('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async () => {
    setLoading(true);
    setError(null);
    try {
      await moveBooking(booking.id, moveDate, moveTime, moveDuration, court.id);
      onUpdated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to move booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteBooking(booking.id);
      onUpdated();
      onClose();
    } catch {
      setError('Failed to delete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-soft"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-strong w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-300">
          <div>
            <span className="text-caramel text-xs font-semibold uppercase tracking-widest">
              Booking
            </span>
            <h2 id="booking-modal-title" className="font-serif text-xl text-navy mt-0.5">
              {booking.referenceId}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'view' && (
              <>
                <button
                  onClick={() => setMode('edit')}
                  className="p-2 rounded-xl text-navy-300 hover:bg-cream-200 hover:text-navy transition-colors"
                  title="Edit booking"
                  id="booking-modal-edit-btn"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMode('move')}
                  className="p-2 rounded-xl text-navy-300 hover:bg-cream-200 hover:text-navy transition-colors"
                  title="Move booking"
                  id="booking-modal-move-btn"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMode('delete-confirm')}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete booking"
                  id="booking-modal-delete-btn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-navy-300 hover:bg-cream-200 hover:text-navy transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── VIEW MODE ── */}
          {mode === 'view' && (
            <div className="space-y-4">
              {[
                { label: 'Customer', value: booking.customerName },
                { label: 'Phone', value: booking.phone },
                { label: 'Date', value: formatDateDisplay(booking.date) },
                { label: 'Court', value: court.name },
                {
                  label: 'Time',
                  value: `${booking.startTime} – ${booking.endTime} (${formatDuration(booking.duration)})`,
                },
                { label: 'Players', value: `${booking.playerCount}` },
                { label: 'Notes', value: booking.notes || '—' },
                { label: 'Status', value: booking.status },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 text-sm">
                  <span className="text-navy-300 w-24 flex-shrink-0 pt-0.5 text-xs uppercase tracking-wide font-semibold">
                    {row.label}
                  </span>
                  <span className="text-navy font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {mode === 'edit' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-navy mb-4">Edit Booking Details</h3>

              <div>
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Number of Players</label>
                <div className="flex items-center gap-3 max-w-[200px]">
                  <button
                    type="button"
                    onClick={() => setEditPlayerCount(Math.max(1, editPlayerCount - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-cream-400 bg-white hover:border-navy text-navy font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editPlayerCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setEditPlayerCount(isNaN(val) ? 1 : Math.max(1, val));
                    }}
                    className="form-input text-center font-semibold text-base py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setEditPlayerCount(editPlayerCount + 1)}
                    className="w-10 h-10 rounded-xl border-2 border-cream-400 bg-white hover:border-navy text-navy font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setMode('view'); setError(null); }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} disabled={loading} className="btn-primary flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ── MOVE MODE ── */}
          {mode === 'move' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-navy mb-4">Move Booking</h3>

              <div>
                <label className="form-label">New Date</label>
                <input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">New Start Time</label>
                <select
                  value={moveTime}
                  onChange={(e) => setMoveTime(e.target.value)}
                  className="form-select"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s.time} value={s.time}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Duration</label>
                <div className="flex gap-2">
                  {BOOKING_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setMoveDuration(d.value)}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all
                        ${moveDuration === d.value
                          ? 'bg-navy text-cream-200 border-navy'
                          : 'border-cream-400 text-navy hover:border-navy'
                        }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-cream-200 rounded-xl p-4 text-sm text-navy-300">
                Moving to:{' '}
                <strong className="text-navy">
                  {formatDateDisplay(moveDate)}, {moveTime} –{' '}
                  {calculateEndTime(moveTime, moveDuration)}
                </strong>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setMode('view'); setError(null); }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleMove} disabled={loading} className="btn-primary flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoveRight className="w-4 h-4" />}
                  Move Booking
                </button>
              </div>
            </div>
          )}

          {/* ── DELETE CONFIRM ── */}
          {mode === 'delete-confirm' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-serif text-xl text-navy mb-2">Delete Booking?</h3>
              <p className="text-navy-300 text-sm mb-6">
                This will cancel booking{' '}
                <strong className="text-navy">{booking.referenceId}</strong> for{' '}
                <strong className="text-navy">{booking.customerName}</strong>. This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setMode('view'); setError(null); }} className="btn-secondary flex-1">
                  Keep Booking
                </button>
                <button onClick={handleDelete} disabled={loading} className="btn-danger flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

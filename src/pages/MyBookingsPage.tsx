import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../context/NavigationContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  Calendar,
  CalendarCheck,
  MapPin,
  UserCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  XCircle
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userBookings = await db.getUserBookings(user._id);
      setBookings(userBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
          Authentication Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to view and manage your scheduled reservations.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-amber-500 text-slate-950"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Format booking date using explore new Date() requirement
  const formatBookingDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const formatRentalPeriod = (startStr: string, endStr: string) => {
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${s.toLocaleDateString('en-US', options)} → ${e.toLocaleDateString('en-US', options)}`;
    } catch {
      return `${startStr} - ${endStr}`;
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    setIsCancelling(true);
    try {
      await db.cancelBooking(cancellingBooking._id, user._id);
      showToast('Reservation has been cancelled.', 'info');
      setBookings((prev) =>
        prev.map((b) => (b._id === cancellingBooking._id ? { ...b, status: 'Cancelled' } : b))
      );
      setCancellingBooking(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel reservation.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Reservations
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Review active vehicle bookings, trip durations, chauffeur services, and receipt details.
          </p>
        </div>

        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Book Another Vehicle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bookings Content */}
      {isLoading ? (
        <LoadingSpinner label="Fetching your vehicle reservations..." />
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Thumbnail & Main Info */}
                  <div className="lg:col-span-4 flex items-center gap-4">
                    <img
                      src={booking.carImage}
                      alt={booking.carName}
                      className="w-24 h-18 sm:w-28 sm:h-20 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {booking.carName}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{booking.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Rental Dates & Chauffeur status */}
                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="space-y-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rental Duration ({booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'})</span>
                      </span>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatRentalPeriod(booking.startDate, booking.endDate)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Booked: {formatBookingDate(booking.bookingDate)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Driver Option</span>
                      </span>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {booking.driverNeeded ? 'Executive Chauffeur Included' : 'Self-Drive (Default)'}
                      </div>
                      {booking.specialNote && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                          "{booking.specialNote}"
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Right: Total Price & Actions */}
                  <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 lg:text-right">
                        Total Amount
                      </div>
                      <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums lg:text-right">
                        ${booking.totalPrice}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/cars/${booking.carId}`)}
                        className="py-1.5 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Car Details
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => setCancellingBooking(booking)}
                          className="py-1.5 px-3 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            No Bookings Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            You haven't made any reservations yet. Browse our verified fleet of luxury, sports, and electric vehicles to book your next trip.
          </p>
          <button
            onClick={() => navigate('/cars')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
          >
            <span>Explore Available Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!cancellingBooking}
        title="Cancel Vehicle Reservation"
        message={`Are you sure you want to cancel your reservation for "${cancellingBooking?.carName}"? A full refund of $${cancellingBooking?.totalPrice} will be credited to your account.`}
        confirmLabel="Confirm Cancellation"
        cancelLabel="Keep Reservation"
        isDestructive={true}
        isLoading={isCancelling}
        onConfirm={handleCancelBooking}
        onCancel={() => setCancellingBooking(null)}
      />

    </div>
  );
};

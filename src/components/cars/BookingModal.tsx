import React, { useState } from 'react';
import { Car } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../context/NavigationContext';
import { db } from '../../services/db';
import { X, Calendar, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  car,
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();

  // Tomorrow as default start, +3 days as default end
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const future = new Date(tomorrow);
  future.setDate(future.getDate() + 3);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateInput(tomorrow));
  const [endDate, setEndDate] = useState(formatDateInput(future));
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate duration and total pricing
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(end.getTime() - start.getTime(), 86400000);
  const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  const driverFeePerDay = 45;
  const driverTotalFee = driverNeeded ? driverFeePerDay * totalDays : 0;
  const baseRentalPrice = car.dailyPrice * totalDays;
  const totalPrice = baseRentalPrice + driverTotalFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to complete your vehicle reservation.', 'error');
      navigate('/login');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showToast('Return date must be on or after pickup date.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.createBooking({
        carId: car._id,
        carName: car.name,
        carImage: car.image,
        carType: car.type,
        pickupLocation: car.pickupLocation,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        startDate,
        endDate,
        totalDays,
        dailyPrice: car.dailyPrice,
        driverNeeded,
        driverFee: driverTotalFee,
        totalPrice,
        specialNote: specialNote.trim() || undefined
      });

      showToast(`Reservation confirmed for ${car.name}!`, 'success');
      onBookingSuccess();
      onClose();
      navigate('/my-bookings');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Reserve Vehicle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {car.name} · {car.brand}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Quick Vehicle Summary Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <img
              src={car.image}
              alt={car.name}
              className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {car.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {car.pickupLocation}
              </div>
              <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                ${car.dailyPrice}/day
              </div>
            </div>
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pickup Date
              </label>
              <input
                type="date"
                required
                min={formatDateInput(new Date())}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Return Date
              </label>
              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Driver Needed Switch (Yes/No requirement) */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  <span>Professional Chauffeur Driver</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Licensed executive driver (+$45/day)
                </p>
              </div>

              {/* Segmented Yes / No switch */}
              <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setDriverNeeded(false)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    !driverNeeded
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setDriverNeeded(true)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    driverNeeded
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>

          {/* Special Note Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Special Notes / Requests (Optional)
            </label>
            <textarea
              rows={2}
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Flight number arrival, child safety seat preference, or charging status..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
            />
          </div>

          {/* Price Breakdown Calculation */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>
                Daily rate (${car.dailyPrice} × {totalDays} {totalDays === 1 ? 'day' : 'days'})
              </span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                ${baseRentalPrice}
              </span>
            </div>

            {driverNeeded && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Chauffeur service (${driverFeePerDay} × {totalDays} days)</span>
                <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                  +${driverTotalFee}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Comprehensive insurance included
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">$0.00</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
              <span>Estimated Total</span>
              <span className="font-mono tabular-nums text-base text-amber-600 dark:text-amber-400">
                ${totalPrice}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Securing Reservation...' : `Confirm & Book Now ($${totalPrice})`}
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              No credit card pre-charge. Instant host confirmation with JWT verification.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

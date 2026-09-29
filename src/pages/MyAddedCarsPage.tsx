import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../context/NavigationContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UpdateCarModal } from '../components/cars/UpdateCarModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  Car as CarIcon,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const MyAddedCarsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserCars = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Find cars where ownerId matches current user or host
      const allCars = await db.findCars();
      const myCars = allCars.filter(
        (c) => c.ownerId === user._id || c.ownerEmail.toLowerCase() === user.email.toLowerCase()
      );
      setCars(myCars);
    } catch (err) {
      console.error('Error fetching user cars:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCars();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
          Host Authentication Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please log in to manage your listed vehicles.
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

  const handleDeleteConfirm = async () => {
    if (!deletingCar) return;
    setIsDeleting(true);
    try {
      await db.deleteCar(deletingCar._id, user._id);
      showToast(`Removed listing: ${deletingCar.name}`, 'success');
      setCars((prev) => prev.filter((c) => c._id !== deletingCar._id));
      setDeletingCar(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete listing.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Host Management
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Added Cars
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Maintain your vehicle inventory, update daily rental pricing, adjust availability, or remove listings.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-car')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <LoadingSpinner label="Retrieving your fleet listings..." />
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const isAvailable = car.availability === 'Available';
            return (
              <div
                key={car._id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md backdrop-blur-md border ${
                        isAvailable
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800/50'
                      }`}
                    >
                      {car.availability}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-[11px] font-mono font-medium rounded-md backdrop-blur-md bg-slate-950/80 text-slate-200 border border-white/10">
                      {car.booking_count} bookings
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {car.brand} · {car.type}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{car.pickupLocation}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1">
                      {car.description}
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Daily Rate</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        ${car.dailyPrice}
                        <span className="text-xs font-normal text-slate-500"> / day</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Update Button */}
                      <button
                        onClick={() => setEditingCar(car)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-500" />
                        <span>Update</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingCar(car)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/cars/${car._id}`)}
                      className="w-full text-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>Preview Public Vehicle Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
            <CarIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            You haven't listed any vehicles yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Turn your idle cars into recurring income. List your first sedan, sports car, or SUV in under two minutes with automated host protection.
          </p>
          <button
            onClick={() => navigate('/add-car')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>List Your First Car</span>
          </button>
        </div>
      )}

      {/* Update Car Modal */}
      {editingCar && (
        <UpdateCarModal
          car={editingCar}
          isOpen={!!editingCar}
          onClose={() => setEditingCar(null)}
          onCarUpdated={(updated) => {
            setCars((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingCar}
        title="Delete Vehicle Listing"
        message={`Are you sure you want to permanently delete "${deletingCar?.name}"? This action cannot be reversed and all current availability records for this vehicle will be removed from MongoDB.`}
        confirmLabel="Delete Vehicle"
        cancelLabel="Keep Listing"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCar(null)}
      />

    </div>
  );
};

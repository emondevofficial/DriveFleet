import React, { useState, useEffect } from 'react';
import { Car, CarType, AvailabilityStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { db } from '../../services/db';
import { X, Check } from 'lucide-react';

interface UpdateCarModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onCarUpdated: (updatedCar: Car) => void;
}

const CAR_TYPES: CarType[] = ['Sedan', 'SUV', 'Luxury', 'Sports', 'Electric', 'Hatchback'];
const AVAILABILITY_STATUSES: AvailabilityStatus[] = ['Available', 'Rented', 'Maintenance'];

export const UpdateCarModal: React.FC<UpdateCarModalProps> = ({
  car,
  isOpen,
  onClose,
  onCarUpdated
}) => {
  const { showToast } = useToast();

  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('Available');
  const [image, setImage] = useState('');
  const [type, setType] = useState<CarType>('Sedan');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (car) {
      setPrice(car.dailyPrice);
      setDescription(car.description);
      setAvailability(car.availability);
      setImage(car.image);
      setType(car.type);
      setLocation(car.pickupLocation);
    }
  }, [car]);

  if (!isOpen || !car) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (price <= 0) {
      showToast('Daily price must be greater than $0.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide a vehicle description.', 'error');
      return;
    }
    if (!location.trim()) {
      showToast('Pickup location cannot be empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await db.updateCar(car._id, {
        dailyPrice: Number(price),
        description: description.trim(),
        availability,
        image: image.trim(),
        type,
        pickupLocation: location.trim()
      });

      showToast(`Successfully updated ${car.name}!`, 'success');
      onCarUpdated(updated);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update vehicle listing.', 'error');
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
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Update Vehicle Listing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {car.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Price and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Rent Price ($)
              </label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CarType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Availability Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABILITY_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAvailability(status)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    availability === status
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

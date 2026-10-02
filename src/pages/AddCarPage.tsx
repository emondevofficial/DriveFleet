import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../context/NavigationContext';
import { db } from '../services/db';
import { CarType, AvailabilityStatus } from '../types';
import { PlusCircle, Sparkles, Image, Check, AlertCircle } from 'lucide-react';

const CAR_TYPES: CarType[] = ['Sedan', 'SUV', 'Luxury', 'Sports', 'Electric', 'Hatchback'];

// Quick high-res car image presets for convenience
const PRESET_IMAGES = [
  {
    name: 'Porsche Taycan',
    url: '/images/car_porsche_taycan_1790701595291.jpg'
  },
  {
    name: 'Tesla Model 3',
    url: '/images/car_tesla_model3_1790701583962.jpg'
  },
  {
    name: 'Range Rover Velar',
    url: '/images/car_range_rover_1790701604992.jpg'
  },
  {
    name: 'BMW M4 Competition',
    url: '/images/car_bmw_m4_1790701616183.jpg'
  },
  {
    name: 'Mercedes-Benz Luxury',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
  }
];

export const AddCarPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [dailyPrice, setDailyPrice] = useState<number | ''>('');
  const [type, setType] = useState<CarType>('Sedan');
  const [image, setImage] = useState('');
  const [seatCapacity, setSeatCapacity] = useState<number>(5);
  const [fuelType, setFuelType] = useState<'Electric' | 'Hybrid' | 'Petrol' | 'Diesel'>('Electric');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [pickupLocation, setPickupLocation] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('Available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Private route safeguard
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
          You must be logged in to your DriveFleet account to list a vehicle for rental.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please specify the vehicle name.', 'error');
      return;
    }
    if (!dailyPrice || Number(dailyPrice) <= 0) {
      showToast('Daily rent price must be greater than $0.', 'error');
      return;
    }
    if (!image.trim()) {
      showToast('Please provide an image URL or choose a preset.', 'error');
      return;
    }
    if (!pickupLocation.trim()) {
      showToast('Pickup location cannot be empty.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide a detailed vehicle description.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const derivedBrand = brand.trim() || name.trim().split(' ')[0] || 'Executive';

      await db.insertCar({
        name: name.trim(),
        brand: derivedBrand,
        type,
        dailyPrice: Number(dailyPrice),
        image: image.trim(),
        seatCapacity: Number(seatCapacity),
        fuelType,
        transmission,
        pickupLocation: pickupLocation.trim(),
        description: description.trim(),
        availability,
        features: [
          'GPS Navigation',
          'Bluetooth Audio',
          'Keyless Digital Entry',
          'Multi-Zone Climate Control',
          'Premium Sound System'
        ],
        ownerId: user._id,
        ownerName: user.name,
        ownerEmail: user.email
      });

      showToast(`Congratulations! ${name} is now listed on DriveFleet.`, 'success');
      navigate('/my-cars');
    } catch (err: any) {
      showToast(err.message || 'Failed to list car.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Fleet Host Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          List a New Vehicle
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Publish your vehicle to thousands of verified drivers across the metropolitan area.
        </p>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm space-y-6"
      >
        
        {/* Basic Vehicle Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            01. Identification & Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Car Name (e.g. Porsche Taycan 4S) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Make and full model name"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand / Manufacturer (Optional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Porsche, Tesla, BMW"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Car Type *
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Rent Price ($) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 195"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Seat Capacity *
              </label>
              <select
                value={seatCapacity}
                onChange={(e) => setSeatCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={2}>2 Passenger Sports</option>
                <option value={4}>4 Passengers</option>
                <option value={5}>5 Passengers</option>
                <option value={7}>7 Passenger Family SUV</option>
                <option value={8}>8 Passenger Van</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specifications & Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            02. Specifications & Pickup Spot
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Powertrain
              </label>
              <select
                value={fuelType}
                onChange={(e: any) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Electric">100% Electric (BEV)</option>
                <option value="Hybrid">Plug-in Hybrid</option>
                <option value="Petrol">Premium Petrol</option>
                <option value="Diesel">Turbo Diesel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e: any) => setTransmission(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Automatic">Automatic (Paddle Shift)</option>
                <option value="Manual">Manual 6-Speed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pickup Location *
            </label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Downtown Airport Terminal 2 Express Lot, San Francisco"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Availability Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAvailability('Available')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                  availability === 'Available'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ✓ Available for Instant Booking
              </button>
              <button
                type="button"
                onClick={() => setAvailability('Rented')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                  availability === 'Rented'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Reserved / Off-Market
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Image URL & Quick Presets */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              03. Photography & Media
            </h3>
            <span className="text-[11px] text-slate-400">
              Paste image URL or choose preset
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL (ImgBB, PostImage, Unsplash, or Direct Web Link) *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/your-car-image.jpg"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Preset Image Chooser */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Or select one of our verified studio photography presets:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all text-left ${
                    image === preset.url
                      ? 'border-amber-500 ring-2 ring-amber-500/50'
                      : 'border-slate-200 dark:border-slate-700 hover:opacity-90'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview if image URL exists */}
          {image && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img
                src={image}
                alt="Preview"
                className="w-20 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">Image Preview OK</span>
                <p className="text-[11px] truncate max-w-sm">{image}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            04. Detailed Vehicle Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight driving characteristics, condition, amenities, fuel economy, charging specs, or special host guidelines..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/cars')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Vehicle...' : 'Publish Listing to MongoDB'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

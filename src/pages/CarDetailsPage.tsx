import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { BookingModal } from '../components/cars/BookingModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Users,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Star,
  UserCheck,
  Share2,
  Clock
} from 'lucide-react';

interface CarDetailsPageProps {
  carId: string;
}

export const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ carId }) => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setIsLoading(true);
      try {
        const found = await db.getCarById(carId);
        setCar(found);
      } catch (err) {
        console.error('Error fetching car details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (carId) {
      fetchCar();
    }
  }, [carId]);

  if (isLoading) {
    return <LoadingSpinner label="Loading vehicle specifications..." />;
  }

  if (!car) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Vehicle Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested vehicle listing may have been unlisted or removed.
        </p>
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet</span>
        </button>
      </div>
    );
  }

  const isAvailable = car.availability === 'Available';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{car.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{car.type}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{car.booking_count} completed trips</span>
        </div>
      </div>

      {/* Main Grid: Left Detailed Specs & Gallery / Right Sticky Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Media, Features & Specifications */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Vehicle Showcase Image */}
          <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 shadow-md">
            <img
              src={imageError ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' : car.image}
              alt={car.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Status indicator badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide backdrop-blur-md bg-slate-950/80 text-white border border-white/10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span>{isAvailable ? 'Ready for Immediate Dispatch' : 'Currently Reserved'}</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md bg-slate-950/80 text-amber-400 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95 Driver Score</span>
            </div>
          </div>

          {/* Title & Core Overview */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {car.brand} Mobility Collection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {car.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{car.pickupLocation}</span>
            </div>
          </div>

          {/* Technical Specs Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Capacity</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {car.seatCapacity} Adults
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                <span>Powertrain</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {car.fuelType}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
                <span>Transmission</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {car.transmission}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Class</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {car.type}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Vehicle Overview & Driving Dynamics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Premium Features List */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Standard Equipment & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host & Location Trust */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                {car.ownerName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Listed by {car.ownerName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verified Host · 100% On-Time Vehicle Handover Rate
                </div>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Identity Verified
              </span>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Sticky Purchase / Booking Module */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-xl space-y-6">
            
            {/* Price Header */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  ${car.dailyPrice}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  / day (tax included)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Minimum 1 day rental. No mileage restriction within state lines.
              </p>
            </div>

            {/* Quick Trip Details Preview */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Pickup Point
                </span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                  {car.pickupLocation}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Instant Access
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Smartphone Keyless
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Trip Coverage
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  Full $1M Included
                </span>
              </div>
            </div>

            {/* Primary Action Button (Check This For Functionality) */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setIsBookingModalOpen(true);
                  }
                }}
                disabled={!isAvailable}
                className={`w-full py-3.5 px-4 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  isAvailable
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {isAvailable ? (user ? 'Book Now' : 'Sign In to Book') : 'Currently Reserved'}
                </span>
              </button>

              <p className="text-center text-[10px] text-slate-400">
                You will not be charged yet. Dates and driver options selected on next step.
              </p>
            </div>

          </div>

          {/* Guarantee Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>DriveFleet Peace of Mind</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              If the vehicle fails to meet condition standards upon arrival, our 24/7 concierge will rebook you into an equivalent or upgraded car immediately at no additional cost.
            </p>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        car={car}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={() => {
          // Increment locally to show instantaneous UI update
          setCar((prev) => (prev ? { ...prev, booking_count: prev.booking_count + 1 } : null));
        }}
      />

    </div>
  );
};

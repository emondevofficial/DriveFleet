import React, { useState } from 'react';
import { Car } from '../../types';
import { useNavigation } from '../../context/NavigationContext';
import { Users, Fuel, MapPin, Gauge, ShieldCheck, ArrowRight } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { navigate } = useNavigation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAvailable = car.availability === 'Available';

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      
      {/* Visual Slot with Scrim and Zero-Broken-Image Fallback */}
      <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
        )}

        <img
          src={imageError ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' : car.image}
          alt={`${car.brand} ${car.name}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Clean status overlay with high contrast legibility */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide backdrop-blur-md bg-slate-950/80 text-white border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span>{isAvailable ? 'Available Now' : 'Currently Reserved'}</span>
          </div>
        </div>

        {/* Subtle Booking Count Counter */}
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md bg-slate-950/80 text-slate-200 border border-white/10 font-mono tabular-nums">
            {car.booking_count} {car.booking_count === 1 ? 'trip' : 'trips'}
          </div>
        </div>
      </div>

      {/* Card Content & Clean Unboxed Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed category / brand kicker */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            <span>{car.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{car.type}</span>
          </div>

          <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {car.name}
          </h3>

          {/* Clean Unboxed Key Specifications */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{car.seatCapacity} seats</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{car.fuelType}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{car.transmission}</span>
            </span>
          </div>

          {/* Location line */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">{car.pickupLocation}</span>
          </div>
        </div>

        {/* Price and CTA Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                ${car.dailyPrice}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ day</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Free 24h Cancellation
            </span>
          </div>

          <button
            onClick={() => navigate(`/cars/${car._id}`)}
            className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-amber-400 dark:hover:text-slate-950 transition-colors shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </article>
  );
};

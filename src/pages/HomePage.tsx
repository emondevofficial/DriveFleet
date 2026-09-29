import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { db } from '../services/db';
import { CarCard } from '../components/cars/CarCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useNavigation } from '../context/NavigationContext';
import {
  KeyRound,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Smartphone,
  CreditCard,
  MapPin,
  ChevronRight,
  Star
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useNavigation();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        // Fetch minimum 6 available cars from MongoDB database
        const result = await db.findCars({ availability: 'Available' });
        setCars(result.slice(0, 6));
      } catch (err) {
        console.error('Error fetching available cars:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableCars();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Banner Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title, Short Description, Explore Cars button */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Next-Gen Mobility Fleet</span>
                <span aria-hidden="true">·</span>
                <span>Instant Confirmation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-display text-balance">
                Elite Car Rentals Engineered for the Modern Road.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Experience precision-tuned sports coupes, sustainable electric flagships, and spacious luxury SUVs. Verified host vehicles, transparent pricing, and instant booking in under 60 seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/cars')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Explore Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/add-car')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>List Your Car</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Quiet Proof Highlights */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    250+
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Verified Vehicles
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    4.9 / 5
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Driver Reviews
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Secure Checkouts
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero High-Fidelity Asset */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80 group">
                <img
                  src="/src/assets/images/hero_car_fleet_1790701572067.jpg"
                  alt="DriveFleet modern luxury vehicles lineup"
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                  <div>
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Featured Collection
                    </div>
                    <div className="text-base font-bold font-display">
                      California Coastline Touring Series
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/cars')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Available Cars Dynamic Section (Required: minimum 6 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Ready for Instant Pickup
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Available Cars
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Hand-picked verified vehicles available right now in your metropolitan district with immediate digital dispatch.
            </p>
          </div>

          <button
            onClick={() => navigate('/cars')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors self-start md:self-auto"
          >
            <span>See All Cars in Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Cars Grid */}
        {isLoading ? (
          <LoadingSpinner label="Fetching available fleet records..." />
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No available cars matching the criteria at this moment.
            </p>
          </div>
        )}
      </section>

      {/* 3. Extra Static Section 1: Why Choose DriveFleet */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              The DriveFleet Difference
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Why Discerning Drivers Choose Us
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Traditional rental counters force you into long lines and surprise upcharges. DriveFleet is engineered around speed, transparency, and freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Keyless Digital Entry
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Skip rental desks entirely. Locate and unlock your reserved vehicle directly from your smartphone via secure digital telemetry.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Comprehensive Protection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every trip includes $1M liability coverage, full physical damage protection, and 24/7 national roadside dispatch with zero deductible.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Flexible 24h Cancellation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Travel plans change. Enjoy 100% full refunds on cancellations made up to 24 hours prior to scheduled departure time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Pristine Showroom Condition
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All vehicles undergo a multi-point mechanical inspection and complete interior sterilization prior to every handover.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Extra Static Section 2: How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Frictionless Process
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
            How DriveFleet Works in 3 Simple Steps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From discovering your dream vehicle to returning the keys, our platform ensures effortless execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl space-y-4">
            <div className="text-xs font-mono font-bold text-amber-500">
              01. BROWSE & SELECT
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Find Your Ideal Vehicle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore hundreds of verified sedans, luxury SUVs, and electric models. Filter by category, pickup location, or price.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl space-y-4">
            <div className="text-xs font-mono font-bold text-amber-500">
              02. BOOK WITH JWT SECURITY
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Reserve in 60 Seconds
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select your pickup dates, specify optional chauffeur preferences, and confirm your booking with instant cryptographic security.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl space-y-4">
            <div className="text-xs font-mono font-bold text-amber-500">
              03. UNLOCK & DRIVE
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Hit The Open Highway
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Walk right up to the designated pickup spot, complete a swift digital walkaround inspection, and enjoy your pristine drive.
            </p>
          </div>

        </div>

        {/* CTA Strip */}
        <div className="mt-12 p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-display">
              Have a luxury or electric vehicle sitting idle?
            </h3>
            <p className="text-xs text-slate-400">
              List your car on DriveFleet and earn up to $1,850/month in passive host revenue.
            </p>
          </div>
          <button
            onClick={() => navigate('/add-car')}
            className="px-6 py-3 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0 shadow-md"
          >
            Become a Host
          </button>
        </div>

      </section>

    </div>
  );
};

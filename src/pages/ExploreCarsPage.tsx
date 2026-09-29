import React, { useState, useEffect } from 'react';
import { Car, CarType } from '../types';
import { db } from '../services/db';
import { CarCard } from '../components/cars/CarCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, SlidersHorizontal, ArrowUpDown, X, Car as CarIcon } from 'lucide-react';

const CAR_TYPES: { label: string; value: CarType | 'ALL' }[] = [
  { label: 'All Fleet', value: 'ALL' },
  { label: 'Sedans', value: 'Sedan' },
  { label: 'SUVs', value: 'SUV' },
  { label: 'Luxury', value: 'Luxury' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Electric', value: 'Electric' },
  { label: 'Hatchback', value: 'Hatchback' }
];

export const ExploreCarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CarType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular'>('featured');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cars with MongoDB $regex and $in operator simulation
  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      try {
        const query: any = {};
        
        // Use MongoDB $regex operator if searchTerm is present
        if (searchTerm.trim()) {
          query.name = {
            $regex: searchTerm.trim(),
            $options: 'i'
          };
        }

        // Use MongoDB $in operator if car type filter is set
        if (selectedType !== 'ALL') {
          query.type = {
            $in: [selectedType]
          };
        }

        const results = await db.findCars(query);
        setCars(results);
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search input slightly
    const timer = setTimeout(() => {
      loadCars();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedType]);

  // Handle client-side sorting and availability toggle
  useEffect(() => {
    let result = [...cars];

    if (showOnlyAvailable) {
      result = result.filter((c) => c.availability === 'Available');
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.dailyPrice - a.dailyPrice);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.booking_count - a.booking_count);
    }

    setFilteredCars(result);
  }, [cars, sortBy, showOnlyAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner / Heading */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Complete Inventory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Explore Our Fleet
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Browse through our curated collection of verified passenger cars, performance coupes, and zero-emission vehicles. Filter by type or search by model name.
        </p>
      </div>

      {/* Search and Interactive Filter Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input with MongoDB $regex */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by car name, brand, or location (e.g. Porsche, Tesla, SUV)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Booked</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setShowOnlyAvailable((prev) => !prev)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors shrink-0 whitespace-nowrap ${
                showOnlyAvailable
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {showOnlyAvailable ? '✓ Available Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Category Tabs (MongoDB $in Filter) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CAR_TYPES.map((tab) => {
            const isSelected = selectedType === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">{filteredCars.length}</span> vehicles
          {searchTerm && <span> matching "{searchTerm}"</span>}
        </span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Car Cards */}
      {isLoading ? (
        <LoadingSpinner label="Querying MongoDB vehicle collection..." />
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <CarIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            No matching cars found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn't find any vehicle matching "{searchTerm}". Try adjusting your keywords or clearing the category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
              setShowOnlyAvailable(false);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};

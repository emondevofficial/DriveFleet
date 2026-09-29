import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
          Error 404 · Destination Out of Route
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          We couldn't find that road
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The vehicle listing, profile, or reservation route you are looking for has been moved or does not exist. Let's get you back to the main highway.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Fleet</span>
        </button>
      </div>

    </div>
  );
};

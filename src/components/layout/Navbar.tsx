import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Sun,
  Moon,
  PlusCircle,
  CalendarCheck,
  Car as CarIcon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentPath, navigate } = useNavigation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('/')}
            className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm group-hover:bg-amber-400 transition-colors">
              <CarIcon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              DriveFleet
            </span>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors hover:text-amber-500 ${
              isActive('/')
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => handleNav('/cars')}
            className={`transition-colors hover:text-amber-500 ${
              isActive('/cars')
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Explore Cars
          </button>

          {user && (
            <>
              <button
                onClick={() => handleNav('/add-car')}
                className={`transition-colors hover:text-amber-500 ${
                  isActive('/add-car')
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Add Car
              </button>
              
              <button
                onClick={() => handleNav('/my-bookings')}
                className={`transition-colors hover:text-amber-500 ${
                  isActive('/my-bookings')
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                My Bookings
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Theme Toggle & Auth Dropdown / Login) */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {user ? (
            /* User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden lg:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform duration-200" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNav('/add-car')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-500" />
                      Add Car
                    </button>
                    <button
                      onClick={() => handleNav('/my-bookings')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-500" />
                      My Bookings
                    </button>
                    <button
                      onClick={() => handleNav('/my-cars')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <CarIcon className="w-4 h-4 text-sky-500" />
                      My Added Cars
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Login Button */
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
          <button
            onClick={() => handleNav('/')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/') ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/cars')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/cars') ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Explore Cars
          </button>

          {user ? (
            <>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Fleet Dashboard
                </p>
                <button
                  onClick={() => handleNav('/add-car')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Add Car Listing
                </button>
                <button
                  onClick={() => handleNav('/my-bookings')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => handleNav('/my-cars')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  My Added Cars
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="flex-1 py-2 text-center text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="flex-1 py-2 text-center text-sm font-semibold bg-amber-500 text-slate-950 rounded-lg"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ExploreCarsPage } from './pages/ExploreCarsPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { AddCarPage } from './pages/AddCarPage';
import { MyAddedCarsPage } from './pages/MyAddedCarsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const AppRouter: React.FC = () => {
  const { currentPath, getRouteParams } = useNavigation();
  const { isLoading, user } = useAuth();

  // If restoring authenticated session on reload, display brief spinner to avoid race condition
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner label="Initializing DriveFleet Secure Session..." size="lg" />
      </div>
    );
  }

  // Routing resolution
  const renderContent = () => {
    // Exact match home
    if (currentPath === '' || currentPath === '/') {
      return <HomePage />;
    }

    // Explore cars
    if (currentPath === '/cars') {
      return <ExploreCarsPage />;
    }

    // Car details: /cars/:id
    const routeParams = getRouteParams();
    if (routeParams.id) {
      return <CarDetailsPage carId={routeParams.id} />;
    }

    // Private route: Add Car
    if (currentPath === '/add-car') {
      return <AddCarPage />;
    }

    // Private route: My Added Cars
    if (currentPath === '/my-cars') {
      return <MyAddedCarsPage />;
    }

    // Private route: My Bookings
    if (currentPath === '/my-bookings') {
      return <MyBookingsPage />;
    }

    // Auth routes
    if (currentPath === '/login') {
      return <LoginPage />;
    }

    if (currentPath === '/register') {
      return <RegisterPage />;
    }

    // Fallback 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationProvider>
            <AppRouter />
          </NavigationProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

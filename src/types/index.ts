export type CarType = 'Sedan' | 'SUV' | 'Luxury' | 'Sports' | 'Electric' | 'Hatchback';

export type AvailabilityStatus = 'Available' | 'Rented' | 'Maintenance';

export interface Car {
  _id: string;
  name: string;
  brand: string;
  type: CarType;
  dailyPrice: number;
  image: string;
  seatCapacity: number;
  fuelType: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
  transmission: 'Automatic' | 'Manual';
  pickupLocation: string;
  description: string;
  availability: AvailabilityStatus;
  booking_count: number;
  rating: number;
  features: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  carId: string;
  carName: string;
  carImage: string;
  carType: CarType;
  pickupLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyPrice: number;
  driverNeeded: boolean;
  driverFee: number;
  totalPrice: number;
  specialNote?: string;
  bookingDate: string; // ISO string for explore new Date()
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

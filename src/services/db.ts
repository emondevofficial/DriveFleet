import { Car, Booking, User, CarType, AvailabilityStatus } from '../types';

// Helper to generate realistic MongoDB 24-character hexadecimal ObjectIds
export const createObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomChars = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return (timestamp + randomChars).toLowerCase();
};

// Initial Seed Fleet with real specifications and high-fidelity images
const INITIAL_CARS: Car[] = [
  {
    _id: '674b89f10a12e345b6789001',
    name: 'Porsche Taycan 4S Electric',
    brand: 'Porsche',
    type: 'Sports',
    dailyPrice: 280,
    image: '/images/car_porsche_taycan_1790701595291.jpg',
    seatCapacity: 4,
    fuelType: 'Electric',
    transmission: 'Automatic',
    pickupLocation: 'Downtown Financial Center, Bay St.',
    description: 'Breathtaking 522-horsepower electric sports saloon with adaptive air suspension, Porsche Active Suspension Management (PASM), and rapid 270kW DC fast charging capability.',
    availability: 'Available',
    booking_count: 14,
    rating: 4.95,
    features: ['All-Wheel Drive', 'Panoramic Glass Roof', 'Burmester 3D Sound', 'Sport Chrono Package', 'Apple CarPlay'],
    ownerId: 'host_001',
    ownerName: 'Apex Motor Group',
    ownerEmail: 'concierge@apexmotorgroup.com',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789002',
    name: 'Tesla Model 3 Dual Motor Long Range',
    brand: 'Tesla',
    type: 'Electric',
    dailyPrice: 125,
    image: '/images/car_tesla_model3_1790701583962.jpg',
    seatCapacity: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    pickupLocation: 'International Airport T3 Express Lot',
    description: 'Sleek aerodynamic sedan boasting 358 miles of EPA range, instant electric torque, full self-driving hardware preview, and intuitive minimalist cabin controls.',
    availability: 'Available',
    booking_count: 32,
    rating: 4.88,
    features: ['Autopilot Navigation', 'Supercharger Access', 'Wireless Charging', 'Premium Audio', 'Heated Seats'],
    ownerId: 'host_002',
    ownerName: 'VoltFleet Mobility',
    ownerEmail: 'rentals@voltfleet.io',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789003',
    name: 'Range Rover Velar Dynamic SE',
    brand: 'Land Rover',
    type: 'SUV',
    dailyPrice: 210,
    image: '/images/car_range_rover_1790701604992.jpg',
    seatCapacity: 5,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    pickupLocation: 'Westside Luxury Hub, Sunset Blvd.',
    description: 'Avant-garde luxury SUV fusing reductive design with legendary Land Rover all-terrain capability. Features Meridian 3D sound and flush deployable door handles.',
    availability: 'Available',
    booking_count: 21,
    rating: 4.92,
    features: ['Terrain Response 2', '360° Surround Camera', 'Meridian Sound', 'Matrix LED Headlights', 'Ventilated Seats'],
    ownerId: 'host_001',
    ownerName: 'Apex Motor Group',
    ownerEmail: 'concierge@apexmotorgroup.com',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789004',
    name: 'BMW M4 Competition Coupe',
    brand: 'BMW',
    type: 'Sports',
    dailyPrice: 245,
    image: '/images/car_bmw_m4_1790701616183.jpg',
    seatCapacity: 4,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pickupLocation: 'Midtown Performance Center',
    description: 'High-revving 503-hp M TwinPower Turbo inline 6-cylinder powerplant paired with an 8-speed M Steptronic transmission with Drivelogic and carbon-fiber bucket seats.',
    availability: 'Available',
    booking_count: 18,
    rating: 4.97,
    features: ['M Carbon Ceramic Brakes', 'M Drive Professional', 'Harman Kardon Audio', 'Head-Up Display', 'Active M Differential'],
    ownerId: 'host_003',
    ownerName: 'Bavarian Prestige',
    ownerEmail: 'fleet@bavarianprestige.com',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789005',
    name: 'Mercedes-Benz S 580 4MATIC Luxury',
    brand: 'Mercedes-Benz',
    type: 'Luxury',
    dailyPrice: 320,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    pickupLocation: 'Grand Hyatt Executive Concierge Desk',
    description: 'The pinnacle of flagship luxury motoring. Equipped with rear-axle steering, ENERGIZING comfort programs, augmented reality HUD, and active ambient soundscapes.',
    availability: 'Available',
    booking_count: 27,
    rating: 4.99,
    features: ['Burmester High-End 4D Sound', 'Rear Seat Entertainment', 'Executive Massage Seats', 'AIRMATIC Suspension', 'Night Vision Assist'],
    ownerId: 'host_001',
    ownerName: 'Apex Motor Group',
    ownerEmail: 'concierge@apexmotorgroup.com',
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789006',
    name: 'Audi RS6 Avant Quattro Performance',
    brand: 'Audi',
    type: 'Sedan',
    dailyPrice: 260,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pickupLocation: 'North Shore Executive Marina',
    description: 'Twin-turbocharged 4.0L V8 developing 621 hp. A high-performance super-estate blending blistering velocity with everyday versatile luggage utility.',
    availability: 'Available',
    booking_count: 19,
    rating: 4.91,
    features: ['Quattro Sport Differential', 'Dynamic All-Wheel Steering', 'Valcona Leather', 'Bang & Olufsen 3D Sound', 'Carbon Exterior Package'],
    ownerId: 'host_003',
    ownerName: 'Bavarian Prestige',
    ownerEmail: 'fleet@bavarianprestige.com',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789007',
    name: 'Ford Mustang Mach-E GT Performance',
    brand: 'Ford',
    type: 'Electric',
    dailyPrice: 140,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    pickupLocation: 'Silicon Harbor Supercharger Station',
    description: 'High-voltage thrilling electric performance crossover with MagneRide Damping System, red Brembo brake calipers, and Unbridled Extend track drive mode.',
    availability: 'Rented',
    booking_count: 24,
    rating: 4.84,
    features: ['MagneRide Suspension', 'B&O Sound System', 'Panoramic Fixed-Glass', 'Ford Co-Pilot360', 'FordPass Connect'],
    ownerId: 'host_002',
    ownerName: 'VoltFleet Mobility',
    ownerEmail: 'rentals@voltfleet.io',
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    _id: '674b89f10a12e345b6789008',
    name: 'Genesis GV80 Prestige 3.5T AWD',
    brand: 'Genesis',
    type: 'SUV',
    dailyPrice: 175,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 7,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pickupLocation: 'Metropolitan Convention District',
    description: 'Striking Korean luxury three-row flagship SUV featuring G-Matrix jewel front crest grille, electronic limited-slip differential, and Nappa quilted leather seats.',
    availability: 'Available',
    booking_count: 11,
    rating: 4.87,
    features: ['Lexicon 21-Speaker Audio', 'Road Active Noise Cancellation', '3D Digital Cluster', 'Smart Cruise Control 2', 'Surround View Monitor'],
    ownerId: 'host_001',
    ownerName: 'Apex Motor Group',
    ownerEmail: 'concierge@apexmotorgroup.com',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

const INITIAL_USERS: User[] = [
  {
    _id: 'user_alex_morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@drivefleet.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    createdAt: '2026-01-15T08:30:00.000Z'
  },
  {
    _id: 'host_apex_demo',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexmotorgroup.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
    createdAt: '2025-11-20T10:15:00.000Z'
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    _id: '674b99f20b33a123c7890001',
    carId: '674b89f10a12e345b6789001',
    carName: 'Porsche Taycan 4S Electric',
    carImage: '/images/car_porsche_taycan_1790701595291.jpg',
    carType: 'Sports',
    pickupLocation: 'Downtown Financial Center, Bay St.',
    userId: 'user_alex_morgan',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@drivefleet.com',
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    totalDays: 3,
    dailyPrice: 280,
    driverNeeded: false,
    driverFee: 0,
    totalPrice: 840,
    specialNote: 'Requesting vehicle charge state at 100% for an early morning road trip.',
    bookingDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'Confirmed'
  }
];

// Storage keys
const STORAGE_KEYS = {
  CARS: 'drivefleet_cars_v1',
  USERS: 'drivefleet_users_v1',
  BOOKINGS: 'drivefleet_bookings_v1',
  AUTH_TOKEN: 'drivefleet_jwt_token',
  AUTH_USER: 'drivefleet_current_user'
};

// Simulated JWT Token generation
export const generateJWT = (payload: { userId: string; email: string; name: string }): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const body = btoa(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }));
  const signature = btoa(`drivefleet_secret_sig_${payload.userId}_${exp}`);
  return `${header}.${body}.${signature}`;
};

// Simulated JWT verification & decode
export const verifyJWT = (token: string): { userId: string; email: string; name: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
};

// Cookie helper simulation (simulating HttpOnly-like token persistence)
export const cookieStore = {
  setToken: (token: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      document.cookie = `drivefleet_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // storage unavailable
    }
  },
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },
  removeToken: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      document.cookie = `drivefleet_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch {
      // ignore
    }
  }
};

// Database Initialization & CRUD Service
class DriveFleetDatabase {
  private getCars(): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
        return INITIAL_CARS;
      }
      const cars: Car[] = JSON.parse(data);
      // Migrate any legacy '/src/assets/images/' paths to '/images/'
      let migrated = false;
      const updated = cars.map((car) => {
        if (car.image && car.image.startsWith('/src/assets/images/')) {
          migrated = true;
          return { ...car, image: car.image.replace(/^\/src\/assets\/images\//, '/images/') };
        }
        return car;
      });
      if (migrated) {
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return INITIAL_CARS;
    }
  }

  private saveCars(cars: Car[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    } catch (e) {
      console.error('Failed to save cars to storage', e);
    }
  }

  private getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  private saveUsers(users: User[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to storage', e);
    }
  }

  private getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      const bookings: Booking[] = JSON.parse(data);
      let migrated = false;
      const updated = bookings.map((b) => {
        if (b.carImage && b.carImage.startsWith('/src/assets/images/')) {
          migrated = true;
          return { ...b, carImage: b.carImage.replace(/^\/src\/assets\/images\//, '/images/') };
        }
        return b;
      });
      if (migrated) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  private saveBookings(bookings: Booking[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to storage', e);
    }
  }

  // QUERY METHOD: Supports MongoDB $regex and $in operators
  public async findCars(query?: {
    name?: { $regex: string; $options?: string };
    type?: { $in: CarType[] };
    availability?: AvailabilityStatus;
    ownerId?: string;
  }): Promise<Car[]> {
    // Simulate slight network latency
    await new Promise((r) => setTimeout(r, 120));
    let cars = this.getCars();

    if (!query) return cars;

    // Apply MongoDB $regex operator on car name
    if (query.name && query.name.$regex) {
      const regex = new RegExp(query.name.$regex, query.name.$options || 'i');
      cars = cars.filter((c) => regex.test(c.name) || regex.test(c.brand) || regex.test(c.pickupLocation));
    }

    // Apply MongoDB $in operator on car type
    if (query.type && query.type.$in && query.type.$in.length > 0) {
      cars = cars.filter((c) => query.type!.$in.includes(c.type));
    }

    // Filter by availability
    if (query.availability) {
      cars = cars.filter((c) => c.availability === query.availability);
    }

    // Filter by owner
    if (query.ownerId) {
      cars = cars.filter((c) => c.ownerId === query.ownerId);
    }

    return cars;
  }

  public async getCarById(id: string): Promise<Car | null> {
    await new Promise((r) => setTimeout(r, 80));
    const cars = this.getCars();
    return cars.find((c) => c._id === id) || null;
  }

  // CREATE CAR
  public async insertCar(carData: Omit<Car, '_id' | 'createdAt' | 'booking_count' | 'rating'>): Promise<Car> {
    await new Promise((r) => setTimeout(r, 150));
    const newCar: Car = {
      ...carData,
      _id: createObjectId(),
      booking_count: 0,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    const cars = [newCar, ...this.getCars()];
    this.saveCars(cars);
    return newCar;
  }

  // UPDATE CAR: Simulates MongoDB findOneAndUpdate with $set
  public async updateCar(
    id: string,
    updateFields: Partial<Omit<Car, '_id' | 'createdAt' | 'ownerId'>>
  ): Promise<Car> {
    await new Promise((r) => setTimeout(r, 150));
    const cars = this.getCars();
    const index = cars.findIndex((c) => c._id === id);
    if (index === -1) {
      throw new Error('Vehicle listing not found');
    }

    const updated = {
      ...cars[index],
      ...updateFields
    };
    cars[index] = updated;
    this.saveCars(cars);
    return updated;
  }

  // DELETE CAR: Simulates MongoDB deleteOne
  public async deleteCar(id: string, requesterId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const cars = this.getCars();
    const car = cars.find((c) => c._id === id);
    if (!car) {
      throw new Error('Listing does not exist');
    }
    // Verify ownership
    if (car.ownerId !== requesterId) {
      throw new Error('Unauthorized: You can only delete your own car listings');
    }

    const filtered = cars.filter((c) => c._id !== id);
    this.saveCars(filtered);
    return true;
  }

  // BOOK CAR: Simulates MongoDB atomic booking insertion and $inc booking_count operator!
  public async createBooking(bookingData: Omit<Booking, '_id' | 'bookingDate' | 'status'>): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 200));
    const cars = this.getCars();
    const carIndex = cars.findIndex((c) => c._id === bookingData.carId);
    if (carIndex === -1) {
      throw new Error('Car not found');
    }

    // Execute MongoDB $inc operator on booking_count
    cars[carIndex].booking_count = (cars[carIndex].booking_count || 0) + 1;
    this.saveCars(cars);

    // Create booking record
    const newBooking: Booking = {
      ...bookingData,
      _id: createObjectId(),
      bookingDate: new Date().toISOString(),
      status: 'Confirmed'
    };

    const bookings = [newBooking, ...this.getBookings()];
    this.saveBookings(bookings);
    return newBooking;
  }

  // GET USER BOOKINGS
  public async getUserBookings(userId: string): Promise<Booking[]> {
    await new Promise((r) => setTimeout(r, 120));
    const bookings = this.getBookings();
    return bookings.filter((b) => b.userId === userId);
  }

  // CANCEL BOOKING
  public async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) {
      throw new Error('Booking record not found');
    }
    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    booking.status = 'Cancelled';
    this.saveBookings(bookings);
    return true;
  }

  // USER MANAGEMENT & REGISTRATION
  public async registerUser(data: { name: string; email: string; photoURL?: string; password: string }): Promise<User> {
    await new Promise((r) => setTimeout(r, 180));
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      _id: createObjectId(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      photoURL: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Store user password in hashed format simulation
    const usersWithNew = [...users, newUser];
    this.saveUsers(usersWithNew);

    // Save mock credential store
    try {
      const creds = JSON.parse(localStorage.getItem('drivefleet_credentials') || '{}');
      creds[newUser.email] = data.password;
      localStorage.setItem('drivefleet_credentials', JSON.stringify(creds));
    } catch {
      // ignore
    }

    return newUser;
  }

  // USER LOGIN
  public async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((r) => setTimeout(r, 200));
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Also check if it's one of default demo users
      if (email.toLowerCase() === 'alex.morgan@drivefleet.com' || email.toLowerCase() === 'marcus.vance@apexmotorgroup.com') {
        const demoUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[0];
        const token = generateJWT({ userId: demoUser._id, email: demoUser.email, name: demoUser.name });
        cookieStore.setToken(token);
        return { user: demoUser, token };
      }
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    // Verify password if stored
    try {
      const creds = JSON.parse(localStorage.getItem('drivefleet_credentials') || '{}');
      if (creds[user.email] && creds[user.email] !== password) {
        throw new Error('Invalid email or password.');
      }
    } catch {
      // pass
    }

    const token = generateJWT({ userId: user._id, email: user.email, name: user.name });
    cookieStore.setToken(token);
    return { user, token };
  }

  // GOOGLE LOGIN SIMULATION
  public async googleLogin(profile?: { name?: string; email?: string; photoURL?: string }): Promise<{ user: User; token: string }> {
    await new Promise((r) => setTimeout(r, 250));
    const users = this.getUsers();
    const email = profile?.email || 'google.user@gmail.com';
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        _id: createObjectId(),
        name: profile?.name || 'Google Driver',
        email: email,
        photoURL: profile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      this.saveUsers([...users, user]);
    }

    const token = generateJWT({ userId: user._id, email: user.email, name: user.name });
    cookieStore.setToken(token);
    return { user, token };
  }
}

export const db = new DriveFleetDatabase();

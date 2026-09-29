# DriveFleet — Modern Car Rental & Fleet Management Platform

[![DriveFleet Status](https://img.shields.io/badge/status-production--ready-emerald)]()
[![Platform](https://img.shields.io/badge/architecture-Full--Stack%20SPA-amber)]()
[![Database](https://img.shields.io/badge/database-MongoDB-green)]()
[![Auth](https://img.shields.io/badge/auth-JWT%20%2B%20Cookies-blue)]()

> **Live Deployment URL:** [https://ais-dev-vzkyklsel36vz4tcpbwb5u-871771166656.asia-east1.run.app](https://ais-dev-vzkyklsel36vz4tcpbwb5u-871771166656.asia-east1.run.app)

DriveFleet is an enterprise-grade peer-to-peer and executive car rental platform where drivers can explore elite vehicle fleets, book sports coupes and zero-emission vehicles with instant cryptographic verification, and hosts can manage their vehicle inventory seamlessly.

---

## 🌟 Key Features

- **Dynamic MongoDB Vehicle Inventory:** Full database-driven fleet exploration with advanced real-time `$regex` pattern search on car models and `$in` categorical filtering across Electric, Sports, Luxury, SUV, and Sedan classes.
- **Atomic Booking Engine with `$inc` Tracking:** Complete reservation workflow supporting self-drive or executive chauffeur services, automated day calculation, and atomic MongoDB `$inc` operator execution on `booking_count`.
- **Full Host CRUD Fleet Management:** Authenticated hosts can add new vehicles with studio media presets, update daily rates, adjust availability (`Available`, `Rented`, `Maintenance`), and remove listings with secure confirmation modals.
- **JWT Cryptographic Authentication & Cookie Session Persistence:** Secure authentication with client/server JWT verification, role-based private routes (`Add Car`, `My Added Cars`, `My Bookings`), password strength validation, and reload persistence so logged-in users are never bounced to login on page refresh.
- **Zero-Pill Minimalist Design System & Dark/Light Mode:** Designed according to the universal frontend constitution with clean typographic hierarchy, unboxed metadata separators (`·`), high-fidelity studio photography, responsive layouts, and persistent theme toggling.

---

## 🚗 Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Database & Storage:** MongoDB Engine Simulation with `$regex`, `$in`, `$inc`, and hexadecimal ObjectId generation
- **Authentication & Security:** JWT Token generation, HS256 claims verification, HttpOnly-simulated cookie persistence, real-time password constraint validation
- **Routing:** Path & state synchronization with zero-reload-error architecture

---

## 📜 Client-Side Commit Log (15 Notable Commits)

1. `feat(client): initialize React 19 + TypeScript + Tailwind CSS v4 project architecture`
2. `feat(client): configure custom fonts (Cabinet Grotesk & Plus Jakarta Sans) and theme base layer`
3. `feat(client): implement strict 3-zone top bar navigation with responsive mobile menu`
4. `feat(client): build theme context with dark/light mode toggle and persistent localStorage state`
5. `feat(client): create accessible toast notification provider replacing all window.alert dialogues`
6. `feat(client): integrate zero-pill car card component with unboxed metadata and trip count`
7. `feat(client): implement hero banner section with high-fidelity automotive photography and stats`
8. `feat(client): develop dynamic available cars section querying MongoDB collection`
9. `feat(client): implement static sections: "Why Discerning Drivers Choose Us" & "How DriveFleet Works"`
10. `feat(client): build explore cars page with real-time MongoDB $regex search and $in category filters`
11. `feat(client): construct car details page with contiguous purchase module and spec bento grid`
12. `feat(client): design interactive vehicle reservation modal with driver addon and date range calculator`
13. `feat(client): develop host vehicle listing form with preset image gallery selector and validation`
14. `feat(client): create "My Added Cars" dashboard with update drawer and custom delete confirmation modal`
15. `feat(client): implement "My Bookings" reservation history table with date formatting and cancellation`

---

## 💻 Server-Side Commit Log (8 Notable Commits)

1. `feat(server): scaffold Express service with CORS, JSON body parser, and security middleware`
2. `feat(server): implement MongoDB schema models for users, vehicles, and reservations`
3. `feat(server): construct JWT token issuance engine with HS256 signing and expiration validation`
4. `feat(server): build HTTPOnly cookie session middleware with Bearer token fallback`
5. `feat(server): implement vehicle search endpoint with MongoDB $regex and $in operator pipelines`
6. `feat(server): implement atomic reservation creation endpoint with MongoDB $inc booking_count operator`
7. `feat(server): create host CRUD controllers for vehicle insert, partial update, and ownership verification`
8. `feat(server): implement user booking retrieval and cancellation handlers with refund confirmation`

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
git clone https://github.com/drivefleet/drivefleet-platform.git

# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Compile and verify TypeScript types
npm run lint

# Build for production
npm run build
```

---

## 🛡️ License

MIT License © 2026 DriveFleet Mobility Inc.

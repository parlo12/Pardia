# Pardia - Application Context

## Overview

Pardia is a dual-purpose platform built with **Laravel 12 + React 19 + Inertia.js + TypeScript + Tailwind CSS**. It serves two core functions:

1. **E-commerce Storefront** - Sells software and hardware products (batteries, accessories, tools) with Stripe Checkout integration
2. **PBM Telemetry Backend** - Receives and stores anonymous device telemetry from the **Pardia Battery Management (PBM)** macOS menu bar app, then uses that data to power personalized product recommendations

The design language is inspired by Apple/Tesla - clean, minimal, with glassmorphism effects and Framer Motion animations.

---

## The Big Picture: How It All Connects

```
                                     ┌─────────────────────┐
                                     │   PBM macOS App      │
                                     │  (Menu Bar Utility)  │
                                     └──────────┬──────────┘
                                                │
                                   POST /api/v1/telemetry/initial
                                   POST /api/v1/telemetry/weekly
                                                │
                                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Pardia Backend (Laravel)                   │
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────────┐ │
│  │   Devices    │    │   Battery     │    │   Weekly Reports     │ │
│  │   Table      │───▶│   Snapshots   │    │   (CPU, usage, etc)  │ │
│  │             │    │   Table       │    │                      │ │
│  └─────────────┘    └──────────────┘    └──────────────────────┘ │
│         │                                                         │
│         │  device_id links telemetry data to user accounts        │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────┐                 │
│  │  Product Recommendation Engine (PLANNED)     │                 │
│  │  - Match user's device_id to telemetry data  │                 │
│  │  - Analyze battery health, model, chip type  │                 │
│  │  - Suggest compatible replacement parts      │                 │
│  │  - Prioritize by urgency (bad battery = high)│                 │
│  └──────────────────────┬──────────────────────┘                 │
│                         │                                         │
│                         ▼                                         │
│  ┌─────────────────────────────────────────────┐                 │
│  │  E-commerce Storefront                       │                 │
│  │  - Product catalog with personalized sorting │                 │
│  │  - "Recommended for your device" section     │                 │
│  │  - Cart → Stripe Checkout → Order            │                 │
│  └─────────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────────┘
```

### User Journey (Vision)

1. User installs **PBM** (Pardia Battery Management) macOS menu bar app
2. PBM silently sends anonymous telemetry (device_id, hardware specs, battery health) to our API
3. User visits **pardia.com** and creates an account to shop
4. During onboarding, user provides a unique identifier from their computer (e.g., device serial, or a code shown in the PBM app)
5. We match that identifier to the `device_id` in our telemetry database
6. Now we know everything about their machine: model, chip, battery health %, cycle count, capacity degradation
7. We surface **personalized product recommendations**:
   - Battery health < 50%? Suggest the exact replacement battery for their MacBook model
   - High cycle count? Recommend battery replacement kits
   - Old model? Suggest compatible accessories
   - Storage running low? Recommend external storage solutions
8. User shops with confidence knowing the recommendations are backed by real diagnostic data from their own machine

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Laravel | 12.x |
| PHP | PHP | 8.4 |
| Frontend Framework | React | 19 |
| Server-Side Rendering Bridge | Inertia.js | 2.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Animations | Framer Motion | 12.x |
| 3D Graphics | Three.js + React Three Fiber | Installed, future use |
| Payments | Stripe Checkout | stripe-php 19.x, @stripe/stripe-js 5.x |
| Auth Scaffolding | Laravel Breeze (React) | 2.x |
| Route Helpers | Ziggy | 2.x |
| API Auth | Laravel Sanctum | 4.x |
| Database | SQLite (dev) | - |
| Build Tool | Vite | 7.x |

---

## Project Structure

```
Pardia-website/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php           # Landing page with featured products
│   │   │   ├── ProductController.php        # Product listing, detail, download
│   │   │   ├── CartController.php           # Session-based cart CRUD
│   │   │   ├── CheckoutController.php       # Stripe session + order creation
│   │   │   ├── ProfileController.php        # User profile management
│   │   │   ├── TelemetryDashboardController.php  # Internal analytics dashboard
│   │   │   └── Api/V1/
│   │   │       └── TelemetryController.php  # PBM telemetry ingestion API
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php    # Shares auth, cart, flash to all pages
│   │   └── Requests/
│   │       ├── Auth/LoginRequest.php
│   │       └── ProfileUpdateRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php                      # belongsTo Category
│   │   ├── Category.php                     # hasMany Products
│   │   ├── Order.php                        # belongsTo User, hasMany OrderItems
│   │   ├── OrderItem.php                    # belongsTo Order, belongsTo Product
│   │   ├── Device.php                       # PBM device (UUID primary key)
│   │   ├── BatterySnapshot.php              # Battery health readings
│   │   └── WeeklyReport.php                 # Performance & usage metrics
│   └── Providers/
│       └── AppServiceProvider.php
├── database/
│   ├── migrations/                          # 11 migrations (users, cache, jobs,
│   │                                        #   categories, products, orders,
│   │                                        #   order_items, devices, battery_snapshots,
│   │                                        #   weekly_reports, personal_access_tokens)
│   └── seeders/
│       ├── DatabaseSeeder.php               # Test user + products
│       └── ProductSeeder.php                # 3 categories, 6 sample products
├── routes/
│   ├── web.php                              # All web routes
│   ├── api.php                              # Telemetry API routes (no auth)
│   └── auth.php                             # Laravel Breeze auth routes
├── resources/js/
│   ├── app.tsx                              # Inertia entry point + ErrorBoundary
│   ├── Pages/
│   │   ├── Home.tsx                         # Hero, featured products, categories, CTA
│   │   ├── Products/
│   │   │   ├── Index.tsx                    # Product grid with filters + pagination
│   │   │   └── Show.tsx                     # Product detail page
│   │   ├── Cart.tsx                         # Shopping cart page
│   │   ├── Checkout/
│   │   │   └── Success.tsx                  # Order confirmation
│   │   ├── Telemetry/
│   │   │   ├── Index.tsx                    # Fleet overview dashboard (internal)
│   │   │   └── Show.tsx                     # Individual device detail (internal)
│   │   ├── Auth/                            # Login, Register, ForgotPassword, etc.
│   │   ├── Profile/                         # Profile edit + partials
│   │   └── Dashboard.tsx                    # Unused (redirects to home)
│   ├── Layouts/
│   │   ├── MainLayout.tsx                   # Primary storefront layout
│   │   ├── AuthenticatedLayout.tsx          # Dashboard layout (Breeze default)
│   │   └── GuestLayout.tsx                  # Auth pages layout
│   ├── Components/                          # Reusable UI components (12)
│   └── types/
│       └── index.d.ts                       # TypeScript interfaces
├── config/
│   └── services.php                         # Stripe keys config
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Data Models

### E-commerce

**Category** → has many → **Product**
- Categories: Software, Hardware, Utilities

**User** → has many → **Order** → has many → **OrderItem** → belongs to → **Product**
- Orders track Stripe session/payment intent IDs
- Status: pending → processing → completed / cancelled

**Cart** is session-based (not a database model), shared to all pages via `HandleInertiaRequests` middleware.

### Telemetry

**Device** (UUID primary key: `device_id`)
- Hardware: model_identifier, chip, CPU cores (perf/eff), RAM, disk
- Software: os_version, os_build, app_version
- Tracking: first_seen_at

**Device** → has many → **BatterySnapshot**
- report_type: 'initial' | 'weekly'
- Health: health_percent, cycle_count, design/max/current capacity (mAh)
- State: level_percent, temperature_c, is_charging, is_plugged_in

**Device** → has many → **WeeklyReport**
- Performance: cpu_load_1min/5min/15min, sample_count
- Usage: screen_on_seconds, plugged_in_seconds, on_battery_seconds, charge_sessions, app_uptime_seconds
- Period: period_start, period_end

---

## API Endpoints

### Telemetry API (No Auth Required)

These endpoints are called by the PBM macOS app. No authentication - devices are identified by UUID.

#### `POST /api/v1/telemetry/initial`
Called when PBM first launches on a device. Upserts the device record and creates an initial battery snapshot.

```json
{
    "report_type": "initial",
    "device_id": "uuid-here",
    "timestamp": "2026-02-20T12:00:00Z",
    "app_version": "1.0.0",
    "os_version": "15.3",
    "os_build": "24D60",
    "hardware": {
        "model_identifier": "Mac14,2",
        "chip": "Apple M2",
        "cpu_core_count": 8,
        "cpu_performance_cores": 4,
        "cpu_efficiency_cores": 4,
        "ram_bytes": 8589934592,
        "disk_total_bytes": 245107195904
    },
    "battery": {
        "health_percent": 87.5,
        "cycle_count": 342,
        "design_capacity_mah": 5103,
        "max_capacity_mah": 4465,
        "current_capacity_mah": 3890,
        "level_percent": 72,
        "temperature_celsius": 31.2,
        "is_charging": false,
        "is_plugged_in": false
    }
}
```

#### `POST /api/v1/telemetry/weekly`
Called weekly with performance and usage metrics. Also creates a battery snapshot for tracking health over time.

```json
{
    "report_type": "weekly",
    "device_id": "uuid-here",
    "timestamp": "2026-02-20T12:00:00Z",
    "period_start": "2026-02-13T00:00:00Z",
    "period_end": "2026-02-20T00:00:00Z",
    "app_version": "1.0.0",
    "battery": {
        "health_percent": 87.3,
        "cycle_count": 345,
        "max_capacity_mah": 4460,
        "current_capacity_mah": 3750,
        "level_percent": 65,
        "temperature_celsius": 29.8
    },
    "performance": {
        "cpu_load_avg_1min": 2.45,
        "cpu_load_avg_5min": 1.89,
        "cpu_load_avg_15min": 1.23,
        "sample_count": 672
    },
    "usage": {
        "screen_on_time_seconds": 180000,
        "estimated_method": "ioreg",
        "total_plugged_in_seconds": 120000,
        "total_on_battery_seconds": 60000,
        "charge_sessions_count": 5,
        "app_uptime_seconds": 604800
    }
}
```

---

## Web Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Home page with featured products |
| GET | `/products` | No | Product listing with search/filters |
| GET | `/products/{slug}` | No | Product detail page |
| GET | `/products/{product}/download` | No | Free product download |
| GET | `/cart` | No | Shopping cart |
| POST | `/cart/add` | No | Add item to cart |
| PATCH | `/cart/update` | No | Update cart quantity |
| DELETE | `/cart/remove` | No | Remove from cart |
| POST | `/checkout` | Yes | Create Stripe session |
| GET | `/checkout/success` | Yes | Order confirmation |
| GET | `/profile` | Yes | Edit profile |
| PATCH | `/profile` | Yes | Update profile |
| DELETE | `/profile` | Yes | Delete account |
| GET | `/dashboard` | Yes | Redirects to home |
| GET | `/telemetry` | Yes | Fleet analytics dashboard (internal) |
| GET | `/telemetry/{deviceId}` | Yes | Device detail (internal) |

---

## Accounts & Access

### Admin Account
- Email: `admin@pardia.com`
- Password: `pardia123`
- Has access to `/telemetry` dashboard

### Test Account (from seeder)
- Email: `test@example.com`
- Password: `password`

### Access Model
- **Public**: Home, Products, Cart (anyone can browse and add to cart)
- **Authenticated**: Checkout, Profile, Telemetry (must be logged in)
- **Telemetry Dashboard**: Not linked in navigation - accessible only by direct URL (`/telemetry`) for logged-in users
- **Login/Register**: For customers shopping on the site (required for checkout)

---

## Personalized Shopping Flow (PLANNED - Not Yet Implemented)

This is the core differentiator of the Pardia platform. The PBM macOS app gathers real diagnostic data, and the storefront uses it to make smart product recommendations.

### How It Will Work

1. **User Registration / Onboarding**
   - User creates account on pardia.com (standard email/password)
   - After account creation, user is prompted for device information
   - User provides a unique identifier linking them to their device (options):
     - A pairing code displayed in the PBM macOS app
     - Device serial number
     - Device UUID shown in PBM settings

2. **Device Linking**
   - Backend matches the provided identifier to an existing `device_id` in the `devices` table
   - A new `user_devices` pivot table links `users.id` ↔ `devices.device_id`
   - One user can have multiple devices

3. **Recommendation Engine**
   - Queries the user's linked device(s) telemetry data
   - Analyzes key health indicators:
     - **Battery health < 50%** → Recommend replacement battery for their exact model
     - **High cycle count (>1000)** → Suggest battery replacement kits
     - **Old model identifier** → Suggest compatible upgrades/accessories
     - **Storage nearly full** → Recommend external storage
     - **High CPU load averages** → Suggest performance optimization software
   - Products in the catalog tagged with `compatible_models` or similar metadata
   - Recommendations displayed prominently on the user's home page and product pages

4. **Product Matching Data Points**
   - `devices.model_identifier` → Maps to compatible replacement parts (e.g., "Mac14,2" = MacBook Air M2 = specific battery model)
   - `battery_snapshots.health_percent` → Urgency indicator
   - `battery_snapshots.cycle_count` → Wear indicator
   - `battery_snapshots.design_capacity_mah` vs `max_capacity_mah` → Degradation level
   - `devices.chip` → Software compatibility
   - `devices.ram_bytes` → Memory upgrade eligibility
   - `devices.disk_total_bytes` → Storage recommendations

### Database Changes Needed
- `user_devices` pivot table (user_id, device_id, linked_at)
- Product compatibility metadata (compatible_models, compatible_chips, recommendation_triggers)
- User onboarding status tracking

---

## Sample Products (from Seeder)

| Product | Category | Price | Type |
|---------|----------|-------|------|
| Pardia Code Editor | Software | $79.99 | software |
| Pardia Cloud Suite | Software | $149.99 | software |
| Pardia File Manager | Utilities | Free | software |
| Pardia Dev Board Pro | Hardware | $129.99 | hardware |
| Pardia USB Hub Ultra | Hardware | $89.99 | hardware |
| Pardia Terminal | Utilities | Free | software |

---

## Key Design Decisions

- **Session-based cart** (not database) - simpler, no auth required to add items
- **Anonymous telemetry** - PBM app sends data without user auth, identified by device UUID
- **Inertia.js** - SPA feel without building a separate API, shares server state seamlessly
- **PaginatedData type** uses Laravel's native `paginate()` flat format (not API Resource nested `meta`/`links`)
- **ErrorBoundary** wraps the entire app in `app.tsx` for runtime error visibility
- **Vite dev server** binds to `127.0.0.1` (not IPv6) for local development compatibility
- **Telemetry dashboard** is auth-protected but not linked in navigation - internal tool only

---

## Development

### Start Servers
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite (for HMR)
npm run dev
```

### Build for Production
```bash
npm run build
```

### Database
```bash
# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed
```

### GitHub
- Repository: https://github.com/parlo12/Pardia.git
- Branch: `main`

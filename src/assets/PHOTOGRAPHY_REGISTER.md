# WaitLess — Photography & Asset Register

This document registers the source provenance, licensing terms, photographer attributions, canonical photo pages, and direct image URLs for all photographic assets used on the WaitLess landing page.

---

## 1. Asset Provenance & Licensing Register

All external photographs are curated under the **Pexels Commercial License** (free for commercial and personal use, modification permitted, no copyright or trademark infringement). All product interface mockups are authentic demonstration screenshots captured directly from the internal WaitLess demonstration environment running locally.

| Asset Filename | Subdirectory | Canonical Photo Page URL | Direct Image Source URL | Photographer / Attribution | License Terms | Responsive Dimensions | WCAG AA/AAA Alt Text |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero-venue-backdrop.webp` | `src/assets/hero/` | [Pexels Photo #1813272](https://www.pexels.com/photo/photo-of-barber-shop-interior-1813272/) | `https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg` | **Thgusstavo Santana** | Pexels Commercial License (Free to use) | 1920 × 1080 (16:9) | "Atmospheric modern barber studio with illuminated styling stations and leather chairs" |
| `showcase-customer-lifestyle.webp` | `src/assets/showcase/` | [Pexels Photo #3771836](https://www.pexels.com/photo/young-man-using-smartphone-in-cafe-3771836/) | `https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg` | **Andrea Piacquadio** | Pexels Commercial License (Free to use) | 1000 × 1200 (5:6) | "Patron reviewing digital queue ticket on smartphone while waiting at an outdoor cafe" |
| `showcase-business-counter.webp` | `src/assets/showcase/` | [Pexels Photo #7089626](https://www.pexels.com/photo/modern-reception-desk-in-contemporary-office-7089626/) | `https://images.pexels.com/photos/7089626/pexels-photo-7089626.jpeg` | **Max Rahubovskiy** | Pexels Commercial License (Free to use) | 1200 × 900 (4:3) | "Reception desk operator utilizing a digital counter tablet at a modern service venue" |
| `cat-barbers-salons.webp` | `src/assets/categories/` | [Pexels Photo #1319460](https://www.pexels.com/photo/hairdresser-shaving-man-hair-1319460/) | `https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg` | **Aphiwat chuangchoem** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Modern barber and hair styling studio with station mirrors and chairs" |
| `cat-health-clinics.webp` | `src/assets/categories/` | [Pexels Photo #8460084](https://www.pexels.com/photo/clean-and-modern-medical-clinic-room-with-diagnostic-tools-and-furniture-8460084/) | `https://images.pexels.com/photos/8460084/pexels-photo-8460084.jpeg` | **Antoni Shkraba** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Modern medical consultation room and healthcare clinic reception" |
| `cat-auto-repair.webp` | `src/assets/categories/` | [Pexels Photo #4489749](https://www.pexels.com/photo/man-in-blue-crew-neck-t-shirt-using-laptop-computer-4489749/) | `https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg` | **Andrea Piacquadio** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Automotive service bay with technician diagnostic equipment" |
| `cat-dining-cafes.webp` | `src/assets/categories/` | [Pexels Photo #2074130](https://www.pexels.com/photo/counter-of-coffee-shop-with-glass-jar-2074130/) | `https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg` | **Mike Jones** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Artisan cafe counter with order pickup area" |
| `cat-beauty-wellness.webp` | `src/assets/categories/` | [Pexels Photo #3757942](https://www.pexels.com/photo/peaceful-massage-room-in-spa-salon-3757942/) | `https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg` | **Andrea Piacquadio** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Calm wellness and spa treatment room with natural lighting" |
| `cat-fitness-therapy.webp` | `src/assets/categories/` | [Pexels Photo #4506109](https://www.pexels.com/photo/physiotherapy-room-with-massage-table-4506109/) | `https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg` | **cottonbro studio** | Pexels Commercial License (Free to use) | 800 × 600 (4:3) | "Physical therapy and rehabilitation studio room" |
| `mockup-desktop-queue.webp` | `src/assets/hero/` | `http://localhost:5173/business/queue` (Local Application) | N/A (Internal Capture) | WaitLess Test Suite (`Crown & Blade Studio`) | Proprietary Internal Demonstration Capture | 1440 × 900 (16:10) | "Operator queue management desk showing active station and example queue status" |
| `mockup-mobile-ticket.webp` | `src/assets/hero/` | `http://localhost:5173/user/queue` (Local Application) | N/A (Internal Capture) | WaitLess Test Suite (`Crown & Blade Studio`) | Proprietary Internal Demonstration Capture | 750 × 1334 (9:16) | "Customer mobile queue ticket interface showing token number and arrival grace status" |

---

## 2. Operator-Controlled Arrival Grace Workflow Protocol

The arrival grace buffer is strictly an **operator-controlled process** established in `src/pages/business/page/Queue.jsx`. There is no automated GPS detection, no geofence triggers, and no automated eviction timers.

```
+-----------------------------------------------------------------------------------------+
|                                4-STAGE OPERATOR WORKFLOW                                 |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [ Phase 1: Customer Called ]                                                          |
|  Counter operator clicks "Call Next Token" from the station console.                   |
|  The ticket advances to the current active station.                                     |
|                                                                                         |
|                                          |                                              |
|                                          v                                              |
|                                                                                         |
|  [ Phase 2: Grace Period (10m Active) ]                                                 |
|  The station marks a 10-minute arrival window for the customer to report.              |
|  The customer's interface displays "Example token status: Called (10m Grace Buffer)".   |
|                                                                                         |
|                                          |                                              |
|                                          v                                              |
|                                                                                         |
|  [ Phase 3: Waiting at Counter / Checking In ]                                          |
|  Staff holds the station chair. Customer reports in person at the front desk.          |
|                                                                                         |
|                                          |                                              |
|                        +-----------------+-----------------+                            |
|                        |                                   |                            |
|                        v                                   v                            |
|                                                                                         |
|  [ Phase 4A: Service Commences ]                  [ Phase 4B: Token Skipped ]           |
|  Operator clicks "Complete Service" or             If absent after buffer window,        |
|  "Mark In Service". Station begins appointment.   operator clicks "Skip Customer".      |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Product Terminology & Communication Standards

- **Customer queue interface**: Refers to the customer-facing smartphone ticket view displaying token number and station details.
- **Operator queue interface**: Refers to the desk/station management console with call, complete, and skip controls.
- **Example token status**: Standard label for illustrative queue states (`#A-18`, 3 parties ahead), preventing any assumption of live WebSocket telemetry.
- **Demonstration workflow**: Refers to sample cumulative duration calculations (30m + 15m = 45m) and dual-mode scheduling options.

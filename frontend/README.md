# CampusPulse — College Event Countdown & RSVP Tracker (React Frontend)

[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite%208-purple.svg)](https://vitejs.dev/)
[![React%20Router](https://img.shields.io/badge/Routing-React%20Router%207-red.svg)](https://reactrouter.com/)
[![Theme](https://img.shields.io/badge/Theme-Professional%20Light-green.svg)](#)

> **CampusPulse: College Event Countdown & RSVP Tracker**  
> A lightweight internal college event management, live countdown, and digital RSVP platform engineered with React.js, Vite, and modern modular architecture.

---

## 📌 1. Project Highlights & Core Rules

- **Zero Student Login**: Students do **NOT** create accounts or remember passwords. They discover events directly, register with Name & Roll Number, and immediately receive a digital entry pass with a verification QR code.
- **Dedicated Role Logins**:
  - **Host / Event Organizer Portal**: `/host/login`
  - **Admin Governance Portal**: `/admin/login`
- **Professional Light Theme**: Clean white and slate backgrounds with professional royal blue/indigo accents.
- **Real-Time Live Countdown Engine**: Dynamic second-by-second countdown timers on event cards, details, and entry passes.
- **QR Code Entry Verification**: Built-in QR scanner simulation and manual event code verification.

---

## 🔑 2. Mock Accounts for Evaluation

| Role | Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **Host / Organizer** | `host@campuspulse.com` | `host123` | `http://localhost:3000/host/login` |
| **Admin** | `admin@campuspulse.com` | `admin123` | `http://localhost:3000/admin/login` |
| **Student** | *No account needed* | *Direct RSVP* | `http://localhost:3000/events` |

---

## 🚀 3. How to Run the Frontend

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Vite Development Server
```bash
npm run dev -- --port 3000
```

Open **`http://localhost:3000`** in your browser.

---

## 🗺️ 4. Frontend Route Sitemap

### Public Routes
- `/` — Landing / Home (Hero, Featured Spotlight, Upcoming Events, How It Works, Categories)
- `/about` — About CampusPulse, problem statement, and stakeholder benefits
- `/events` — Public Events Directory with search, category filter pills, and date filters
- `/events/:eventId` — Event Details with live countdown, specs, rules, and Register CTA

### Student Flow (No Login Required)
- `/events/:eventId/register` — Student Registration / RSVP Form with duplicate prevention
- `/entry-pass/:registrationId` — Digital Entry Pass with Scannable QR Code and Print capability

### Host / Event Organizer Portal (Protected)
- `/host/login` — Host authentication portal
- `/host/dashboard` — Host KPI overview, upcoming events, and quick actions
- `/host/events` — Host Event Catalog & status management
- `/host/events/create` — Create New Event form (Name, Category, Schedule, Capacity, Rules)
- `/host/events/:eventId/edit` — Edit Event form
- `/host/events/:eventId/registrations` — Attendee management roster & CSV export
- `/host/events/:eventId/scanner` — QR Code Attendance Scanner & verification UI

### Admin Governance Portal (Protected)
- `/admin/login` — Administrator authentication portal
- `/admin/dashboard` — Central college platform statistics & live registration stream
- `/admin/events` — College-wide Event Management (Status updates, cancel, search)
- `/admin/users` — Faculty Host / Organizer Management (Onboard, activate, deactivate, block)

---

## 📂 5. Architecture & File Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx           # Public navbar (Host & Admin logins only, NO Student login)
│   │   │   ├── Footer.jsx           # College footer with contact info
│   │   │   ├── Button.jsx           # Reusable button with loading & icon states
│   │   │   ├── Input.jsx            # Form input with validation & error handling
│   │   │   ├── Modal.jsx            # Accessible dialog modal
│   │   │   ├── Countdown.jsx        # Live second-by-second countdown timer
│   │   │   ├── StatusBadge.jsx      # Upcoming, Live, Completed, Cancelled badges
│   │   │   ├── Loading.jsx          # Spinner loader
│   │   │   ├── EmptyState.jsx       # Empty state placeholder
│   │   │   ├── Toast.jsx            # Toast alert notification
│   │   │   └── ConfirmationModal.jsx# Action confirmation modal
│   │   ├── events/
│   │   │   ├── EventCard.jsx        # Event card with countdown & capacity progress
│   │   │   ├── EventSearch.jsx      # Search input with debounce support
│   │   │   └── EventFilter.jsx      # Category pills & date filter controls
│   │   ├── host/
│   │   │   ├── HostSidebar.jsx      # Host portal sidebar navigation
│   │   │   ├── HostHeader.jsx       # Host dashboard header
│   │   │   └── RegistrationTable.jsx# Attendee management table & CSV export
│   │   └── admin/
│   │       ├── AdminSidebar.jsx     # Admin portal sidebar navigation
│   │       ├── AdminHeader.jsx      # Admin header
│   │       ├── StatCard.jsx         # KPI metric card
│   │       ├── EventTable.jsx       # Global event management table
│   │       └── UserTable.jsx        # Organizer account management table
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx             # Public landing page
│   │   │   ├── About.jsx            # About & benefits page
│   │   │   ├── Events.jsx           # Event directory & search
│   │   │   └── EventDetails.jsx     # Event details & RSVP CTA
│   │   ├── student/
│   │   │   ├── EventRegistration.jsx# Direct student registration form
│   │   │   └── EntryPassPage.jsx    # Digital entry pass with QR code
│   │   ├── host/
│   │   │   ├── HostLogin.jsx        # Host login
│   │   │   ├── HostDashboard.jsx    # Host dashboard
│   │   │   ├── HostEvents.jsx       # Host event catalog
│   │   │   ├── CreateEvent.jsx      # Create event
│   │   │   ├── EditEvent.jsx        # Edit event
│   │   │   ├── EventRegistrations.jsx # Attendees roster
│   │   │   └── QRScanner.jsx        # QR attendance verification
│   │   └── admin/
│   │       ├── AdminLogin.jsx       # Admin login
│   │       ├── AdminDashboard.jsx   # Admin platform KPIs
│   │       ├── EventManagement.jsx  # Event oversight
│   │       └── UserManagement.jsx   # Organizer management
│   ├── data/
│   │   ├── mockHosts.js             # Initial host organizers (4+ hosts)
│   │   ├── mockAdmins.js            # Initial administrators
│   │   ├── mockEvents.js            # 10+ realistic events across all categories
│   │   └── mockRegistrations.js     # 10+ student registration records
│   ├── context/
│   │   ├── HostAuthContext.jsx      # Host session state
│   │   └── AdminAuthContext.jsx     # Admin session state
│   ├── routes/
│   │   └── AppRoutes.jsx            # Complete routing table & protected layouts
│   ├── services/
│   │   ├── api.js                   # API configuration & localStorage keys
│   │   ├── eventApi.js              # Event queries & mutations
│   │   ├── registrationApi.js       # Student registration & QR check-in
│   │   ├── hostApi.js               # Host session & dashboard APIs
│   │   └── adminApi.js              # Admin platform governance APIs
│   ├── App.jsx                      # App root component
│   ├── main.jsx                     # Vite mount point
│   └── index.css                    # Professional light theme design system
├── package.json
├── vite.config.js                   # Vite dev server on port 3000
└── README.md
```

---

## ⚡ 6. Preparation for Future Backend Phases

The entire frontend services layer (`src/services/`) is modularized. In **Phase 2 & 3**, the `localStorage` queries can seamlessly transition to REST API endpoints at `http://localhost:5000/api` without altering UI components.

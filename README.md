# JIOS Padel & Coffee — Web Application

A premium padel venue booking system combined with a café, built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

---

## 🚀 Quick Start (Demo Mode)

The app ships with mock data enabled so you can test everything without Firebase.

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open http://localhost:5173

**Demo admin login:** `admin@jios.com` / `jios2024`

---

## 📁 Project Structure

```
src/
  components/         # Reusable UI components
    admin/            # Admin-specific components
  pages/              # Page components
    admin/            # Admin pages
  layouts/            # Layout wrappers
  lib/                # Firebase init, mock data
  services/           # Firestore & Auth logic
  hooks/              # Custom React hooks
  types/              # TypeScript interfaces
  config/             # Site config (edit here!)
  utils/              # Helper functions
```

---

## ⚙️ Configuration

Edit **`src/config/site.ts`** to update:
- Business name, address, phone, hours
- Time slots and booking durations
- Google Maps URL

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Name it (e.g., `jios-padel`) and follow the setup wizard

### Step 2: Create Web App

1. In your project, click the **Web** icon (`</>`)
2. Register the app with a nickname (e.g., `JIOS Web`)
3. Copy the `firebaseConfig` object — you'll need these values

### Step 3: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and fill in your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Switch to real Firebase (disable mock mode)
VITE_USE_MOCK_DATA=false
```

### Step 4: Enable Firebase Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Under **Sign-in method**, enable **Email/Password**
3. Click **Save**

### Step 5: Create Admin Account

1. Go to **Authentication** → **Users** → **Add user**
2. Enter the admin email and a strong password
3. This is the account used to log into `/admin`

### Step 6: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select your preferred region

### Step 7: Apply Security Rules

In Firestore → **Rules** tab, paste the contents of `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // See firestore.rules for full content
  }
}
```

Click **Publish**.

### Step 8: Deploy Firestore Indexes

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Firestore)
firebase init firestore

# Deploy indexes
firebase deploy --only firestore:indexes
```

Or create them manually in Firebase Console → Firestore → **Indexes**.

### Step 9: Create Initial Firestore Collections

In Firestore Console, create these documents manually:

**courts/court-1**
```json
{
  "id": "court-1",
  "name": "Court 1",
  "isActive": true,
  "order": 1
}
```

**settings/general**
```json
{
  "openTime": "08:00",
  "closeTime": "22:00",
  "maxPlayersPerCourt": 4
}
```

---

## 🗄️ Firestore Data Structure

```
bookings/
  {bookingId}
    referenceId: "JIOS-1023"        // Auto-generated
    customerName: "John Doe"
    phone: "08111234567"
    date: "2026-09-27"              // YYYY-MM-DD
    startTime: "14:00"              // HH:MM
    endTime: "16:00"                // HH:MM
    duration: 2                     // hours (1, 1.5, 2)
    courtId: "court-1"
    playerCount: 4
    notes: "Birthday game"
    status: "confirmed"             // or "cancelled"
    createdAt: Timestamp
    updatedAt: Timestamp

courts/
  court-1
    id: "court-1"
    name: "Court 1"
    isActive: true
    order: 1

settings/
  general
    openTime: "08:00"
    closeTime: "22:00"
    maxPlayersPerCourt: 4
```

---

## 🔒 Security Architecture

**IMPORTANT:** Firestore Security Rules are the real access control layer, not frontend code.

| Action | Public | Admin |
|--------|--------|-------|
| Read booking details (name, phone) | ❌ | ✅ |
| Read availability (dates/times only) | ✅ | ✅ |
| Create booking | ✅ | ✅ |
| Update/Delete booking | ❌ | ✅ |
| Manage courts & settings | ❌ | ✅ |

**Privacy design:** Public users read from availability info embedded in booking queries — start/end times only. Customer names and phone numbers are protected by Firestore rules (only authenticated admins can read full booking documents).

---

## 🛡️ Concurrency / Double Booking Prevention

The app uses **Firestore Transactions** (`runTransaction`) to prevent double bookings. When a customer confirms a booking:

1. A transaction starts
2. All existing bookings for the same date+court are read
3. If any overlap is found → transaction is rejected
4. If clear → the booking document is created atomically

This prevents race conditions even if two users submit simultaneously.

---

## 📱 Public Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, Padel info, About, Booking, Location) |
| `/booking` | Dedicated booking page |
| `/schedule` | Public availability schedule |

## 🔐 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard with timetable |
| `/admin/bookings` | All bookings list with search |
| `/admin/schedule` | Schedule view |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Build
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

Set environment variables in Vercel dashboard under **Settings → Environment Variables**.

### Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

In `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

### Netlify

1. Connect your Git repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify → Site Settings → Environment Variables

---

## 🧪 Testing the App

### Flow 1: Customer Booking
1. Open `/`
2. Click **Book a Court**
3. Select date and time slot
4. Fill in name and phone
5. Review and confirm → see booking reference

### Flow 2: View Schedule
1. Open `/schedule`
2. Select a date
3. See available/booked slots
4. No customer names or phone numbers visible

### Flow 3: Admin Operations
1. Open `/admin/login`
2. Login with admin credentials
3. View timetable on dashboard
4. Click a booking → edit, move, or delete
5. Go to **All Bookings** → search and filter

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| TypeScript | Type safety |
| Tailwind CSS 3 | Styling |
| Firebase 10 | Auth + Database |
| React Router 6 | Client-side routing |
| date-fns | Date utilities |
| Lucide React | Icons |

---

## ✏️ Customization

### Change Business Info
Edit `src/config/site.ts` — one file for all business settings.

### Change Time Slots
Edit `TIME_SLOTS` array in `src/config/site.ts`.

### Change Colors
Edit `tailwind.config.js` — `navy`, `cream`, and `caramel` color scales.

---

*Built for JIOS Padel & Coffee*

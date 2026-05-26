# TravelSync / TripNest

AI-powered travel planner built with React, Vite, Firebase, and Mappls (MapmyIndia).

## Features

- Cinematic dark glassmorphism UI with orange accents
- Home hero carousel, search panel, destination carousels
- Discover page with category filters and place details modal
- Travel planner with itinerary timeline, budget charts, PDF export
- AI travel assistant chat
- Firebase Auth (email + Google) and Firestore sync
- Mappls interactive maps with routes and markers (optimized for India)
- RapidAPI Travel Advisor places integration with mock fallbacks

## Quick Start

```bash
npm install
cp .env.example .env
# Add Firebase + API keys to .env
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | Firebase web app config |
| `VITE_PLACES_API_KEY` | RapidAPI key for Travel Advisor API |
| `VITE_MAPPLS_API_KEY` | Mappls access token from [apis.mappls.com/console](https://apis.mappls.com/console) |

Without Firebase configured, the app runs in **demo mode** (localStorage for trips/auth).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Authentication

- Email/password signup & login with validation and password strength meter
- Google sign-in (`signInWithPopup`)
- Forgot password page (`/forgot-password`)
- Persistent sessions (`browserLocalPersistence`)
- Protected routes: `/planner`, `/dashboard`, `/profile`, `/saved`
- Firestore user profiles at `users/{uid}`
- Navbar user menu with avatar dropdown
- React Hot Toast notifications

Enable in [Firebase Console](https://console.firebase.google.com/) → Authentication → Sign-in method: **Email/Password** and **Google**.

## Firestore Cloud Sync

Planner data syncs to Firestore collections: `users`, `trips`, `itineraries`, `budgets`, `savedPlaces`.

- **Real-time:** `onSnapshot` keeps trips in sync across tabs/devices
- **Auto-save:** Debounced save every 3 seconds after edits
- **Manual save:** "Save Now" on Planner page
- **Auth required:** Unauthenticated users are redirected to login with a toast

Deploy security rules:

```bash
npx firebase-tools@latest deploy --only firestore:rules
```

## Deploy (Firebase Hosting)

```bash
npm run build
npx firebase-tools@latest deploy --only hosting
```

## Project Structure

```
src/
├── components/   # Navbar, Hero, Cards, Map, etc.
├── pages/        # Home, Discover, Planner, AI, Auth, Profile
├── css/          # External stylesheets only
├── context/      # Auth, Trips, App state
├── services/     # Places, Maps, Firebase, AI
├── firebase/     # Firebase init
├── routes/       # Router + protected routes
└── utils/        # Helpers, constants, mocks
```

## License

MIT

# QuickFix — Local Services Finder

A location-aware, city-based service marketplace where customers discover local service providers (electricians, plumbers, decorators, beauty, events, and more) and providers can register and manage their service listings.

- Built with: React + TypeScript + TailwindCSS
- Backend: Firebase (Firestore + Authentication)

---

Table of contents
- [Overview](#overview)
- [Key Features](#key-features)
  - [User Features](#user-features)
  - [Provider Features](#provider-features)
  - [Location System](#location-system)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment Variables](#environment-variables)
  - [Run (development)](#run-development)
- [Firebase / Firestore](#firebase--firestore)
  - [Collections & Schema](#collections--schema)
  - [Location filtering / querying](#location-filtering--querying)
  - [Security & Rules (notes)](#security--rules-notes)
- [Screenshots (with image numbers)](#screenshots-with-image-numbers)
- [Known Limitations](#known-limitations)
- [Roadmap / Future Enhancements](#roadmap--future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

QuickFix helps users find service providers near them by city and category. Users can detect their location (GPS or manual), browse categories, view provider details, and contact providers directly. Providers can sign up, add multiple listings, update and remove listings, and manage them from the "My Services" view.

---

## Key Features

### User Features
- Location detection (GPS + manual)
- Browse categorized services (Electrician, Plumber, Beauty, Events, etc.)
- Search services by city
- View provider details and call directly
- Auth-guarded provider interactions where required

### Provider Features
- Provider registration (detailed form)
- Add unlimited service listings with details and images
- Edit and delete service listings
- Manage all listings in "My Services"
- Listings by owner are filtered out from general discovery

### Location System
- Persistent LocationContext stored in localStorage
- Normalized city comparison (city_lc lowercased)
- Optional lat/lng coordinates for smarter filtering and mapping
- Category and search pages auto-filter by selected/detected city

---

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- State: React Context API (AuthContext, LocationContext)
- Backend: Firebase Firestore
- Auth: Firebase Authentication
- Geocoding: Browser Geolocation API + OpenStreetMap reverse geocoding
- Icons: lucide-react

---

## Project Structure

src/
- components/ — reusable UI components (Navbar, CategoryCard, ProviderCard, etc.)
- contexts/ — AuthContext.tsx, LocationContext.tsx
- pages/ — Home, Login, ProviderRegistration, CategoryListing, ProviderDetail, SearchResults, MyServices
- lib/ — firebase.ts, geo.ts (helpers, sdk initialization)
- utils/ — utility functions (filterSelf.ts, normalizeCity.ts)
- App.tsx — route and app setup

---

## Getting Started

### Prerequisites
- Node.js (14+ recommended)
- npm or yarn
- Firebase project

### Install
```bash
git clone https://github.com/Satwikindupuri/quickfix.git
cd quickfix
npm install
# or
# yarn
```

### Environment Variables
Create a `.env` (or `.env.local`) file in project root with your Firebase config (Vite uses VITE_ prefix):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> Keep these values secure and do not commit them to the repository.

### Run (development)
```bash
npm run dev
# or
# yarn dev
```

Build for production:
```bash
npm run build
```

---

## Firebase / Firestore

### Collections & Schema

Collection: `providers`

Each document represents a single service listing. Example fields:

- uid: string — owner user id
- name: string — provider name
- firm_name: string — business name
- category: string — chosen category (e.g., "Electrician")
- city: string — city display name (e.g., "Vijayawada")
- city_lc: string — normalized city (lowercase) for matching
- lat: number — latitude (optional)
- lng: number — longitude (optional)
- price: string — price or price range
- experience_years: number — years of experience
- description: string — service description
- phone: string — contact number
- images: array<string> — storage URLs (optional)
- created_at: timestamp — created time
- updated_at: timestamp — last update time

(Adjust fields as needed in your application code.)

### Location filtering / querying

Category and search pages filter providers by the normalized city field:

Example Firestore query (pseudocode / SDK):

```ts
const q = query(
  collection(db, "providers"),
  where("city_lc", "==", location.city_lc),
  where("category", "==", category) // optional if category page
);
```

Provider listings created by the current user should be excluded in discover pages. Note that Firestore's query operators may impose constraints; a common approach is to filter UID client-side if needed.

### Security & Rules (notes)
- Require authentication for create/update/delete provider operations.
- Only allow users to edit/delete their own provider documents (based on uid).
- Validate field types and sizes where appropriate.
- Use Firestore rules to avoid unauthorized writes/reads.

---

## Screenshots (with image numbers)

Below are the primary UI screenshots and their corresponding image numbers you provided. Add the following image files to the repository under `screenshots/` with the filenames shown if you want them embedded in the README.

Image number mapping:
- Image 1 — screenshots/home.png — Home landing page (hero + category cards)
- Image 2 — screenshots/categories.png — Category grid / Browse by Category
- Image 3 — screenshots/provider-details.png — Provider registration / Provider detail form
- Image 4 — screenshots/my-services.png — My Services (provider dashboard)

Embed examples (place images in `screenshots/` folder):

![1 — Home](screenshots/home.png)
*Image 1 — Home landing page (hero + category cards)*

![2 — Categories](screenshots/categories.png)
*Image 2 — Browse by Category grid*

![3 — Provider Registration / Details](screenshots/provider-details.png)
*Image 3 — Register as Service Provider / Provider detail form*

![4 — My Services](screenshots/my-services.png)
*Image 4 — My Services (provider dashboard with edit/delete actions)*

If you prefer to host images elsewhere (GitHub attachments, CDN), replace the paths above with the hosted URLs.

---

## Known Limitations

- Location detection depends on browser permissions and accuracy.
- City normalization relies on consistent city names (store lowercased city in city_lc).
- Firestore composite indexes are required for some complex queries — console will show links to create them.
- Filtering out the current user's listings while using server-side filters can require careful query design due to Firestore limitations (consider client-side filter as fallback).

---

## Roadmap / Future Enhancements

- Offline-first browsing / local cache
- Push notifications for new or updated listings
- In-app chat and booking/scheduling
- Provider verification with document upload flow
- Multi-language UI support
- AI-based recommendations and ranking

---

## Contributing

Contributions are welcome!

- Open an issue to discuss major changes.
- Fork the repo and create a feature branch:
  ```bash
  git checkout -b feat/your-feature
  ```
- Make changes, add tests if applicable, and open a pull request.

Please follow code style (TypeScript typings, React best practices, and Tailwind conventions).

---

## License

MIT License — see LICENSE file.

---

## Contact

Maintainer: Satwik Indupuri  
- GitHub: https://github.com/Satwikindupuri

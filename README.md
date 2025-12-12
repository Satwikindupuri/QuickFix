QuickFix – Local Services Finder App

A location-aware service marketplace where users can discover electricians, plumbers, decorators, and other providers near their city.
Providers can register, manage their services, and get discovered by customers.

🌟 Overview

QuickFix is a lightweight, city-based service discovery platform built using React + Firebase.
Users can:

Detect their location

Browse categories

View local service providers filtered by city

Call providers directly

Sign up and manage their own service listings

Providers can:

Register as a service provider

Add multiple services

Edit or delete existing services

View all their listings in My Services

✨ Features
User Features

Location detection (GPS + manual)

Browse categorized services (Electrician, Plumber, Beauty, Events, etc.)

Search services by city

View verified provider details

Direct call option

Auth-guarded browsing (login required)

Provider Features

Provider registration with detailed form

Add unlimited service listings

Edit, delete, and manage services in My Services

Provider-filtered results (providers cannot see their own listings)

Location System

Persistent LocationContext (saved in LocalStorage)

Normalized city comparison (case-insensitive)

Automatic lat/lng detection for smarter filtering

Category and search pages auto-filter based on detected location

Security & Data Rules

Users must be authenticated before accessing key features

Providers cannot see their own listings anywhere except My Services

🛠 Tech Stack
Area	Technology
Frontend	React + TypeScript + Tailwind CSS
Backend	Firebase Firestore
Auth	Firebase Authentication
State	React Context API + LocationContext
Geolocation	Browser Geolocation API + OpenStreetMap Reverse Geocoding
Icons	lucide-react
📂 Project Structure
src/
│
├── components/
│   ├── Navbar.tsx
│   ├── CategoryCard.tsx
│   └── ...
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── LocationContext.tsx
│   └── ...
│
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── ProviderRegistration.tsx
│   ├── CategoryListing.tsx
│   ├── ProviderDetail.tsx
│   ├── SearchResults.tsx
│   ├── MyProviders.tsx
│
├── lib/
│   ├── firebase.ts
│   ├── geo.ts
│
├── utils/
│   └── filterSelf.ts
│
└── App.tsx

🔧 Setup Instructions
1. Clone the project
git clone https://github.com/yourusername/quickfix.git
cd quickfix

2. Install dependencies
npm install

3. Configure Firebase

Create a .env file:

VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=sender-id
VITE_FIREBASE_APP_ID=your-app-id

4. Start Development Server
npm run dev

🔥 Firestore Collections Used
providers

Stores each service listing.

Field	Type	Description
uid	string	Owner user id
name	string	Provider person name
firm_name	string	Business name
category	string	Category selected
city	string	City name
city_lc	string	Normalized city name (lowercase)
lat, lng	numbers	Geo coordinates
price	string	Price range
experience_years	number	Experience
description	string	Service description
created_at	timestamp	Created time

📍 How Location Filtering Works

User sets location (manual or GPS).

LocationContext saves:

city

city_lc (normalized for easy matching)

lat

lng

Category pages (/category/:name) filter using:

Firestore where("city_lc", "==", location.city_lc)

SearchResults also uses the same filtering logic.

Provider listings created by the same user are automatically filtered out.

🧪 Known Limitations

Firestore composite indexes must be created when required.
(Firebase console links will appear in browser logs.)

Location detection depends on browser permission.

City names must be consistent ("Vijayawada" ≠ "vijaywada" unless stored normalized).

🚀 Future Enhancements

Offline-first mode (browse cached services)

Push notifications for provider updates

Chat between user & provider

In-app booking & scheduling

Provider verification badge with documents

Multi-language UI support

AI-based provider recommendation

📸 Screenshots

Add screenshots here

/screenshots
    home.png
    <img width="1823" height="907" alt="image" src="https://github.com/user-attachments/assets/3439b49f-d8fb-4890-a5c1-002a64b45e55" />

    categories.png
    <img width="1600" height="749" alt="image" src="https://github.com/user-attachments/assets/74a6103c-064f-43ca-83bb-f6d9ee23e95b" />

    provider-details.png
    <img width="639" height="905" alt="image" src="https://github.com/user-attachments/assets/17a69550-3951-4e5f-bacb-7939443859f5" />

    my-services.png
    <img width="1283" height="592" alt="image" src="https://github.com/user-attachments/assets/445c039b-a701-4d94-a81b-dad42792e065" />

🤝 Contribution

Pull requests are welcome.
For major changes, open an issue first to discuss what you would like to change.

📄 License

MIT License.

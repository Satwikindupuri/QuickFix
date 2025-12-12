# HelpHub - Local Services Finder

A complete MVP web application for finding and connecting with local service providers.

## Features

- User authentication (email/password)
- Two user roles: Service Seeker and Service Provider
- Browse services by category
- Search providers by city
- Provider registration with detailed profiles
- Direct contact via phone calls
- 12 service categories: Electrician, Plumber, Appliances, Decoration, Packer & Movers, Beauty, Food, Education, Mechanical, Events, PG/Hostel, Loans

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## Usage Guide

### For Service Seekers

1. Visit the homepage
2. Enter your city in the search bar
3. Click on a service category (e.g., Electrician, Plumber)
4. Browse available providers
5. Click on a provider to view full details
6. Click "Call Now" to contact them directly

### For Service Providers

1. Click "Sign In" in the navigation bar
2. Create an account with email and password
3. After signing up, select "Become a Provider"
4. Fill out the registration form with:
   - Your name
   - Firm name
   - Service category
   - City
   - Phone number
   - Years of experience
   - Service description
   - Price range
5. Submit to list your services

## Database Schema

The app uses a single `providers` table with the following structure:

- `id`: Unique identifier
- `uid`: User ID (links to authenticated user)
- `name`: Provider's name
- `firm_name`: Business name
- `category`: Service category
- `city`: Operating city
- `phone`: Contact number
- `description`: Service details
- `experience_years`: Years of experience
- `price`: Price range
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable components (Navbar)
├── contexts/        # React contexts (AuthContext)
├── lib/            # Utilities (Supabase client)
├── pages/          # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── RoleSelection.tsx
│   ├── ProviderRegistration.tsx
│   ├── CategoryListing.tsx
│   └── ProviderDetail.tsx
├── App.tsx         # Main app with routing
└── main.tsx        # Entry point
```

## Routes

- `/` - Home page with categories
- `/login` - Authentication page
- `/role` - Role selection (after signup)
- `/register/provider` - Provider registration form
- `/category/:category` - List of providers by category
- `/provider/:id` - Provider detail page

## Security Features

- Row Level Security (RLS) enabled on database
- Users can only edit their own provider profiles
- Anyone can view provider listings
- Authentication required for provider registration

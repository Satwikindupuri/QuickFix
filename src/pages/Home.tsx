// src/pages/Home.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentPositionPromise, reverseGeocode, geocodeCity } from "../lib/geo";
import { useLocationContext, normalizeCity } from "../contexts/LocationContext";

const categories = [
  { name: "Electrician", color: "bg-yellow-100" },
  { name: "Plumber", color: "bg-blue-100" },
  { name: "Appliances", color: "bg-gray-100" },
  { name: "Decoration", color: "bg-pink-100" },
  { name: "Packer & Movers", color: "bg-orange-100" },
  { name: "Beauty", color: "bg-purple-100" },
  { name: "Food", color: "bg-red-100" },
  { name: "Education", color: "bg-green-100" },
  { name: "Mechanical", color: "bg-slate-100" },
  { name: "Events", color: "bg-indigo-100" },
  { name: "PG/Hostel", color: "bg-teal-100" },
  { name: "Loans", color: "bg-emerald-100" },
];

export default function Home() {
  const [searchCity, setSearchCity] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLocation } = useLocationContext();

  const canBrowse = Boolean(user);

  const handleCategoryClick = (category: string) => {
    if (!canBrowse) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          `/category/${category}?city=${encodeURIComponent(
            searchCity.trim() || "all"
          )}`
        )}`
      );
      return;
    }

    const city = searchCity.trim() || "all";
    navigate(
      `/category/${encodeURIComponent(category)}?city=${encodeURIComponent(
        city
      )}`
    );
  };

  // NEW: navigate to global search results (search across all categories)
  const handleSearchClick = async () => {
    const city = searchCity.trim();
    if (!city) return;

    // set global location too (so category pages and others auto-filter)
    try {
      const geo = await geocodeCity(city);
      const lat = geo?.lat ?? null;
      const lng = geo?.lon ?? null;
      setLocation({ city, city_lc: normalizeCity(city), lat, lng });
    } catch (e) {
      // ignore geocode error; still set city
      setLocation({ city, city_lc: normalizeCity(city), lat: null, lng: null });
    }

    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  const handleUseMyLocation = async () => {
    try {
      const pos = await getCurrentPositionPromise({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // get city from coords
      const place = await reverseGeocode(lat, lng);
      const city = place?.city ?? place?.display_name ?? "";
      if (city) {
        // save to global location and navigate to search with coords
        setLocation({ city, city_lc: normalizeCity(city), lat, lng });
        setSearchCity(city);
        navigate(
          `/search?city=${encodeURIComponent(city)}&lat=${lat}&lng=${lng}`
        );
      } else {
        // no city found — fallback to coordinates only
        setLocation({ city: "", city_lc: "", lat, lng });
        navigate(`/search?lat=${lat}&lng=${lng}`);
      }
    } catch (e: any) {
      console.error("Location error:", e);
      alert(
        "Could not fetch your location. Please allow location access or enter your city manually."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Local Services Near You
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect with trusted professionals in your city
          </p>

          {/* Search only visible when logged in */}
          {user ? (
            <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center px-4 gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your city (e.g., Hyderabad)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="flex-1 outline-none text-gray-800"
                />
              </div>

              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleSearchClick}
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
              >
                Use my location
              </button>
            </div>
          ) : (
            <div className="mt-10" />
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              title={cat.name}
              subtitle={""}
              categoryKey={cat.name}
              isClickable={canBrowse}
              onClick={() => handleCategoryClick(cat.name)}
              className={`${cat.color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

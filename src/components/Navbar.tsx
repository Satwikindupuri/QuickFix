// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  LogIn,
  UserPlus,
  MapPin,
  Crosshair,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocationContext, normalizeCity } from "../contexts/LocationContext";
import { getCurrentPositionPromise, reverseGeocode, geocodeCity } from "../lib/geo";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { location, setLocation, clearLocation } = useLocationContext();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(location.city || "");
  const [detecting, setDetecting] = useState(false);
  const [isProvider, setIsProvider] = useState(false); // NEW
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load provider status
  useEffect(() => {
    if (!user) return;

    async function checkProvider() {
      const qRef = query(
        collection(db, "providers"),
        where("uid", "==", user!.uid)
      );
      const snap = await getDocs(qRef);
      setIsProvider(!snap.empty); // TRUE if the user already registered as provider
    }

    checkProvider();
  }, [user]);

  useEffect(() => {
    setInputValue(location.city || "");
  }, [location.city]);

  const goHome = () => navigate("/");
  const openLogin = () => navigate("/login");

  const saveManualLocation = async () => {
    const city = inputValue.trim();
    if (!city) {
      setEditing(false);
      return;
    }
    let lat: number | null = null;
    let lng: number | null = null;

    try {
      const geo = await geocodeCity(city);
      if (geo) {
        lat = geo.lat;
        lng = geo.lon;
      }
    } catch (e) {}

    setLocation({ city, city_lc: normalizeCity(city), lat, lng });
    setEditing(false);
  };

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const pos = await getCurrentPositionPromise({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const place = await reverseGeocode(lat, lng);

      const city = place?.city || place?.display_name || "";
      if (city) {
        setLocation({ city, city_lc: normalizeCity(city), lat, lng });
        setInputValue(city);
        setEditing(false);
      } else {
        setLocation({ city: "", city_lc: "", lat, lng });
        setEditing(false);
      }
    } catch (e) {
      alert("Could not detect location. Allow permissions or enter city manually.");
    } finally {
      setDetecting(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  const handleBecomeProvider = () => {
    navigate("/register/provider");
  };

  const goMyProviders = () => navigate("/my-providers");

  // Guest Navbar
  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={goHome}
              className="flex items-center gap-2 text-2xl font-semibold text-blue-600 hover:text-blue-700"
            >
              <Home className="w-6 h-6" /> QuickFix
            </button>

            <button
              onClick={openLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Logged-In Navbar
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* BRAND */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-2xl font-semibold text-blue-600 hover:text-blue-700"
          >
            <Home className="w-6 h-6" /> QuickFix
          </button>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* LOCATION MODULE */}
            <div className="relative flex items-center gap-3">
              {!editing ? (
                <button
                  onClick={() => {
                    setEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:shadow"
                >
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {location.city || "Enter location"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveManualLocation();
                      if (e.key === "Escape") {
                        setEditing(false);
                        setInputValue(location.city || "");
                      }
                    }}
                    className="outline-none text-sm w-40"
                    placeholder="Enter city"
                  />
                  <button
                    onClick={saveManualLocation}
                    className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* DETECT LOCATION BUTTON */}
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="w-9 h-9 flex items-center justify-center bg-white border rounded-full shadow hover:bg-gray-50"
                title="Detect location"
              >
                <Crosshair className="w-4 h-4" />
              </button>

              {/* CLEAR LOCATION */}
              {location.city && (
                <button
                  onClick={() => {
                    clearLocation();
                    setInputValue("");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* DIVIDER */}
            <div className="hidden md:block h-6 w-px bg-gray-300" />

            {/* PROVIDER STATUS */}
            {isProvider ? (
              <div className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-semibold shadow-sm">
                <CheckCircle className="w-4 h-4" />
                Verified Provider
              </div>
            ) : (
              <button
                onClick={handleBecomeProvider}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Become Provider
              </button>
            )}

            {/* MY SERVICES */}
            {isProvider && (
              <button
                onClick={goMyProviders}
                className="px-3 py-2 bg-green-50 text-green-800 rounded-md hover:bg-green-100 text-sm"
              >
                My Services
              </button>
            )}

            {/* SIGN OUT */}
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

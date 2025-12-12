// src/contexts/LocationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export type LocationData = {
  city: string;
  city_lc: string;
  lat: number | null;
  lng: number | null;
};

const DEFAULT: LocationData = { city: "", city_lc: "", lat: null, lng: null };

type Ctx = {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  clearLocation: () => void;
};

const LocationContext = createContext<Ctx>({
  location: DEFAULT,
  setLocation: () => {},
  clearLocation: () => {},
});

function normalizeCity(s?: string) {
  if (!s) return "";
  return s
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse whitespace
    .trim()
    .toLowerCase();
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user_location");
      if (raw) {
        const parsed = JSON.parse(raw);
        // ensure normalized city_lc exists for older entries
        const city = parsed.city ?? "";
        const normalized = {
          city: city,
          city_lc: parsed.city_lc ? String(parsed.city_lc).trim().toLowerCase() : normalizeCity(city),
          lat: parsed.lat ?? null,
          lng: parsed.lng ?? null,
        };
        setLocationState(normalized);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLocation = (loc: LocationData) => {
    const cityRaw = loc.city ?? "";
    const normalized: LocationData = {
      city: cityRaw,
      city_lc: loc.city_lc ? String(loc.city_lc).trim().toLowerCase() : normalizeCity(cityRaw),
      lat: loc.lat ?? null,
      lng: loc.lng ?? null,
    };
    localStorage.setItem("user_location", JSON.stringify(normalized));
    setLocationState(normalized);
  };

  const clearLocation = () => {
    localStorage.removeItem("user_location");
    setLocationState(DEFAULT);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
export { normalizeCity };

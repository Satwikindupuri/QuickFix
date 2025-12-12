// src/pages/SearchResults.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { MapPin, Phone, Award, IndianRupee } from "lucide-react";
// import { haversineDistanceKm } from "../lib/geo";
import { useAuth } from "../contexts/AuthContext";
import { useLocationContext, normalizeCity } from "../contexts/LocationContext";
import { filterSelfProviders } from "../utils/filterSelf";
import { User } from "firebase/auth";

interface Provider {
  id: string;
  firm_name?: string;
  name?: string;
  city?: string;
  city_lc?: string;
  description?: string;
  experience_years?: number;
  price?: string | number;
  phone?: string;
  category?: string;
  created_at?: any;
  lat?: number | null;
  lng?: number | null;
  distanceKm?: number | null;
  [key: string]: any;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useLocationContext();

  const urlCity = (searchParams.get("city") || "").trim();
  const effectiveCity = urlCity || location.city || "";
  const cityLc = effectiveCity ? normalizeCity(effectiveCity) : "";
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const userLat = latParam ? Number(latParam) : null;
  const userLng = lngParam ? Number(lngParam) : null;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setFatalError(null);
      setProviders([]);

      if (!effectiveCity) {
        setLoading(false);
        return;
      }

      try {
        const colRef = collection(db, "providers");

        // try normalized city first
        const q1 = query(colRef, where("city_lc", "==", cityLc), orderBy("created_at", "desc"));
        const snap1 = await getDocs(q1);

        let results: Provider[] = snap1.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

        // fallback to exact city if normalized returned nothing
        if (results.length === 0 && effectiveCity) {
          const q2 = query(colRef, where("city", "==", effectiveCity), orderBy("created_at", "desc"));
          const snap2 = await getDocs(q2);
          results = snap2.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        }

        // distance logic (if lat/lng provided) — optional; keep as-is if you want
        // (haversineDistanceKm import was commented out earlier; re-add if needed)

        // finally filter out self services
        const final = filterSelfProviders(results, user);
        if (mounted) setProviders(final);
      } catch (err: any) {
        const msg = String(err?.message ?? err).toLowerCase();
        console.warn("Search query error:", err);

        if (msg.includes("requires an index")) {
          if (mounted) {
            setFatalError(
              "This search needs a Firestore index. Open console → click the generated link → create index."
            );
          }
        } else {
          if (mounted) {
            setFatalError("Failed to search providers. Check console.");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [effectiveCity, cityLc, userLat, userLng]);

  if (fatalError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-xl text-center">
          <h2 className="text-lg font-semibold mb-4">Search error</h2>
          <p className="text-sm text-gray-600 mb-4">{fatalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Searching providers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Results for "{effectiveCity}"
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No service providers found in {effectiveCity}.
            </p>
            <button
              onClick={() => navigate("/register/provider")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Become the first provider in {effectiveCity}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => navigate(`/provider/${provider.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer p-6 border border-gray-100 hover:border-blue-200"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {provider.firm_name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {provider.city}
                  </p>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {provider.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>
                      {provider.experience_years ?? 0} years experience
                    </span>
                  </div>

                  {provider.price && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      <span>{provider.price}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${provider.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

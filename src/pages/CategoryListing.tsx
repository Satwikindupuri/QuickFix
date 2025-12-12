// src/pages/CategoryListing.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  QueryConstraint,
} from "firebase/firestore";
import { Phone, Award, MapPin, IndianRupee } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { filterSelfProviders } from "../utils/filterSelf";
import { useLocationContext, normalizeCity } from "../contexts/LocationContext";

interface Provider {
  id: string;
  firm_name?: string;
  city?: string;
  description?: string;
  experience_years?: number;
  price?: string | number;
  phone?: string;
  created_at?: any;
  category?: string;
  [key: string]: any;
}

export default function CategoryListing() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { location } = useLocationContext();
  const urlCity = (searchParams.get("city") || "").trim();
  const effectiveCity = urlCity || location.city || "";
  const effectiveCityLc = effectiveCity ? normalizeCity(effectiveCity) : "";

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, effectiveCityLc]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "providers");
      const constraints: QueryConstraint[] = [];

      if (category) {
        constraints.push(where("category", "==", category));
      }

      if (effectiveCityLc && effectiveCityLc !== "all") {
        constraints.push(where("city_lc", "==", effectiveCityLc));
      }

      // only add orderBy when required (if created_at exists on documents)
      constraints.push(orderBy("created_at", "desc"));

      const q = query(colRef, ...constraints);
      const snap = await getDocs(q);

      let data: Provider[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      // fallback: if nobody found via city_lc and effectiveCity exists, try exact city match
      if ((data.length === 0 || data.every((p) => !p.city_lc)) && effectiveCity) {
        const q2 = query(colRef, where("city", "==", effectiveCity), orderBy("created_at", "desc"));
        const snap2 = await getDocs(q2);
        data = snap2.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      }

      // Remove self services
      data = filterSelfProviders(data, user);

      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{category}</h1>
          {effectiveCity && effectiveCity !== "all" && (
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {effectiveCity}
            </p>
          )}
          <p className="text-gray-600 mt-2">
            Found {providers.length} service provider
            {providers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No service providers found in this category
              {effectiveCity && effectiveCity !== "all" ? ` for ${effectiveCity}` : ""}.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Browse other categories
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
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {provider.firm_name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {provider.city}
                    </p>
                  </div>
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

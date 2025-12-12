// src/pages/ProviderDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Phone,
  Award,
  MapPin,
  IndianRupee,
  Briefcase,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Provider {
  id: string;
  firm_name?: string;
  name?: string;
  city?: string;
  description?: string;
  experience_years?: number;
  price?: string | number;
  phone?: string;
  category?: string;
  created_at?: any;
  uid?: string;
}

export default function ProviderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "providers", id as string);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        setProvider(null);
        return;
      }

      const data = snap.data() as any;

      // If provider tries to see THEIR OWN listing → redirect
      if (user && data.uid === user.uid) {
        navigate("/my-providers");
        return;
      }

      setProvider({ id: snap.id, ...data });
    } catch (error) {
      console.error("Error fetching provider:", error);
      setProvider(null);
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Provider not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{provider.firm_name}</h1>
            <p className="text-blue-100 flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5" /> {provider.category}
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-semibold">{provider.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{provider.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold">
                      {provider.experience_years ?? 0} years
                    </p>
                  </div>
                </div>

                {provider.price && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-semibold">{provider.price}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                <a
                  href={`tel:${provider.phone}`}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-6 h-6" />
                  Call {provider.phone}
                </a>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {provider.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

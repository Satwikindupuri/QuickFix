// src/pages/ProviderRegistration.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { geocodeCity } from "../lib/geo";
import { Briefcase } from "lucide-react";

const categories = [
  "Electrician",
  "Plumber",
  "Appliances",
  "Decoration",
  "Packer & Movers",
  "Beauty",
  "Food",
  "Education",
  "Mechanical",
  "Events",
  "PG/Hostel",
  "Loans",
];

export default function ProviderRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId") || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    firmName: "",
    category: "",
    city: "",
    phone: "",
    description: "",
    experienceYears: "",
    price: "",
  });

  useEffect(() => {
    if (!editId) return;
    // load provider doc for editing
    (async () => {
      try {
        setLoading(true);
        const ref = doc(db, "providers", editId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Provider not found");
          setIsEditMode(false);
          return;
        }
        const data = snap.data() as any;
        setFormData({
          name: data.name ?? "",
          firmName: data.firm_name ?? "",
          category: data.category ?? "",
          city: data.city ?? "",
          phone: data.phone ?? "",
          description: data.description ?? "",
          experienceYears: String(data.experience_years ?? ""),
          price: data.price ?? "",
        });
        setIsEditMode(true);
      } catch (e) {
        console.error("Failed to load provider for edit", e);
        setError("Failed to load provider for edit");
      } finally {
        setLoading(false);
      }
    })();
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // try to geocode the city to lat/lng (best-effort)
      let lat: number | null = null;
      let lng: number | null = null;
      if (formData.city) {
        try {
          const geo = await geocodeCity(formData.city);
          if (geo) {
            lat = geo.lat;
            lng = geo.lon;
          }
        } catch (ge) {
          console.warn("geocodeCity failed", ge);
        }
      }

      const payload: any = {
        uid: user.uid,
        name: formData.name,
        firm_name: formData.firmName,
        category: formData.category,
        category_lc: (formData.category || "").toLowerCase(),
        city: formData.city,
        city_lc: (formData.city || "").toLowerCase(),
        phone: formData.phone,
        description: formData.description,
        experience_years: parseInt(formData.experienceYears) || 0,
        price: formData.price,
      };

      if (lat != null && lng != null) {
        payload.lat = lat;
        payload.lng = lng;
      }

      if (isEditMode && editId) {
        // update existing provider
        const ref = doc(db, "providers", editId);
        await updateDoc(ref, { ...payload, updated_at: serverTimestamp() });
      } else {
        // create new provider doc
        const providersCol = collection(db, "providers");
        await addDoc(providersCol, { ...payload, created_at: serverTimestamp() });
      }

      navigate("/my-providers");
    } catch (err: any) {
      console.error("Save provider failed", err);
      setError(err?.message ?? "Failed to save provider");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to register as a service provider</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditMode ? "Edit Service" : "Register as Service Provider"}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
              <input name="firmName" value={formData.firmName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Vijayawada" required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
              <input name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} min="0" required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <input name="price" value={formData.price} onChange={handleChange} placeholder="e.g., ₹500 - ₹2000" required className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                {loading ? "Please wait..." : isEditMode ? "Update Service" : "Create Service"}
              </button>

              <button type="button" onClick={() => navigate("/my-providers")} className="px-4 py-3 rounded-lg border">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// src/pages/MyProviders.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Trash2, Edit, Plus } from "lucide-react";

interface Provider {
  id: string;
  firm_name?: string;
  category?: string;
  city?: string;
  price?: string | number;
  phone?: string;
  created_at?: any;
  [key: string]: any;
}

export default function MyProviders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
  if (loading) return;
  if (!user) {
    navigate("/login");
    return;
  }

  const colRef = collection(db, "providers");

  // IMPORTANT: match on user.uid (Firebase Auth field)
  const q = query(colRef, where("uid", "==", user.uid));

  const unsub = onSnapshot(
    q,
    (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setProviders(arr);
    },
    (err) => {
      console.error("MyProviders error:", err);
      setProviders([]);
    }
  );

  return () => unsub();
}, [user, loading, navigate]);


  const handleEdit = (id: string) => {
    navigate(`/register/provider?editId=${encodeURIComponent(id)}`);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this service? This action cannot be undone.");
    if (!ok) return;
    try {
      setBusyId(id);
      await deleteDoc(doc(db, "providers", id));
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete. Check console.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Your Services</h1>
          <button
            onClick={() => navigate("/register/provider")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't listed any services yet.</p>
            <button
              onClick={() => navigate("/register/provider")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              List your first service
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {providers.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{p.firm_name ?? p.name ?? "Untitled"}</h3>
                    <p className="text-sm text-gray-500">{p.category} • {p.city}</p>
                    {p.price && <p className="text-sm text-gray-700 mt-2">Price: {p.price}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(p.id)}
                      title="Edit"
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete"
                      disabled={busyId === p.id}
                      className="p-2 rounded-md hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 line-clamp-3">{p.description}</p>

                <div className="mt-4 flex items-center gap-3">
                  {/* <a
                    href={`tel:${p.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    Call
                  </a> */}
                  <span className="text-xs text-gray-400">Created: {p.created_at?.toDate ? p.created_at.toDate().toLocaleString() : "-"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add button */}
      <button
        onClick={() => navigate("/register/provider")}
        aria-label="Add service"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 transition"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

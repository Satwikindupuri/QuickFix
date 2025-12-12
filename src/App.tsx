// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import ProviderRegistration from "./pages/ProviderRegistration";
import CategoryListing from "./pages/CategoryListing";
import ProviderDetail from "./pages/ProviderDetail";
import SearchResults from "./pages/SearchResults";
import MyProviders from "./pages/MyProviders";

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/role" element={<RoleSelection />} />
              <Route path="/register/provider" element={<ProviderRegistration />} />
              <Route path="/category/:category" element={<CategoryListing />} />
              <Route path="/provider/:id" element={<ProviderDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/my-providers" element={<MyProviders />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;

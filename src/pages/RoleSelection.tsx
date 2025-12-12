import { useNavigate } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-800">
          Choose Your Role
        </h1>
        <p className="text-center text-gray-600 mb-12">
          How would you like to use QuickFix?
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-6 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                Find Services
              </h2>
              <p className="text-gray-600">
                Browse and connect with local service providers in your city
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/register/provider')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-6 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <Briefcase className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                Become a Provider
              </h2>
              <p className="text-gray-600">
                Register your services and reach customers in your area
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

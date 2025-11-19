import React from 'react';
import { Camera, User, Home, LogOut } from 'lucide-react';

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome, {currentUser}!</p>
            </div>
            <button onClick={onLogout} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <User className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-blue-100">Authenticated via biometric</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <Camera className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Face Recognition</h3>
              <p className="text-green-100">Active & Secure</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <Home className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              <p className="text-purple-100">Successfully logged in</p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">User:</span> {currentUser}</p>
              <p><span className="font-medium">Authentication:</span> Biometric (Face Recognition)</p>
              <p><span className="font-medium">Session:</span> Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
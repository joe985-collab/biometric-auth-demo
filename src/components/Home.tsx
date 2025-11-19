import React from 'react';
import { Camera, UserPlus, LogIn } from 'lucide-react';

interface HomeProps {
  onRegister: () => void;
  onLogin: () => void;
}

export const Home: React.FC<HomeProps> = ({ onRegister, onLogin }) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Camera className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Biometric Auth</h1>
        <p className="text-gray-600 mt-2">Face Recognition System</p>
      </div>

      <div className="space-y-4">
        <button onClick={onRegister} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5" />
          Register New Face
        </button>
        
        <button onClick={onLogin} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5" />
          Login with Face
        </button>
      </div>
    </div>
  );
};
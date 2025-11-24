import React, { useState } from 'react';
import { X, User, Lock } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { Message } from './Message';
import { Message as MessageType } from '../types';

interface LoginProps {
  capturedImage: string | null;
  message: MessageType;
  isCapturing: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onRetake: () => void;
  onLogin: () => void;
  onPasswordLogin: (username: string, password: string) => void;
  onBack: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Login: React.FC<LoginProps> = ({
  capturedImage,
  message,
  isCapturing,
  onStartCamera,
  onStopCamera,
  onCapture,
  onRetake,
  onLogin,
  onPasswordLogin,
  onBack,
  videoRef,
  canvasRef,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordLogin = () => {
    onPasswordLogin(username, password);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <button onClick={() => {
          if (videoRef.current?.srcObject) {
            onStopCamera();
          }
          console.log("login stop...")
          onBack();
        }} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <CameraCapture {...{ capturedImage, isCapturing, onStartCamera, onCapture, onRetake, videoRef, canvasRef }} />

      <Message text={message.text} type={message.type} />

      {capturedImage && (
        <button onClick={onLogin} className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition shadow-md">
          Login with Face
        </button>
      )}

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or login with credentials</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          onClick={handlePasswordLogin}
          className="w-full py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition shadow-md"
        >
          Login with Password
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { X } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { Message } from './Message';
import { Message as MessageType } from '../types';

interface RegisterProps {
  username: string;
  password: string;
  capturedImage: string | null;
  message: MessageType;
  isCapturing: boolean;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onRetake: () => void;
  onRegister: () => void;
  onBack: () => void;
  streamRef: React.RefObject<MediaStream | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentStep: number;
  totalSteps: number;
  instructions: string[];
  capturedSelfies: string[];
}

export const Register: React.FC<RegisterProps> = ({
  username,
  password,
  capturedImage,
  message,
  isCapturing,
  onUsernameChange,
  onPasswordChange,
  onStartCamera,
  onStopCamera,
  onCapture,
  onRetake,
  onRegister,
  onBack,
  streamRef,
  videoRef,
  canvasRef,
  currentStep,
  totalSteps,
  instructions,
  capturedSelfies,
}) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Register</h2>
        <button onClick={() => {
          if (videoRef.current?.srcObject) {
            onStopCamera();
          }
          onBack();
        }} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={onUsernameChange}
          placeholder="Enter username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="Enter password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        {!capturedImage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-500 font-bold text-lg">{currentStep + 1}/{totalSteps}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  {instructions[currentStep]}
                </p>
              </div>
            </div>
          </div>
        )}

        <CameraCapture
          capturedImage={capturedImage ? capturedSelfies[4] : null}
          isCapturing={isCapturing}
          onStartCamera={onStartCamera}
          onCapture={onCapture}
          onRetake={onRetake}
          videoRef={videoRef}
          canvasRef={canvasRef}
          captureButtonText={`Capture Photo (${currentStep + 1}/${totalSteps})`}
        />

        {capturedSelfies.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Captured Photos:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {capturedSelfies.map((src, index) => (
                <div key={index} className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                  <img src={src} alt={`Step ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1 rounded-tl">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Message text={message.text} type={message.type} />

      {capturedImage && (
        <button onClick={onRegister} className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition">
          Register Face
        </button>
      )}
    </div>
  );
};
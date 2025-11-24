import React from 'react';
import { X, Camera } from 'lucide-react';
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

  // If we are capturing or have captured an image, show the camera/capture view
  if (isCapturing || capturedImage || capturedSelfies.length > 0) {
    return (
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Face Registration</h2>
          <button onClick={() => {
            onStopCamera();
            // We don't call onBack here because we want to go back to the form, not home
            // But the parent handles state, so we might need a way to just stop capturing
            // For now, let's assume stopping camera returns to form view conceptually if we were managing local state,
            // but here state is lifted. 
            // Actually, the requirement is "Start Camera leads to new page". 
            // Since we are conditionally rendering based on isCapturing/capturedImage, this acts as a new page.
            // To "go back" to the form, we just stop camera and clear selfies? 
            // Or just stop camera.
          }} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {!capturedImage && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm border border-indigo-200">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-indigo-900 font-medium">
                  {instructions[currentStep]}
                </p>
                <p className="text-indigo-600 text-xs mt-1">Follow the instruction to ensure high quality.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col justify-center">
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
        </div>

        {capturedSelfies.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Progress</p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {capturedSelfies.map((src, index) => (
                <div key={index} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-200">
                  <img src={src} alt={`Step ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="mt-6">
            <button onClick={onRegister} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 transform hover:-translate-y-0.5 transition-all duration-200">
              Complete Registration
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="Choose a username"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Choose a password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="pt-4">
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Face Registration</h3>
            <p className="text-indigo-600 text-sm mb-6">We need to capture 5 photos of your face to secure your account.</p>

            <button
              onClick={onStartCamera}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Start Camera
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Message text={message.text} type={message.type} />
      </div>
    </div>
  );
};
import React from 'react';
import { X } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { Message } from './Message';
import { Message as MessageType } from '../types';

interface RegisterProps {
  username: string;
  capturedImage: string | null;
  message: MessageType;
  isCapturing: boolean;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onRetake: () => void;
  onRegister: () => void;
  onBack: () => void;
  streamRef: React.RefObject<MediaStream | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Register: React.FC<RegisterProps> = ({
  username,
  capturedImage,
  message,
  isCapturing,
  onUsernameChange,
  onStartCamera,
  onStopCamera,
  onCapture,
  onRetake,
  onRegister,
  onBack,
  streamRef,
  videoRef,
  canvasRef,
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

      <CameraCapture {...{ capturedImage, isCapturing, onStartCamera, onCapture, onRetake, videoRef, canvasRef }} />
      <Message text={message.text} type={message.type} />

      {capturedImage && (
        <button onClick={onRegister} className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition">
          Register Face
        </button>
      )}
    </div>
  );
};
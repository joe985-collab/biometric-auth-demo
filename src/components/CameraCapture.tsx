import React from 'react';

interface CameraCaptureProps {
  capturedImage: string | null;
  isCapturing: boolean;
  onStartCamera: () => void;
  onCapture: () => void;
  onRetake: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  capturedImage,
  isCapturing,
  onStartCamera,
  onCapture,
  onRetake,
  videoRef,
  canvasRef,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Capture Face</label>
      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="space-y-3 mt-4">
        {!capturedImage && !isCapturing && (
          <button onClick={onStartCamera} className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition">
            Start Camera
          </button>
        )}
        {isCapturing && !capturedImage && (
          <button onClick={onCapture} className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition">
            Capture Photo
          </button>
        )}
        {capturedImage && (
          <button onClick={onRetake} className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition">
            Retake Photo
          </button>
        )}
      </div>
    </div>
  );
};
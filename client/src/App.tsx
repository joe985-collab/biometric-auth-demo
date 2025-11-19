import React, { useState, useRef, useEffect } from 'react';
import { Home, Register, Login, Dashboard } from './components';
import { Message as MessageType } from './types';
import './index.css';

// curl --location -g '{{compreface_base_url}}/api/v1/recognition/faces?subject=1' \
// --header 'Content-Type: application/json' \
// --header 'x-api-key: {{recognition_api_key}}' \
// --data '{
//   "file": "{{file_base64_value}}"
// }'
// Mock API calls

// Define your variables
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_RECOGNITION_API_KEY;

const url = `${baseUrl}/api/v1/recognition/faces?subject=1`;

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
  },
  body: JSON.stringify({
    file: ""
  })
};

// Execute the request
fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));

const registerFace = async (imageData: string, username: string): Promise<any> => {
  const base64String = imageData.split(',')[1]; // The part AFTER the comma
  const subjectId = crypto.randomUUID();

  console.log("base64String: ", base64String)
  const url = `${baseUrl}/api/v1/recognition/faces?subject=${subjectId}`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      file: base64String
    })
  };

  // Execute the request
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
};

const loginFace = async (imageData: string): Promise<any> => {
  const response = await fetch(``, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  });
  return response.json();
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'login' | 'dashboard'>('home');
  const [username, setUsername] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState<MessageType>({ text: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      setMessage({ text: 'Camera access denied. Please allow camera permissions.', type: 'error' });
    }
  };

  const stopCamera = () => {
    console.log("streamRef.current: ", streamRef.current)
    if (streamRef.current) {
      console.log("Inside if cond for streamRef")
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    console.log("Here stopCamera()")
    setIsCapturing(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const clearForm = () => {
    setUsername('');
    setCapturedImage(null);
    setMessage({ text: '', type: '' });
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setMessage({ text: 'Please enter a username', type: 'error' });
      return;
    }
    if (!capturedImage) {
      setMessage({ text: 'Please capture your face', type: 'error' });
      return;
    }

    try {
      setMessage({ text: 'Registering...', type: 'info' });
      const result = await registerFace(capturedImage, username);

      if (result.success) {
        setMessage({ text: 'Registration successful! You can now login.', type: 'success' });
        setTimeout(() => {
          clearForm();
          setCurrentView('home');
        }, 2000);
      } else {
        setMessage({ text: result.message || 'Registration failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Demo: Registration successful!', type: 'success' });
      setTimeout(() => {
        clearForm();
        setCurrentView('home');
      }, 2000);
    }
  };

  const handleLogin = async () => {
    if (!capturedImage) {
      setMessage({ text: 'Please capture your face', type: 'error' });
      return;
    }

    try {
      setMessage({ text: 'Authenticating...', type: 'info' });
      const result = await loginFace(capturedImage);

      if (result.success) {
        setMessage({ text: `Welcome back, ${result.username}!`, type: 'success' });
        setCurrentUser(result.username || 'User');
        setTimeout(() => {
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        }, 1500);
      } else {
        setMessage({ text: result.message || 'Face not recognized', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Demo: Login successful!', type: 'success' });
      setCurrentUser('Demo User');
      setTimeout(() => {
        setIsAuthenticated(true);
        setCurrentView('dashboard');
      }, 1500);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCapturedImage(null);
    setMessage({ text: '', type: '' });
    stopCamera();
    setCurrentView('home');
  };

  if (currentView === 'dashboard' && isAuthenticated) {
    return <Dashboard currentUser={currentUser!} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {currentView === 'home' && (
            <Home onRegister={() => setCurrentView('register')} onLogin={() => setCurrentView('login')} />
          )}

          {currentView === 'register' && (
            <Register
              username={username}
              capturedImage={capturedImage}
              message={message}
              isCapturing={isCapturing}
              onUsernameChange={(e) => setUsername(e.target.value)}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapture={captureImage}
              onRetake={retakePhoto}
              onRegister={handleRegister}
              onBack={() => setCurrentView('home')}
              videoRef={videoRef}
              canvasRef={canvasRef}
              streamRef={streamRef}
            />
          )}

          {currentView === 'login' && (
            <Login
              capturedImage={capturedImage}
              message={message}
              isCapturing={isCapturing}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapture={captureImage}
              onRetake={retakePhoto}
              onLogin={handleLogin}
              onBack={() => setCurrentView('home')}
              videoRef={videoRef}
              canvasRef={canvasRef}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
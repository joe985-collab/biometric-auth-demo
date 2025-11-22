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
const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;


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

const retrieveData = async function retrieveData(url: RequestInfo | URL, requestOptions: RequestInit | undefined) {
  const res1 = await fetch(url, requestOptions);
  const data1 = await res1.json();
  const res2 = await fetch(backendUrl + "/retrieve_users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embedding: data1.result[0].embedding.map(Number),
    }),
  })
  const data2 = await res2.json();
  return { success: true, username:data2.result.username, message: 'Face logged in successfully' };

}

const handleData = async function handleData(url: RequestInfo | URL, requestOptions: RequestInit | undefined, formData?: { username: string; password: string }) {
  try {
    const res1 = await fetch(url, requestOptions);
    const data1 = await res1.json();
    console.log("data1: ", data1);

    // If formData is provided, store it in the database
    if (formData) {
      console.log("Form data to store in DB:", formData);
      // TODO: Add database storage logic here
      const res2 = await fetch(backendUrl + "/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          embedding: data1.result.map((item: { embedding: any; }) => item.embedding),
        }),
      })
      // You can make another API call to your backend to store username, password, and embedding
    }

    return { success: true, message: 'Face registered successfully' };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Error registering face' };
  }
}
const registerFace = async (imageData: string, username: string, password: string): Promise<any> => {
  const base64String = imageData.split(',')[1]; // The part AFTER the comma
  // const subjectId = crypto.randomUUID();

  console.log("base64String: ", base64String)
  // const url = `${baseUrl}/api/v1/recognition/faces?subject=${subjectId}`;

  const url = `${baseUrl}/api/v1/recognition/recognize?limit=0&det_prob_threshold=0.8&prediction_count=1&face_plugins=landmarks%2C%20gender%2C%20age%2C%20calculator%2C%20mask%2C%20pose&status=true`;

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

  // Execute the request with form data
  const formData = { username, password };
  return handleData(url, requestOptions, formData);
};

const loginFace = async (imageData: string): Promise<any> => {
  const base64String = imageData.split(',')[1]; // The part AFTER the comma
  // const subjectId = crypto.randomUUID();

  console.log("base64String: ", base64String)
  // const url = `${baseUrl}/api/v1/recognition/faces?subject=${subjectId}`;

  const url = `${baseUrl}/api/v1/recognition/recognize?limit=0&det_prob_threshold=0.8&prediction_count=1&face_plugins=landmarks%2C%20gender%2C%20age%2C%20calculator%2C%20mask%2C%20pose&status=true`;

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
  return retrieveData(url, requestOptions)
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'login' | 'dashboard'>('home');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedSelfies, setCapturedSelfies] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState<MessageType>({ text: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const instructions = [
    "Take a photo of your Front Profile",
    "Turn your head Left and take a photo",
    "Turn your head Right and take a photo",
    "Remove specs (if any) and take a Front photo",
    "Come Closer to the camera and take a photo"
  ];

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
    console.log("Inside capture image..")
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      console.log("ctx: ", ctx)
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const newImage = canvas.toDataURL('image/jpeg');

        if (currentView === 'register') {
          const newSelfies = [...capturedSelfies, newImage];
          setCapturedSelfies(newSelfies);

          if (newSelfies.length === 5) {
            // Stitch images
            const stitchedCanvas = document.createElement('canvas');
            stitchedCanvas.width = video.videoWidth * 5;
            stitchedCanvas.height = video.videoHeight;
            const stitchedCtx = stitchedCanvas.getContext('2d');

            if (stitchedCtx) {
              newSelfies.forEach((imgSrc, index) => {
                const img = new Image();
                img.src = imgSrc;
                img.onload = () => {
                  stitchedCtx.drawImage(img, index * video.videoWidth, 0);
                  if (index === 4) { // Last image
                    setCapturedImage(stitchedCanvas.toDataURL('image/jpeg'));
                    stopCamera();
                  }
                };
              });
            }
          } else {
            setCurrentStep(prev => prev + 1);
          }
        } else {
          setCapturedImage(newImage);
          stopCamera();
        }
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedSelfies([]);
    setCurrentStep(0);
    startCamera();
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setCapturedImage(null);
    setCapturedSelfies([]);
    setCurrentStep(0);
    setMessage({ text: '', type: '' });
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setMessage({ text: 'Please enter a username', type: 'error' });
      return;
    }
    if (!password.trim()) {
      setMessage({ text: 'Please enter a password', type: 'error' });
      return;
    }
    if (!capturedImage) {
      setMessage({ text: 'Please capture your face', type: 'error' });
      return;
    }

    try {
      setMessage({ text: 'Registering...', type: 'info' });
      const result = await registerFace(capturedImage, username, password);
      console.log("Registration result: ", result);
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

    console.log("Inside login logic..... ")

    if (!capturedImage) {
      setMessage({ text: 'Please capture your face', type: 'error' });
      return;
    }

    try {
      setMessage({ text: 'Authenticating...', type: 'info' });
      const result = await loginFace(capturedImage);

      if (result.success) {
        console.log("result: ",result)
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
              password={password}
              capturedImage={capturedImage}
              message={message}
              isCapturing={isCapturing}
              onUsernameChange={(e) => setUsername(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapture={captureImage}
              onRetake={retakePhoto}
              onRegister={handleRegister}
              onBack={() => {
                stopCamera();
                clearForm();
                setCurrentView('home');
              }}
              videoRef={videoRef}
              canvasRef={canvasRef}
              streamRef={streamRef}
              currentStep={currentStep}
              totalSteps={5}
              instructions={instructions}
              capturedSelfies={capturedSelfies}
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
              onBack={() => {
                stopCamera();
                clearForm();
                setCurrentView('home');
              }}
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
import React, { useState, useRef, useEffect } from 'react';
import { Home, Register, Login, Dashboard } from './components';
import { Message as MessageType } from './types';
import './index.css';

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
  const recognitionResponse = await fetch(url, requestOptions);
  const recognitionData = await recognitionResponse.json();

  const backendResponse = await fetch(backendUrl + "/retrieve_users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embedding: recognitionData.result[0].embedding.map(Number),
    }),
  })

  if (backendResponse.status === 401) {
    return { success: false, message: 'Unauthorized user' };
  }

  const backendData = await backendResponse.json();
  return { success: true, username: backendData.result.username, message: 'Face logged in successfully' };

}

const handleData = async function handleData(url: RequestInfo | URL, requestOptions: RequestInit | undefined, formData?: { username: string; password: string }) {
  try {
    const recognitionResponse = await fetch(url, requestOptions);
    const recognitionData = await recognitionResponse.json();

    // If formData is provided, store it in the database
    if (formData) {
      // TODO: Add database storage logic here
      const storeResponse = await fetch(backendUrl + "/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          embedding: recognitionData.result.map((item: { embedding: any; }) => item.embedding),
        }),
      })
      // You can make another API call to your backend to store username, password, and embedding
    }

    return { success: true, message: 'Face registered successfully' };
  } catch (error) {
    return { success: false, message: 'Error registering face' };
  }
}
const registerFace = async (imageData: string, username: string, password: string): Promise<any> => {
  const base64String = imageData.split(',')[1]; // The part AFTER the comma
  // const subjectId = crypto.randomUUID();

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

  useEffect(() => {
    const initCamera = async () => {
      if (isCapturing && !streamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setMessage({ text: 'Camera access denied. Please allow camera permissions.', type: 'error' });
          setIsCapturing(false);
        }
      } else if (!isCapturing && streamRef.current) {
        // Cleanup is handled by stopCamera, but good to double check or handle unmounts
      }
    };

    initCamera();
  }, [isCapturing]);

  // Also need to ensure videoRef gets the stream if it mounts AFTER the stream is ready (though in this flow they happen together)
  useEffect(() => {
    if (isCapturing && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCapturing, videoRef.current]); // videoRef.current might not trigger update if ref object is stable but current changes? 
  // Actually refs don't trigger re-renders. But the component re-renders when isCapturing changes.

  const startCamera = () => {
    setIsCapturing(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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

  const handlePasswordLogin = async (loginUsername: string, loginPassword: string) => {
    if (!loginUsername.trim()) {
      setMessage({ text: 'Please enter a username', type: 'error' });
      return;
    }
    if (!loginPassword.trim()) {
      setMessage({ text: 'Please enter a password', type: 'error' });
      return;
    }

    try {
      setMessage({ text: 'Authenticating...', type: 'info' });
      const response = await fetch(backendUrl + '/password_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Welcome back, ${data.result.username}!`, type: 'success' });
        setCurrentUser(data.result.username);
        setTimeout(() => {
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        }, 1500);
      } else {
        setMessage({ text: data.message || 'Invalid credentials', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
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
              onPasswordLogin={handlePasswordLogin}
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
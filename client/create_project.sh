# 1. Initialize npm (if not already)
npm init -y

# 2. Install all dependencies (React + Tailwind + Lucide)
npm install react react-dom lucide-react
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss postcss autoprefixer

# 3. Create folder structure
mkdir -p src

# 4. Initialize TypeScript
npx tsc --init

# 5. Replace tsconfig.json with React-friendly settings
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOF

# 6. Create vite.config.ts
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { open: true }
})
EOF

# 7. Create index.html
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Biometric Auth</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# 8. Create Tailwind config files (with CLI fallback)
npx tailwindcss@latest init -p || echo "⚠️  CLI failed, creating configs manually..."

# Manual creation if CLI fails
if [ ! -f tailwind.config.js ]; then
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOF
fi

if [ ! -f postcss.config.js ]; then
cat > postcss.config.js <<'EOF'
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
EOF
fi

# 9. Create Tailwind CSS file
cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 10. Create main.tsx with CSS import
cat > src/main.tsx <<'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# 11. Create App.tsx with Tailwind + Lucide icons
cat > src/App.tsx <<'EOF'
import React from 'react'
import { Camera, UserPlus, LogIn, Home, User, X } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Biometric Auth</h1>
              <p className="text-gray-600 mt-2">Face Recognition System</p>
            </div>

            <div className="space-y-4">
              <button className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                Register New Face
              </button>
            
              <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Login with Face
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# 12. Add dev script (modern npm)
npm pkg set scripts.dev="vite"

# 13. Done!
echo "✅ Setup complete! Starting development server..."
npm run dev

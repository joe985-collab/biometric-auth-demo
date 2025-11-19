# Biometric Auth Demo

A React-based biometric authentication demonstration using face recognition. This project showcases a modern UI with a premium dark theme and integrates camera capture for face login, alongside a traditional username/password interface.

## Features

- **Face Recognition Login**: Capture your face to log in.
- **Credential Login**: Traditional username and password fields.
- **Registration**: Register a new user with a face capture.
- **Modern UI**: Built with TailwindCSS, featuring a sleek dark theme.

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone git@github.com:joe985-collab/biometric-auth-demo.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd biometric-auth-demo
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

- `src/components`: Contains React components (Login, Register, CameraCapture, etc.).
- `src/App.tsx`: Main application component handling routing and state.
- `src/index.css`: Global styles and Tailwind directives.

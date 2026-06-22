# Lyrica - Running Instructions

This guide provides step-by-step instructions on setting up and running the Lyrica music application, which consists of a **Flask + MongoDB backend** and a **React + TypeScript + Vite frontend**.

---

## Architecture Overview
- **Backend (Flask)**: Runs on `http://localhost:5000` and handles authentication, database storage, playlists, charts, and API endpoints.
- **Frontend (Vite)**: Runs on `http://localhost:5173`. Vite proxies `/api` and `/static` requests to the Flask server to prevent CORS issues.

---

## Prerequisites
Before you start, ensure you have the following installed on your machine:
- **Python**: Version 3.8 or higher.
- **Node.js & npm**: Node.js v18 or higher recommended.
- **MongoDB**: A running local MongoDB instance or a remote MongoDB Atlas connection URI.

---

## Step-by-Step Setup

### 1. Database Setup
Make sure MongoDB is running. If running locally, MongoDB typically runs on `mongodb://localhost:27017`.

### 2. Backend (Flask) Setup

1. Open a terminal and navigate to the project root directory:
   ```bash
   cd Lyrica_Music_Lyrics_LIFE
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   Create a `.env` file in the root directory (you can copy `.env.example` as a template):
   ```bash
   # On Windows
   copy .env.example .env
   # On macOS/Linux
   cp .env.example .env
   ```
   Open the `.env` file and set the required variables:
   ```env
   SECRET_KEY=your_super_secret_key_here
   MONGO_URI=mongodb://localhost:27017/lyrica
   DB_NAME=lyrica
   ```

6. Seed the Demo User & Start the Flask backend:
   ```bash
   python app.py
   ```
   *Note: On startup, the server automatically seeds the database with a default demo user.*

---

### 3. Frontend (React & Vite) Setup

1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd "Lyrica_Music_Lyrics_LIFE/Visual Matching Implementation"
   ```

2. Install the Node modules:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Access & Login

Once both servers are running:
1. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
2. Click **Sign In** and use the seeded demo credentials:
   - **Email**: `demo@lyrica.com`
   - **Password**: `Demo1234!`

---

## Troubleshooting

| Issue | Potential Cause | Solution |
| :--- | :--- | :--- |
| **Authentication fails or users cannot register** | MongoDB is not running or incorrect URI. | Ensure your MongoDB service is running and `MONGO_URI` is correctly configured in `.env`. |
| **API requests return 404/504 errors in browser** | The Flask backend is not running. | Verify that Python server is running on `http://localhost:5000` (port check: `netstat`). |
| **Icons or styling do not render correctly** | CSS theme variables not loaded. | Ensure the dev server is active and that `theme.css` has built successfully. |

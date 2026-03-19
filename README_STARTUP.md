# PrepNova Intelligence — Operational Guide

This document explains how to run the multi-tier PrepNova application.

## 🧠 Backend (AI Forecast Engine)

The backend is a Flask application that serves the ML models and operational data.

### Standard Startup
Run the provided convenience script:
```bash
chmod +x run_app.sh
./run_app.sh
```

The engine will be available at: **http://localhost:5000**

## 🎨 Frontend (Modern UI)

The frontend is a Vite-based React application (optional, if you are using the separate frontend directory).

### Development Mode
```bash
cd frontend
npm run dev
```

The UI will be available at: **http://localhost:5173** (default Vite port)

---
*PrepNova Intelligence Systems &copy; 2026*

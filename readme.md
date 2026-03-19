# 🍽️ PrepNova — Smart Food Waste Prediction System

An AI-powered meal demand forecasting tool that helps food service operations minimize waste and optimize preparation volumes using ensemble machine learning models.

## 📁 Project Structure

```
prepnova/
├── app/                        # Flask Application
│   ├── app.py                  # Main server — routes, ML inference, APIs
│   ├── static/
│   │   ├── style.css           # Global stylesheet
│   │   └── charts.js           # Chart.js visualizations for Analytics & History
│   └── templates/
│       ├── layout.html         # Base template (navbar, footer, CDN imports)
│       ├── index.html          # Landing / Home page
│       ├── predict.html        # Prediction form (environmental parameters)
│       ├── result.html         # Forecast results & behavioral insights
│       ├── analytics.html      # Analytics dashboard with interactive charts
│       └── history.html        # Prediction data ledger & verification
│
├── data/                       # Dataset
│   ├── dataset.csv             # Training data (1000 rows)
│   └── generate_dataset.py     # Script to regenerate synthetic data
│
├── models/                     # Trained ML Artifacts
│   ├── model.pkl               # Stacking ensemble (XGBoost, LightGBM, CatBoost, etc.)
│   ├── encoders.pkl            # Label encoders for categorical features
│   ├── analytics_data.pkl      # Pre-computed analytics (day/weather means, scatter data)
│   └── diagnostics.png         # Model performance visualization
│
├── notebooks/                  # ML Development
│   ├── train_model.py          # Full training pipeline (6 models + stacking)
│   └── diagnose_model.py       # Model evaluation & diagnostic plots
│
├── frontend/                   # (Optional) Vite + React frontend
│   └── ...
│
├── requirements.txt            # Python dependencies
├── run_app.sh                  # One-command startup script
└── readme.md                   # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the Application
```bash
chmod +x run_app.sh
./run_app.sh
```
The app will be available at **http://localhost:5000**

## 🧠 How It Works

1. **Input Parameters** — Day, weather, expected footfall, festival status, and historical consumption
2. **ML Ensemble** — 6 models (Random Forest, Gradient Boosting, XGBoost, LightGBM, CatBoost, Stacking) generate predictions
3. **Smart Recommendation** — Applies safety buffers and anomaly detection
4. **Analytics** — Weekday trends, weather impact, festival variance, and model performance comparison
5. **History Dashboard** — Tracks all predictions with actual-consumed verification

## 📊 ML Models

| Model | Description |
|-------|-------------|
| Random Forest | Bagged decision trees |
| Gradient Boosting | Sequential boosting |
| XGBoost | Optimized gradient boosting |
| LightGBM | Leaf-wise gradient boosting |
| CatBoost | Category-aware boosting |
| **Stacking Ensemble** | **Meta-learner combining all 5 models** |

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | GET/POST | Prediction form & submission |
| `/result` | GET | Forecast results page |
| `/analytics` | GET | Analytics dashboard |
| `/history` | GET | Prediction history ledger |
| `/api/analytics-summary` | GET | Chart data (weekday, weather, festival, scatter, models) |
| `/api/dashboard-data` | GET | Time-series data for history chart |
| `/api/roi-summary` | GET | Waste savings calculations |
| `/update-actual` | POST | Submit actual consumed values |

## 🛠️ Tech Stack

- **Backend:** Flask, SQLite
- **ML:** scikit-learn, XGBoost, LightGBM, CatBoost
- **Frontend:** Jinja2 templates, Tailwind CSS, Chart.js, Motion One
- **Fonts:** Inter, Instrument Serif

---

*PrepNova Intelligence Systems © 2026*

---
status: FINALIZED
created: 2026-03-13T00:35:00+05:30
finalized: 2026-03-13T00:35:00+05:30
---

# SPEC.md — Smart Food Waste Prediction System

## Vision

An ML-powered Flask web application that predicts daily meal demand in food service environments. Analyzes historical consumption data with contextual factors (weather, festivals, expected customers) to reduce food waste and improve operational planning. Deployed as an interactive web app with prediction and analytics capabilities.

---

## Goals

1. **End-to-End ML Pipeline**
   Generate synthetic dataset → preprocess → engineer features → train multiple regressors (Random Forest, Gradient Boosting, XGBoost) → evaluate (MAE/RMSE) → save best model as `model.pkl`

2. **Flask Web Application**
   Four-page app: Home, Prediction (input form), Result (prediction + insights), Analytics dashboard with interactive charts

3. **Smart UX with Business Insights**
   Context-aware tips (weather/festival impacts), waste warnings, demand pattern insights. Modern UI with dark blue/white/grey palette, cards, dropdowns

---

## Non-Goals (Out of Scope)

- User authentication / accounts
- Database storage of predictions
- Real-time data pipeline / streaming
- Mobile app
- Multi-language support

---

## Users

**Primary User:** Food service managers
- Input daily operational parameters
- Receive meal demand predictions
- View analytics dashboards

**Secondary User:** Kitchen operations staff
- Quick prediction checks before meal prep

---

## Constraints

### Technical
- Python + Flask only (no React/frontend frameworks)
- Jinja2 templates with vanilla CSS/JS
- Model serialized with joblib/pickle
- Synthetic dataset (1000 rows)

### Timeline
- 7-day build target

---

## Success Criteria

- [ ] Trained model with MAE < 15% of mean consumption
- [ ] Flask app serves all 4 pages without errors
- [ ] Prediction endpoint returns results in < 2 seconds
- [ ] Analytics page renders 5+ chart types
- [ ] Smart UX tips display based on input context
- [ ] App runs with `python app.py`

---

## Decisions

| Decision | Choice | Rationale | Date |
|----------|--------|-----------|------|
| Framework | Flask + Jinja2 | Specified in readme | 2026-03-13 |
| Model format | joblib .pkl | Standard sklearn serialization | 2026-03-13 |
| Dataset | Synthetic generation | No real dataset provided | 2026-03-13 |
| Charts | Chart.js via CDN | Lightweight, no npm needed | 2026-03-13 |

"""
Smart Food Waste Prediction System — Flask Application
Routes: Home, Predict, Result, Analytics
"""

import os
import sys
import json
import numpy as np
import joblib
from flask import Flask, render_template, request, redirect, url_for, jsonify, session

# ── App Setup ─────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = 'food-waste-pred-2026'

# ── Load Model & Config ──────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT, 'models', 'model.pkl')
ENCODERS_PATH = os.path.join(ROOT, 'models', 'encoders.pkl')
ANALYTICS_PATH = os.path.join(ROOT, 'models', 'analytics_data.pkl')

model = joblib.load(MODEL_PATH)
config = joblib.load(ENCODERS_PATH)
analytics_data = joblib.load(ANALYTICS_PATH)

DAY_CLASSES = config['day_classes']
WEATHER_CLASSES = config['weather_classes']
WEATHER_IMPACT = config['weather_impact']
WEEKEND_DAYS = config['weekend_days']
FEATURES = config['features']
le_day = config['le_day']
le_weather = config['le_weather']

# ── Smart Tips Logic ──────────────────────────────────────────────────
def generate_tips(day, weather, festival, expected_customers, predicted):
    tips = []

    # Weather tips
    if weather == 'Rainy':
        tips.append({'icon': '🌧️', 'type': 'weather', 'text': 'Rainy weather usually reduces dining demand by ~25%. Consider lighter menu options.'})
    elif weather == 'Stormy':
        tips.append({'icon': '⛈️', 'type': 'weather', 'text': 'Stormy conditions significantly reduce foot traffic. Demand may drop by ~40%.'})
    elif weather == 'Sunny':
        tips.append({'icon': '☀️', 'type': 'weather', 'text': 'Sunny weather is optimal for dining. Expect higher foot traffic.'})
    elif weather == 'Cloudy':
        tips.append({'icon': '☁️', 'type': 'weather', 'text': 'Cloudy weather has a mild impact. Demand slightly lower than sunny days.'})

    # Festival tips
    if festival:
        tips.append({'icon': '🎉', 'type': 'festival', 'text': 'Festival day detected! Demand typically increases by 15-20%.'})

    # Weekend tips
    if day in WEEKEND_DAYS:
        tips.append({'icon': '📅', 'type': 'day', 'text': f'{day} is a weekend day. Dining patterns may differ from weekdays.'})
    elif day == 'Friday':
        tips.append({'icon': '🍽️', 'type': 'day', 'text': 'Fridays often see higher demand. Plan for increased turnout.'})

    # Waste warning
    if expected_customers > predicted * 1.15:
        waste = int(expected_customers - predicted)
        tips.append({'icon': '⚠️', 'type': 'warning', 'text': f'Preparing for {expected_customers} customers may cause waste of ~{waste} meals. Recommended: {predicted} meals.'})

    return tips


def get_confidence(predicted, expected_customers):
    """Return a confidence level based on the ratio."""
    ratio = predicted / max(expected_customers, 1)
    if 0.5 <= ratio <= 1.2:
        return 'High'
    elif 0.3 <= ratio <= 1.5:
        return 'Medium'
    return 'Low'


# ── Routes ────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return render_template('predict.html',
                               days=DAY_CLASSES,
                               weathers=WEATHER_CLASSES)

    # POST — process prediction
    try:
        day = request.form['day']
        weather = request.form['weather']
        festival = int(request.form.get('festival', 0))
        expected_customers = int(request.form['expected_customers'])
        prev_day = int(request.form['prev_day'])
        prev_week = int(request.form['prev_week'])
    except (KeyError, ValueError) as e:
        return render_template('predict.html',
                               days=DAY_CLASSES,
                               weathers=WEATHER_CLASSES,
                               error=f'Invalid input: {e}')

    # Feature engineering (same as training)
    day_encoded = le_day.transform([day])[0]
    weather_encoded = le_weather.transform([weather])[0]
    weekend = 1 if day in WEEKEND_DAYS else 0
    demand_lag_1 = prev_day
    weekly_demand = prev_week
    festival_boost = festival * expected_customers
    demand_stability = abs(prev_day - prev_week)
    weather_impact_score = WEATHER_IMPACT.get(weather, 0.9)

    features = np.array([[
        day_encoded, festival, weather_encoded, expected_customers,
        prev_day, prev_week,
        weekend, demand_lag_1, weekly_demand,
        festival_boost, demand_stability, weather_impact_score
    ]])

    predicted = int(model.predict(features)[0])
    predicted = max(predicted, 0)

    confidence = get_confidence(predicted, expected_customers)
    tips = generate_tips(day, weather, festival, expected_customers, predicted)

    # Waste estimate
    waste_estimate = max(0, expected_customers - predicted) if expected_customers > predicted else 0

    # Store in session for result page
    session['result'] = {
        'predicted': predicted,
        'confidence': confidence,
        'tips': tips,
        'waste_estimate': waste_estimate,
        'inputs': {
            'day': day, 'weather': weather, 'festival': 'Yes' if festival else 'No',
            'expected_customers': expected_customers,
            'prev_day': prev_day, 'prev_week': prev_week
        }
    }

    return redirect(url_for('result'))


@app.route('/result')
def result():
    data = session.get('result')
    if not data:
        return redirect(url_for('predict'))
    return render_template('result.html', **data)


@app.route('/analytics')
def analytics():
    return render_template('analytics.html',
                           best_model=analytics_data.get('best_model_name', 'N/A'),
                           model_results=analytics_data.get('model_results', {}),
                           total_rows=analytics_data.get('total_rows', 0),
                           avg_meals=analytics_data.get('avg_meals', 0))


@app.route('/api/analytics-data')
def analytics_api():
    """JSON endpoint for Chart.js on the analytics page."""
    safe = {
        'day_means': analytics_data['day_means'],
        'weather_means': analytics_data['weather_means'],
        'festival_means': {str(k): v for k, v in analytics_data['festival_means'].items()},
        'scatter': {
            'customers': analytics_data['scatter_data']['customers'][:200],
            'meals': analytics_data['scatter_data']['meals'][:200],
            'weather': analytics_data['scatter_data']['weather'][:200],
        },
        'model_results': analytics_data['model_results'],
    }
    return jsonify(safe)


# ── Run ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(" 🍽️  Smart Food Waste Prediction System")
    print(" ➜  http://localhost:5000")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    app.run(debug=True, host='0.0.0.0', port=5000)

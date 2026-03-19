"""
Smart Food Waste Prediction System -- Flask Application
Routes: Home, Predict, Result, Analytics
"""

import os
import sys
import json
import sqlite3
import requests
import numpy as np
import pandas as pd
import joblib
import holidays
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# == App Setup =========================================================
app = Flask(__name__)
CORS(app) # Enable CORS for all routes
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'food-waste-pred-2026')
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# == API Configuration ==================================================
# NOTE: User should provide their own OpenWeatherMap API Key
OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'PLACEHOLDER_KEY')
CITY_NAME = "Bangalore" # Default city

def get_weather_from_api(city=CITY_NAME):
    """Fetches real-time weather from OpenWeatherMap."""
    if OPENWEATHER_API_KEY == 'PLACEHOLDER_KEY':
        return None
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        res = requests.get(url, timeout=5).json()
        if res.get('cod') == 200:
            temp = res['main']['temp']
            weather_main = res['weather'][0]['main']
            # Map API weather to our classes: Sunny, Cloudy, Rainy, Stormy
            mapping = {
                'Clear': 'Sunny',
                'Clouds': 'Cloudy',
                'Rain': 'Rainy',
                'Drizzle': 'Rainy',
                'Thunderstorm': 'Stormy',
                'Mist': 'Cloudy',
                'Fog': 'Cloudy'
            }
            return {
                'temp': temp,
                'condition': mapping.get(weather_main, 'Sunny'),
                'description': res['weather'][0]['description']
            }
    except Exception as e:
        print(f"Weather API Error: {e}")
    return None

# == Load Model & Config ===============================================
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT, 'models', 'model.pkl')
ENCODERS_PATH = os.path.join(ROOT, 'models', 'encoders.pkl')
ANALYTICS_PATH = os.path.join(ROOT, 'models', 'analytics_data.pkl')

model = joblib.load(MODEL_PATH)
config = joblib.load(ENCODERS_PATH)
analytics_data = joblib.load(ANALYTICS_PATH)

le_day = config['le_day']
le_weather = config['le_weather']
scaler = config['scaler']
FEATURES = config['features']
NUMERIC_FEATURES = config['numeric_features']
WEATHER_IMPACT = config['weather_impact']
WEEKEND_DAYS = config['weekend_days']

# ROI & Conversion Factors
AVG_COST_PER_MEAL = 8.50   # USD (Updated to standard)
CO2_KG_PER_MEAL = 2.5      # KG
AVG_MEAL_SIZE_KG = 0.5     # KG

# Cyclical Day Encoding Map
day_map = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}

def get_holiday_name(date_obj=None):
    """Detects holiday for a given date object or today."""
    try:
        if not date_obj:
            date_obj = datetime.now()
        
        # Check US and India holidays as examples
        us_holidays = holidays.US()
        in_holidays = holidays.India()
        
        holiday = us_holidays.get(date_obj) or in_holidays.get(date_obj)
        return holiday
    except Exception:
        return None

@app.route('/api/fetch-weather')
def api_fetch_weather():
    """Endpoint for the frontend to fetch current weather."""
    weather_data = get_weather_from_api()
    if weather_data:
        return jsonify(weather_data)
    return jsonify({'error': 'Could not fetch weather or API key missing'}), 404

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
    if expected_customers == 0: return 'Low'
    ratio = predicted / expected_customers
    if 0.5 <= ratio <= 1.2:
        return 'High'
    elif 0.3 <= ratio <= 1.5:
        return 'Medium'
    return 'Low'

def check_anomaly(value, feature_name):
    """Checks if a value is an anomaly based on historical stats."""
    mean = analytics_data.get('avg_meals', 400) # Fallback to 400
    if feature_name == 'expected_customers':
        if value > mean * 3.0: # Increased threshold to 3.0x
            return True
    return False

def get_reasoning_labels(day, weather, festival, predicted, expected):
    """Generates human-readable reasoning for the AI's prediction."""
    reasons = []
    if festival:
        reasons.append("High demand expected due to Festival.")
    if weather in ['Rainy', 'Stormy']:
        reasons.append(f"Predicted decrease due to {weather} conditions.")
    if day in WEEKEND_DAYS:
        reasons.append("Weekend pattern detected.")
    if expected > 0:
        if predicted > expected * 1.1:
            reasons.append("Historical data suggests higher turnout than registered customers.")
        elif predicted < expected * 0.9:
            reasons.append("Historical data suggests lower turnout than registered customers.")
    
    if not reasons:
        reasons.append("Standard demand pattern based on historical trends.")
    return reasons


# ── Routes ────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        detected_holiday = get_holiday_name()
        return render_template('predict.html',
                               days=config['day_classes'],
                               weathers=config['weather_classes'],
                               detected_holiday=detected_holiday,
                               today_date=datetime.now().strftime('%Y-%m-%d'))

    # POST — process prediction
    try:
        date_str = request.form.get('date', '')
        day = request.form['day']
        weather = request.form['weather']
        festival = int(request.form.get('festival', 0))
        event_name = request.form.get('event_name', '')
        
        # Holiday Detection Logic
        detected_holiday = None
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                detected_holiday = get_holiday_name(date_obj)
                # Ensure day matches date
                day_from_date = date_obj.strftime('%A')
                if day != day_from_date:
                    # User selected a date but inconsistent day. Warn or auto-fix?
                    # For now, we trust the 'day' input for the model, but maybe we should override.
                    pass 
            except ValueError:
                pass
        else:
            detected_holiday = get_holiday_name()

        if detected_holiday and not festival:
            festival = 1
            event_name = detected_holiday

        expected_customers = int(request.form['expected_customers'])
        prev_day = int(request.form['prev_day'])
        prev_week = int(request.form['prev_week'])
        safety_buffer = int(request.form.get('safety_buffer', 0))
        
        # Anomaly Detection
        is_anomaly = check_anomaly(expected_customers, 'expected_customers')
    except (KeyError, ValueError) as e:
        return render_template('predict.html',
                               days=config['day_classes'],
                               weathers=config['weather_classes'],
                               error=f'Invalid input: {e}',
                               today_date=datetime.now().strftime('%Y-%m-%d'))

    # Feature engineering (Must match train_model.py exactly)
    day_encoded = le_day.transform([day])[0]
    weather_encoded = le_weather.transform([weather])[0]
    weekend = 1 if day in WEEKEND_DAYS else 0
    
    # Derived features
    festival_expected_interaction = festival * expected_customers
    weather_impact_score = WEATHER_IMPACT.get(weather, 0.9)
    expected_weather_impact = expected_customers * weather_impact_score
    demand_stability = abs(prev_day - prev_week)
    avg_historical_consumption = (prev_day + prev_week) / 2

    # Advanced Ratios
    consumption_efficiency = avg_historical_consumption / (expected_customers + 1)
    lag_trend = prev_day / (prev_week + 1)

    # Cyclical Day Encoding
    day_num = day_map.get(day, 0)
    day_sin = np.sin(2 * np.pi * day_num / 7)
    day_cos = np.cos(2 * np.pi * day_num / 7)

    # Polynomial & Log Features
    expected_squared = (expected_customers ** 2) / 1000
    log_expected = np.log1p(expected_customers)

    # Create DataFrame for scaling
    features_df = pd.DataFrame([{
        'Day_Encoded': day_encoded,
        'Weather_Encoded': weather_encoded,
        'Festival': festival,
        'Expected_Customers': expected_customers,
        'Previous_Day_Consumption': prev_day,
        'Previous_Week_Same_Day': prev_week,
        'Weekend': weekend,
        'Festival_Expected_Interaction': festival_expected_interaction,
        'Weather_Impact_Score': weather_impact_score,
        'Expected_Weather_Impact': expected_weather_impact,
        'Demand_Stability': demand_stability,
        'Avg_Historical_Consumption': avg_historical_consumption,
        'Consumption_Efficiency': consumption_efficiency,
        'Lag_Trend': lag_trend,
        'Day_Sin': day_sin,
        'Day_Cos': day_cos,
        'Expected_Squared': expected_squared,
        'Log_Expected': log_expected
    }])
    
    # Reorder to match FEATURES list
    features_df = features_df[FEATURES]
    
    # Scale numeric features
    features_df[NUMERIC_FEATURES] = scaler.transform(features_df[NUMERIC_FEATURES])

    predicted = int(model.predict(features_df)[0])
    predicted = max(predicted, 0)
    
    # Apply Safety Buffer
    final_recommendation = int(predicted * (1 + safety_buffer / 100))

    # Save to Database
    try:
        conn = get_db_connection()
        conn.execute('''INSERT INTO predictions (day, weather, festival, expected_customers, prev_day_consumption, prev_week_consumption, ai_prediction, safety_buffer, final_recommendation, event_name)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                     (day, weather, festival, expected_customers, prev_day, prev_week, predicted, safety_buffer, final_recommendation, event_name))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

    confidence = get_confidence(predicted, expected_customers)
    reasoning = get_reasoning_labels(day, weather, festival, predicted, expected_customers)
    
    # Confidence Interval (Simplified: ±5% for High, ±10% for Med, ±15% for Low)
    ci_range = 0.05 if confidence == 'High' else (0.10 if confidence == 'Medium' else 0.15)
    ci_min = int(predicted * (1 - ci_range))
    ci_max = int(predicted * (1 + ci_range))

    res = {
        'day': day,
        'weather': weather,
        'festival': festival,
        'expected_customers': expected_customers,
        'prev_day': prev_day,
        'prev_week': prev_week,
        'predicted': predicted,
        'safety_buffer': safety_buffer,
        'final_recommendation': final_recommendation,
        'confidence': confidence,
        'reasoning': reasoning,
        'ci_min': ci_min,
        'ci_max': ci_max,
        'is_anomaly': is_anomaly,
        'tips': generate_tips(day, weather, festival, expected_customers, predicted)
    }

    # Waste estimate
    waste_estimate = max(0, expected_customers - predicted) if expected_customers > predicted else 0

    # Store in session for result page
    session['result'] = {
        'predicted': predicted,
        'confidence': confidence,
        'reasoning': reasoning,
        'ci_min': ci_min,
        'ci_max': ci_max,
        'is_anomaly': is_anomaly,
        'tips': res['tips'], 
        'waste_estimate': waste_estimate,
        'final_recommendation': final_recommendation,
        'inputs': {
            'day': day, 'weather': weather, 'festival': 'Yes' if festival else 'No',
            'expected_customers': expected_customers,
            'prev_day': prev_day, 'prev_week': prev_week,
            'safety_buffer': safety_buffer
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
                           model_results=analytics_data.get('model_results', {}),
                           best_model=analytics_data.get('best_model_name', 'N/A'),
                           total_rows=analytics_data.get('total_rows', 0))

@app.route('/history')
def history():
    conn = get_db_connection()
    predictions = conn.execute('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT 50').fetchall()
    conn.close()
    return render_template('history.html', predictions=predictions)

@app.route('/update-actual', methods=['POST'])
def update_actual():
    """Update a prediction record with actual consumption feedback."""
    pred_id = request.form.get('id')
    actual = request.form.get('actual_consumed')
    try:
        conn = get_db_connection()
        conn.execute('UPDATE predictions SET actual_consumed = ?, is_actual_verified = 1 WHERE id = ?', (actual, pred_id))
        conn.commit()
        conn.close()
        return redirect(url_for('history'))
    except Exception as e:
        return str(e), 400

@app.route('/api/roi-summary')
def api_roi_summary():
    """Calculate and return ROI metrics based on verified predictions."""
    conn = get_db_connection()
    # Logic: If Actual < Expected AND AI Prediction saved us from over-preparing
    # Saved = (Expected - Final_Recommendation) if AI was correct and lower than Expected
    # For simplicity, we'll calculate savings as (Expected - Final_Rec) * $8.50 for all verified records where AI reduced order
    cursor = conn.execute('''SELECT expected_customers, final_recommendation, actual_consumed 
                             FROM predictions WHERE is_actual_verified = 1''')
    rows = cursor.fetchall()
    conn.close()

    total_saved_meals = 0
    for r in rows:
        # If the manager planned for Expected, but AI suggested Final_Rec, and Actual was closer to Final_Rec
        # We assume the savings = (Expected - Final_Rec) if Final_Rec >= Actual (didn't run out)
        exp = int(r['expected_customers'] or 0)
        rec = int(r['final_recommendation'] or 0)
        act = int(r['actual_consumed'] or 0)
        
        if rec >= act and rec < exp:
            total_saved_meals += (exp - rec)

    return jsonify({
        'total_money_saved': float(round(total_saved_meals * AVG_COST_PER_MEAL, 2)),
        'total_co2_saved': float(round(total_saved_meals * CO2_KG_PER_MEAL, 2)),
        'total_meals_saved': int(total_saved_meals)
    })

@app.route('/api/analytics-summary')
def api_analytics_summary():
    """Detailed JSON endpoint for Chart.js on the analytics page."""
    return jsonify({
        'day_means': analytics_data['day_means'],
        'weather_means': analytics_data['weather_means'],
        'festival_means': {str(k): v for k, v in analytics_data['festival_means'].items()},
        'scatter': {
            'customers': analytics_data['scatter_data']['customers'][:200],
            'meals': analytics_data['scatter_data']['meals'][:200],
            'weather': analytics_data['scatter_data']['weather'][:200],
        },
        'model_results': analytics_data['model_results'],
        'best_model': analytics_data['best_model_name'],
        'total_rows': analytics_data['total_rows'],
        'avg_meals': analytics_data['avg_meals']
    })

@app.route('/api/dashboard-data')
def api_dashboard_data():
    """Returns time-series data for the operational dashboard."""
    conn = get_db_connection()
    # Get last 30 verified predictions
    rows = conn.execute('''SELECT timestamp, ai_prediction, actual_consumed, final_recommendation, expected_customers 
                           FROM predictions WHERE is_actual_verified = 1 
                           ORDER BY timestamp ASC LIMIT 30''').fetchall()
    conn.close()

    return jsonify({
        'timestamps': [r['timestamp'].split(' ')[0] for r in rows],
        'predictions': [r['ai_prediction'] for r in rows],
        'actuals': [r['actual_consumed'] for r in rows],
        'recommendations': [r['final_recommendation'] for r in rows],
        'expected': [r['expected_customers'] for r in rows]
    })


# ── Run ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(" 🍽️  Smart Food Waste Prediction System")
    print(" ➜  http://localhost:5000")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    app.run(debug=True, host='0.0.0.0', port=5000)

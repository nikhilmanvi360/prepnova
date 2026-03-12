"""
Smart Food Waste Prediction System — Model Training Pipeline
Loads dataset, engineers features, trains models, evaluates, saves best model.
Also generates EDA charts saved to static/charts/.
"""

import os
import sys
import warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib

# Try importing xgboost, fall back gracefully
try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("⚠ XGBoost not available, skipping XGB model.")

# ── Paths ──────────────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT, 'data', 'dataset.csv')
MODEL_DIR = os.path.join(ROOT, 'models')
CHART_DIR = os.path.join(ROOT, 'app', 'static', 'charts')
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(CHART_DIR, exist_ok=True)

# ── 1. Load Data ───────────────────────────────────────────────────────
print("━" * 55)
print(" GSD ► LOADING DATASET")
print("━" * 55)
df = pd.read_csv(DATA_PATH)
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"\n{df.head()}")
print(f"\n{df.describe()}")
print(f"\nMissing values:\n{df.isnull().sum()}")

# ── 2. Feature Engineering ─────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► FEATURE ENGINEERING")
print("━" * 55)

WEATHER_IMPACT = {'Sunny': 1.0, 'Cloudy': 0.9, 'Rainy': 0.75, 'Stormy': 0.6}
WEEKEND_DAYS = ['Saturday', 'Sunday']

df['Weekend'] = df['Day_of_Week'].apply(lambda x: 1 if x in WEEKEND_DAYS else 0)
df['Demand_Lag_1'] = df['Previous_Day_Consumption']
df['Weekly_Demand'] = df['Previous_Week_Same_Day']
df['Festival_Boost'] = df['Festival'] * df['Expected_Customers']
df['Demand_Stability'] = abs(df['Previous_Day_Consumption'] - df['Previous_Week_Same_Day'])
df['Weather_Impact_Score'] = df['Weather'].map(WEATHER_IMPACT)

print(f"New features added. Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# ── 3. EDA Visualizations ─────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► GENERATING EDA CHARTS")
print("━" * 55)

plt.style.use('seaborn-v0_8-darkgrid')
COLORS = ['#1a237e', '#283593', '#3949ab', '#5c6bc0', '#7986cb', '#9fa8da', '#c5cae9']

# Chart 1: Scatter — Expected Customers vs Meals Consumed
fig, ax = plt.subplots(figsize=(10, 6))
scatter = ax.scatter(df['Expected_Customers'], df['Meals_Consumed'],
                     c=df['Weather_Impact_Score'], cmap='RdYlGn', alpha=0.6, edgecolors='w', s=40)
plt.colorbar(scatter, label='Weather Impact Score')
ax.set_xlabel('Expected Customers', fontsize=12)
ax.set_ylabel('Meals Consumed', fontsize=12)
ax.set_title('Expected Customers vs Meals Consumed', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CHART_DIR, 'scatter_customers_meals.png'), dpi=100)
plt.close()
print("  ✓ scatter_customers_meals.png")

# Chart 2: Bar — Average Meals by Weekday
fig, ax = plt.subplots(figsize=(10, 6))
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day_means = df.groupby('Day_of_Week')['Meals_Consumed'].mean().reindex(day_order)
bars = ax.bar(day_order, day_means, color=COLORS)
ax.set_xlabel('Day of Week', fontsize=12)
ax.set_ylabel('Average Meals Consumed', fontsize=12)
ax.set_title('Average Meals by Weekday', fontsize=14, fontweight='bold')
for bar, val in zip(bars, day_means):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.0f}', ha='center', va='bottom', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CHART_DIR, 'bar_meals_by_weekday.png'), dpi=100)
plt.close()
print("  ✓ bar_meals_by_weekday.png")

# Chart 3: Bar — Weather Impact
fig, ax = plt.subplots(figsize=(10, 6))
weather_means = df.groupby('Weather')['Meals_Consumed'].mean().reindex(['Sunny', 'Cloudy', 'Rainy', 'Stormy'])
weather_colors = ['#FFB300', '#78909C', '#42A5F5', '#5C6BC0']
bars = ax.bar(weather_means.index, weather_means.values, color=weather_colors)
ax.set_xlabel('Weather', fontsize=12)
ax.set_ylabel('Average Meals Consumed', fontsize=12)
ax.set_title('Weather Impact on Meal Consumption', fontsize=14, fontweight='bold')
for bar, val in zip(bars, weather_means.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.0f}', ha='center', va='bottom', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CHART_DIR, 'bar_weather_impact.png'), dpi=100)
plt.close()
print("  ✓ bar_weather_impact.png")

# Chart 4: Grouped Bar — Festival vs Non-Festival
fig, ax = plt.subplots(figsize=(10, 6))
festival_data = df.groupby('Festival')['Meals_Consumed'].mean()
labels = ['Non-Festival', 'Festival']
colors_fest = ['#5c6bc0', '#ff7043']
ax.bar(labels, festival_data.values, color=colors_fest, width=0.5)
for i, val in enumerate(festival_data.values):
    ax.text(i, val + 2, f'{val:.0f}', ha='center', va='bottom', fontweight='bold', fontsize=13)
ax.set_ylabel('Average Meals Consumed', fontsize=12)
ax.set_title('Festival vs Non-Festival Demand', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CHART_DIR, 'bar_festival_impact.png'), dpi=100)
plt.close()
print("  ✓ bar_festival_impact.png")

# Chart 5: Correlation Heatmap
fig, ax = plt.subplots(figsize=(12, 8))
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr = df[numeric_cols].corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, mask=mask, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, square=True, linewidths=1, ax=ax)
ax.set_title('Feature Correlation Heatmap', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CHART_DIR, 'heatmap_correlation.png'), dpi=100)
plt.close()
print("  ✓ heatmap_correlation.png")

# ── 4. Encode Categoricals ────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► ENCODING & SPLITTING")
print("━" * 55)

le_day = LabelEncoder()
le_weather = LabelEncoder()
df['Day_Encoded'] = le_day.fit_transform(df['Day_of_Week'])
df['Weather_Encoded'] = le_weather.fit_transform(df['Weather'])

FEATURES = [
    'Day_Encoded', 'Festival', 'Weather_Encoded', 'Expected_Customers',
    'Previous_Day_Consumption', 'Previous_Week_Same_Day',
    'Weekend', 'Demand_Lag_1', 'Weekly_Demand',
    'Festival_Boost', 'Demand_Stability', 'Weather_Impact_Score'
]
TARGET = 'Meals_Consumed'

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# ── 5. Train Models ───────────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► TRAINING MODELS")
print("━" * 55)

models = {
    'Random Forest': RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42),
}
if HAS_XGB:
    models['XGBoost'] = XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42, verbosity=0)

results = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    results[name] = {'model': model, 'MAE': mae, 'RMSE': rmse}
    print(f"\n  {name}:")
    print(f"    MAE  = {mae:.2f}")
    print(f"    RMSE = {rmse:.2f}")

# ── 6. Select & Save Best Model ───────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► SAVING BEST MODEL")
print("━" * 55)

best_name = min(results, key=lambda k: results[k]['MAE'])
best_model = results[best_name]['model']

# Save model
model_path = os.path.join(MODEL_DIR, 'model.pkl')
joblib.dump(best_model, model_path)

# Save encoders alongside model
encoders_path = os.path.join(MODEL_DIR, 'encoders.pkl')
joblib.dump({
    'le_day': le_day,
    'le_weather': le_weather,
    'features': FEATURES,
    'weather_impact': WEATHER_IMPACT,
    'weekend_days': WEEKEND_DAYS,
    'day_classes': list(le_day.classes_),
    'weather_classes': list(le_weather.classes_),
}, encoders_path)

print(f"\n  Best model: {best_name}")
print(f"  MAE:  {results[best_name]['MAE']:.2f}")
print(f"  RMSE: {results[best_name]['RMSE']:.2f}")
print(f"  Saved to: {model_path}")
print(f"  Encoders: {encoders_path}")

# Save analytics summary data for the Flask app
analytics_path = os.path.join(MODEL_DIR, 'analytics_data.pkl')
analytics_data = {
    'day_means': day_means.to_dict(),
    'weather_means': weather_means.to_dict(),
    'festival_means': {int(k): v for k, v in festival_data.to_dict().items()},
    'scatter_data': {
        'customers': df['Expected_Customers'].tolist(),
        'meals': df['Meals_Consumed'].tolist(),
        'weather': df['Weather'].tolist()
    },
    'correlation': corr.to_dict(),
    'model_results': {name: {'MAE': r['MAE'], 'RMSE': r['RMSE']} for name, r in results.items()},
    'best_model_name': best_name,
    'total_rows': len(df),
    'avg_meals': float(df['Meals_Consumed'].mean()),
}
joblib.dump(analytics_data, analytics_path)
print(f"  Analytics data: {analytics_path}")

print("\n" + "━" * 55)
print(" GSD ► PHASE 2 COMPLETE ✓")
print("━" * 55)

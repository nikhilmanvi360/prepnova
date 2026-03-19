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
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# Try importing advanced regressors, fall back gracefully
try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("⚠ XGBoost not available, skipping XGB model.")

try:
    from lightgbm import LGBMRegressor
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False
    print("⚠ LightGBM not available.")

try:
    from catboost import CatBoostRegressor
    HAS_CAT = True
except ImportError:
    HAS_CAT = False
    print("⚠ CatBoost not available.")

# ── Paths ──────────────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT, 'food_waste_prediction_dataset_1000_rows.csv')
MODEL_DIR = os.path.join(ROOT, 'models')
CHART_DIR = os.path.join(ROOT, 'app', 'static', 'charts')
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(CHART_DIR, exist_ok=True)

# ── 1. Load Data ───────────────────────────────────────────────────────
print("━" * 55)
print(" GSD ► LOADING DATASET")
print("━" * 55)
if not os.path.exists(DATA_PATH):
    print(f"Error: {DATA_PATH} not found.")
    sys.exit(1)

df = pd.read_csv(DATA_PATH)
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# ── 2. Feature Engineering ─────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► FEATURE ENGINEERING")
print("━" * 55)

WEATHER_IMPACT = {'Sunny': 1.0, 'Cloudy': 0.9, 'Rainy': 0.75, 'Stormy': 0.6}
WEEKEND_DAYS = ['Saturday', 'Sunday']

# Lag features and trends
df['Weekend'] = df['Day_of_Week'].apply(lambda x: 1 if x in WEEKEND_DAYS else 0)
df['Festival_Expected_Interaction'] = df['Festival'] * df['Expected_Customers']
df['Weather_Impact_Score'] = df['Weather'].map(WEATHER_IMPACT)
df['Expected_Weather_Impact'] = df['Expected_Customers'] * df['Weather_Impact_Score']
df['Demand_Stability'] = abs(df['Previous_Day_Consumption'] - df['Previous_Week_Same_Day'])
df['Avg_Historical_Consumption'] = (df['Previous_Day_Consumption'] + df['Previous_Week_Same_Day']) / 2

# Polynomial & Log Features
df['Expected_Squared'] = (df['Expected_Customers'] ** 2) / 1000
df['Log_Expected'] = np.log1p(df['Expected_Customers'])

# Advanced Ratios
df['Consumption_Efficiency'] = df['Avg_Historical_Consumption'] / (df['Expected_Customers'] + 1)
df['Lag_Trend'] = df['Previous_Day_Consumption'] / (df['Previous_Week_Same_Day'] + 1)

# Cyclical Day Encoding
day_map = {'Monday':0, 'Tuesday':1, 'Wednesday':2, 'Thursday':3, 'Friday':4, 'Saturday':5, 'Sunday':6}
df['Day_Num'] = df['Day_of_Week'].map(day_map)
df['Day_Sin'] = np.sin(2 * np.pi * df['Day_Num'] / 7)
df['Day_Cos'] = np.cos(2 * np.pi * df['Day_Num'] / 7)

# Feature lists
CATEGORICAL_FEATURES = ['Day_of_Week', 'Weather']
NUMERIC_FEATURES = [
    'Festival', 'Expected_Customers', 'Previous_Day_Consumption', 
    'Previous_Week_Same_Day', 'Weekend', 'Festival_Expected_Interaction',
    'Weather_Impact_Score', 'Expected_Weather_Impact', 'Demand_Stability',
    'Avg_Historical_Consumption', 'Consumption_Efficiency', 'Lag_Trend',
    'Day_Sin', 'Day_Cos', 'Expected_Squared', 'Log_Expected'
]

# Encoding
le_day = LabelEncoder()
le_weather = LabelEncoder()
df['Day_Encoded'] = le_day.fit_transform(df['Day_of_Week'])
df['Weather_Encoded'] = le_weather.fit_transform(df['Weather'])

X_FEATURES = ['Day_Encoded', 'Weather_Encoded'] + NUMERIC_FEATURES
X = df[X_FEATURES]
y = df['Meals_Consumed']

# Scaling
scaler = StandardScaler()
X_scaled = X.copy()
X_scaled[NUMERIC_FEATURES] = scaler.fit_transform(X[NUMERIC_FEATURES])

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
print(f"Features: {X_FEATURES}")
print(f"Train set: {X_train.shape}, Test set: {X_test.shape}")

# ── 3. Hyperparameter Tuning ──────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► HYPERPARAMETER TUNING")
print("━" * 55)

# Selection of models for tuning
param_grid_rf = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5]
}

print("Running GridSearchCV for Random Forest...")
rf_grid = GridSearchCV(RandomForestRegressor(random_state=42), param_grid_rf, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1)
rf_grid.fit(X_train, y_train)
best_rf = rf_grid.best_estimator_
print(f"Best RF Params: {rf_grid.best_params_}")

# Gradient Boosting
param_grid_gb = {
    'n_estimators': [100, 200],
    'learning_rate': [0.05, 0.1],
    'max_depth': [3, 5]
}
print("Running GridSearchCV for Gradient Boosting...")
gb_grid = GridSearchCV(GradientBoostingRegressor(random_state=42), param_grid_gb, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1)
gb_grid.fit(X_train, y_train)
best_gb = gb_grid.best_estimator_

# Models to use
estimators = [
    ('rf', best_rf),
    ('gb', best_gb)
]

if HAS_XGB:
    print("Training XGBoost...")
    xgb = XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=5, random_state=42)
    xgb.fit(X_train, y_train)
    estimators.append(('xgb', xgb))

if HAS_LGBM:
    print("Training LightGBM...")
    lgbm = LGBMRegressor(n_estimators=300, learning_rate=0.05, max_depth=7, random_state=42, verbose=-1)
    lgbm.fit(X_train, y_train)
    estimators.append(('lgbm', lgbm))

if HAS_CAT:
    print("Training CatBoost...")
    cat = CatBoostRegressor(n_estimators=300, learning_rate=0.05, depth=6, random_state=42, verbose=0)
    cat.fit(X_train, y_train)
    estimators.append(('cat', cat))

print("Training Stacking Ensemble...")
stack_reg = StackingRegressor(
    estimators=estimators,
    final_estimator=Ridge()
)
stack_reg.fit(X_train, y_train)

models = {
    'Random Forest': best_rf,
    'Gradient Boosting': best_gb,
    'Stacking Ensemble': stack_reg
}

if HAS_XGB:
    models['XGBoost'] = xgb
if HAS_LGBM:
    models['LightGBM'] = lgbm
if HAS_CAT:
    models['CatBoost'] = cat

# ── 4. Evaluation ─────────────────────────────────────────────────────
results = {}
for name, model in models.items():
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    results[name] = {'model': model, 'MAE': mae, 'RMSE': rmse, 'R2': r2}
    print(f"\n  {name}:")
    print(f"    MAE  = {mae:.2f}")
    print(f"    RMSE = {rmse:.2f}")
    print(f"    R2   = {r2:.4f}")

best_name = min(results, key=lambda k: results[k]['MAE'])
print(f"\n🏆 Best Model: {best_name}")

# ── 5. Save Artifacts ────────────────────────────────────────────────
print("\n" + "━" * 55)
print(" GSD ► SAVING ARTIFACTS")
print("━" * 55)

model_path = os.path.join(MODEL_DIR, 'model.pkl')
joblib.dump(results[best_name]['model'], model_path)

encoders_path = os.path.join(MODEL_DIR, 'encoders.pkl')
joblib.dump({
    'le_day': le_day,
    'le_weather': le_weather,
    'scaler': scaler,
    'features': X_FEATURES,
    'numeric_features': NUMERIC_FEATURES,
    'weather_impact': WEATHER_IMPACT,
    'weekend_days': WEEKEND_DAYS,
    'day_classes': list(le_day.classes_),
    'weather_classes': list(le_weather.classes_),
}, encoders_path)

# Visualizations (EDA)
print("Generating visualizations...")
# Chart 1: Actual vs Predicted
plt.figure(figsize=(10, 6))
y_pred_best = results[best_name]['model'].predict(X_test)
plt.scatter(y_test, y_pred_best, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual')
plt.ylabel('Predicted')
plt.title(f'Actual vs Predicted - {best_name}')
plt.savefig(os.path.join(CHART_DIR, 'actual_vs_predicted.png'))
plt.close()

# Chart 2: Feature Importance
plt.figure(figsize=(12, 8))
if hasattr(results[best_name]['model'], 'feature_importances_'):
    importances = results[best_name]['model'].feature_importances_
    indices = np.argsort(importances)
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [X_FEATURES[i] for i in indices])
    plt.title(f'Feature Importance - {best_name}')
    plt.savefig(os.path.join(CHART_DIR, 'feature_importance.png'))
plt.close()

# Save analytics summary data
analytics_path = os.path.join(MODEL_DIR, 'analytics_data.pkl')

# Calculate means for dashboard
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day_means = df.groupby('Day_of_Week')['Meals_Consumed'].mean().reindex(day_order).to_dict()
weather_means = df.groupby('Weather')['Meals_Consumed'].mean().to_dict()
festival_means = {int(k): v for k, v in df.groupby('Festival')['Meals_Consumed'].mean().to_dict().items()}

analytics_data = {
    'model_results': {name: {'MAE': r['MAE'], 'RMSE': r['RMSE'], 'R2': r['R2']} for name, r in results.items()},
    'best_model_name': best_name,
    'total_rows': len(df),
    'avg_meals': float(df['Meals_Consumed'].mean()),
    'day_means': day_means,
    'weather_means': weather_means,
    'festival_means': festival_means,
    'scatter_data': {
        'customers': df['Expected_Customers'].tolist(),
        'meals': df['Meals_Consumed'].tolist(),
        'weather': df['Weather'].tolist()
    },
}
joblib.dump(analytics_data, analytics_path)

print(f"Artifacts saved to {MODEL_DIR}")
print(f"Charts saved to {CHART_DIR}")
print("\n" + "━" * 55)
print(" GSD ► TRAINING COMPLETE ✓")
print("━" * 55)

import os
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, r2_score

# Paths
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT, 'food_waste_prediction_dataset_1000_rows.csv')
MODEL_PATH = os.path.join(ROOT, 'models', 'model.pkl')
ENCODERS_PATH = os.path.join(ROOT, 'models', 'encoders.pkl')

if not all(os.path.exists(p) for p in [DATA_PATH, MODEL_PATH, ENCODERS_PATH]):
    print("Error: Missing model artifacts or data.")
    exit(1)

# Load data and model
df = pd.read_csv(DATA_PATH)
model = joblib.load(MODEL_PATH)
config = joblib.load(ENCODERS_PATH)

# Feature engineering (Sync with current app.py logic)
le_day = config['le_day']
le_weather = config['le_weather']
scaler = config['scaler']
FEATURES = config['features']
NUMERIC_FEATURES = config['numeric_features']
WEATHER_IMPACT = config['weather_impact']
WEEKEND_DAYS = config['weekend_days']

df['Day_Encoded'] = le_day.transform(df['Day_of_Week'])
df['Weather_Encoded'] = le_weather.transform(df['Weather'])
df['Weekend'] = df['Day_of_Week'].apply(lambda x: 1 if x in WEEKEND_DAYS else 0)
df['Festival_Expected_Interaction'] = df['Festival'] * df['Expected_Customers']
df['Weather_Impact_Score'] = df['Weather'].map(WEATHER_IMPACT)
df['Expected_Weather_Impact'] = df['Expected_Customers'] * df['Weather_Impact_Score']
df['Demand_Stability'] = abs(df['Previous_Day_Consumption'] - df['Previous_Week_Same_Day'])
df['Avg_Historical_Consumption'] = (df['Previous_Day_Consumption'] + df['Previous_Week_Same_Day']) / 2

# Advanced Ratios
df['Consumption_Efficiency'] = df['Avg_Historical_Consumption'] / (df['Expected_Customers'] + 1)
df['Lag_Trend'] = df['Previous_Day_Consumption'] / (df['Previous_Week_Same_Day'] + 1)

# Cyclical Day Encoding
day_map = {'Monday':0, 'Tuesday':1, 'Wednesday':2, 'Thursday':3, 'Friday':4, 'Saturday':5, 'Sunday':6}
df['Day_Num'] = df['Day_of_Week'].map(day_map)
df['Day_Sin'] = np.sin(2 * np.pi * df['Day_Num'] / 7)
df['Day_Cos'] = np.cos(2 * np.pi * df['Day_Num'] / 7)

# Polynomial & Log Features
df['Expected_Squared'] = (df['Expected_Customers'] ** 2) / 1000
df['Log_Expected'] = np.log1p(df['Expected_Customers'])

X = df[FEATURES]
X_scaled = X.copy()
X_scaled[NUMERIC_FEATURES] = scaler.transform(X[NUMERIC_FEATURES])

# Predict
df['Predicted'] = model.predict(X_scaled)
df['Residual'] = df['Meals_Consumed'] - df['Predicted']
df['Abs_Error'] = df['Residual'].abs()

# Analysis
mae = mean_absolute_error(df['Meals_Consumed'], df['Predicted'])
r2 = r2_score(df['Meals_Consumed'], df['Predicted'])

print(f"Overall MAE: {mae:.2f}")
print(f"Overall R2:  {r2:.4f}")

# Residual Analysis
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.scatter(df['Meals_Consumed'], df['Predicted'], alpha=0.5)
plt.plot([df['Meals_Consumed'].min(), df['Meals_Consumed'].max()], 
         [df['Meals_Consumed'].min(), df['Meals_Consumed'].max()], 'r--')
plt.title('Actual vs Predicted')
plt.xlabel('Actual')
plt.ylabel('Predicted')

plt.subplot(1, 2, 2)
sns.histplot(df['Residual'], kde=True)
plt.title('Residual Distribution')
plt.axvline(0, color='r', linestyle='--')

plt.tight_layout()
plt.savefig(os.path.join(ROOT, 'models', 'diagnostics.png'))
print(f"Diagnostic plot saved to models/diagnostics.png")

# Check errors by feature
print("\n--- Error by Day of Week ---")
print(df.groupby('Day_of_Week')['Abs_Error'].mean().sort_values(ascending=False))

print("\n--- Error by Weather ---")
print(df.groupby('Weather')['Abs_Error'].mean().sort_values(ascending=False))

print("\n--- Error by Festival ---")
print(df.groupby('Festival')['Abs_Error'].mean())

# Over-predicting vs Under-predicting
under = df[df['Residual'] > 0]
over = df[df['Residual'] < 0]
print(f"\nUnder-predicting (Waste Risk): {len(under)} cases, Mean error: {under['Residual'].mean():.2f}")
print(f"Over-predicting (Shortage Risk): {len(over)} cases, Mean error: {over['Residual'].abs().mean():.2f}")

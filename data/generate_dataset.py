"""Generate synthetic food consumption dataset (1000 rows)."""
import numpy as np
import pandas as pd
import os

np.random.seed(42)
N = 1000

days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
weathers = ['Sunny', 'Cloudy', 'Rainy', 'Stormy']
weather_weights = [0.40, 0.30, 0.20, 0.10]
weather_impact = {'Sunny': 1.0, 'Cloudy': 0.9, 'Rainy': 0.75, 'Stormy': 0.6}
day_impact = {
    'Monday': 0.90, 'Tuesday': 0.92, 'Wednesday': 0.95,
    'Thursday': 0.97, 'Friday': 1.10, 'Saturday': 1.15, 'Sunday': 1.05
}

# Generate features
Day_of_Week = np.random.choice(days, N)
Festival = np.random.binomial(1, 0.15, N)
Weather = np.random.choice(weathers, N, p=weather_weights)
Expected_Customers = np.random.randint(100, 601, N)

# Base consumption driven by expected customers
base = Expected_Customers * 0.75

# Apply modifiers
day_mod = np.array([day_impact[d] for d in Day_of_Week])
weather_mod = np.array([weather_impact[w] for w in Weather])
festival_mod = 1.0 + Festival * 0.20

Meals_Consumed = (base * day_mod * weather_mod * festival_mod
                  + np.random.normal(0, 15, N)).astype(int)
Meals_Consumed = np.clip(Meals_Consumed, 50, 700)

# Lag features (simulated — slight noise from actual)
Previous_Day_Consumption = (Meals_Consumed + np.random.randint(-30, 31, N)).clip(50, 700)
Previous_Week_Same_Day = (Meals_Consumed + np.random.randint(-40, 41, N)).clip(50, 700)

df = pd.DataFrame({
    'Day_of_Week': Day_of_Week,
    'Festival': Festival,
    'Weather': Weather,
    'Expected_Customers': Expected_Customers,
    'Previous_Day_Consumption': Previous_Day_Consumption,
    'Previous_Week_Same_Day': Previous_Week_Same_Day,
    'Meals_Consumed': Meals_Consumed
})

os.makedirs(os.path.dirname(__file__) or '.', exist_ok=True)
out = os.path.join(os.path.dirname(__file__), 'dataset.csv')
df.to_csv(out, index=False)
print(f"Dataset saved: {out}")
print(f"Shape: {df.shape}")
print(f"\n{df.head()}")
print(f"\n{df.describe()}")

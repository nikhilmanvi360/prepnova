import numpy as np

class PrepNovaAgent:
    def __init__(self):
        pass

    def generate_recommendation(self, predicted_demand, current_inventory):
        diff = current_inventory - predicted_demand

        if diff > 20:
            return f"⚠️ Overproduction risk. Reduce production by {int(diff * 0.5)} units."
        elif diff < -20:
            return f"⚠️ Shortage risk. Increase production by {int(abs(diff) * 0.5)} units."
        else:
            return "✅ Production is optimal. No major changes needed."

    def generate_production_plan(self, predicted_demand):
        buffer = int(predicted_demand * 0.1)  # 10% safety buffer
        optimal = int(predicted_demand - buffer)

        return {
            "predicted": int(predicted_demand),
            "buffer": buffer,
            "recommended_production": optimal
        }

    def risk_alert(self, predicted_demand, current_inventory):
        if current_inventory > predicted_demand * 1.2:
            return "🚨 High Waste Risk"
        elif current_inventory < predicted_demand * 0.8:
            return "🚨 High Shortage Risk"
        else:
            return "🟢 Low Risk"

    def natural_query(self, query, predicted_demand):
        query = query.lower()

        if "how much" in query or "cook" in query:
            return f"You should prepare approximately {int(predicted_demand)} meals tomorrow."
        
        elif "risk" in query:
            return "Risk depends on inventory vs demand. Check alerts."
        
        else:
            return "Query not understood. Try asking about demand or production."

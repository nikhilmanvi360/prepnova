#!/bin/bash

# PrepNova - Backend Startup Script
# Ensures the virtual environment is used and all dependencies are present.

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🍽️  PrepNova Intelligence — Backend Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if .venv exists
if [ ! -d ".venv" ]; then
    echo "❌ Error: .venv directory not found."
    echo "Please run: python -m venv .venv && .venv/bin/pip install -r requirements.txt"
    exit 1
fi

echo "✅ Environment verified: .venv"
echo "🚀 Starting Flask engine..."

# Start the application
./.venv/bin/python app/app.py

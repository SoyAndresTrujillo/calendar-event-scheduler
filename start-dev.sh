#!/bin/bash

# Development startup script for Calendar Event Scheduler
# Starts both frontend and backend in development mode

echo "🚀 Starting Calendar Event Scheduler in development mode..."

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: frontend or backend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "📡 Starting FastAPI backend..."
    cd backend
    if [ ! -f ".env" ]; then
        echo "⚠️  Warning: .env file not found in backend directory"
        echo "Please copy env.example to .env and configure your Google OAuth credentials"
        echo "See GOOGLE_CLOUD_SETUP.md for detailed instructions"
    fi
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "🔧 Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start FastAPI server
    echo "🏃 Running FastAPI server on http://localhost:8000"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting React frontend..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Node.js dependencies..."
        npm install
    fi
    
    # Start React development server
    echo "🏃 Running React dev server on http://localhost:3000"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Start both services
start_backend
start_frontend

echo ""
echo "✅ Both services are starting up!"
echo ""
echo "📡 Backend API: http://localhost:8000"
echo "⚛️  Frontend App: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Wait for services
wait


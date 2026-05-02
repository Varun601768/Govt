#!/bin/bash

echo "Starting Government Hospital Management System..."
echo

echo "Starting MongoDB (make sure MongoDB is installed and running)..."
echo "If MongoDB is not running, please start it manually first."
echo

echo "Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Application is starting up!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to press Ctrl+C
wait

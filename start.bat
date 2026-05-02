@echo off
echo Starting Government Hospital Management System...
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)...
echo If MongoDB is not running, please start it manually first.
echo.

echo Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm run dev"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Application is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul

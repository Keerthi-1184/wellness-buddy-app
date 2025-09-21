@echo off
echo 🌸 Starting Wellness Buddy App...
echo.

echo Starting FastAPI Backend...
start "FastAPI Backend" cmd /k "cd /d C:\Users\Keerthi\Desktop\wellness-buddy-app && python run_app.py"

timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d C:\Users\Keerthi\Desktop\wellness-buddy-app\frontend && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo.
echo Press any key to exit...
pause > nul

@echo off
REM 🚀 Start All Services - Backend + Frontend
REM Batch script để khởi động cả backend và frontend

echo 🚀 Starting Backend and Frontend...
echo.

REM Start Backend in new window
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Services started!
echo.
echo 📊 URLs:
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:5173
echo.
echo 💡 Tip: 2 CMD windows đã được mở riêng cho backend và frontend
echo    Để dừng: Đóng các CMD windows đó
echo.
echo 🎉 Setup hoàn tất! Mở browser tại: http://localhost:5173

pause


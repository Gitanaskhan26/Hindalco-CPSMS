@echo off
echo =======================================================
echo      Hindalco CPSMS - Starting Both Servers
echo =======================================================
echo.
echo This will start both backend and frontend servers
echo in separate command windows.
echo.
echo Backend: http://localhost:8081/api
echo Frontend: http://localhost:9003
echo.

REM Start backend in new window
echo Starting backend server...
start "Hindalco CPSMS Backend" cmd /k "%~dp0start-backend.bat"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "Hindalco CPSMS Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo Both servers are starting in separate windows.
echo.
echo To access the application:
echo 1. Wait for both servers to start completely
echo 2. Open your browser to: http://localhost:9003
echo.
echo To stop the servers, close the respective command windows
echo or press Ctrl+C in each window.
echo.

pause

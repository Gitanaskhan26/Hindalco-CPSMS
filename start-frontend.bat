@echo off
echo =======================================================
echo        Hindalco CPSMS - Starting Frontend Server
echo =======================================================
echo.
echo Starting Next.js frontend on port 9003...
echo Application will be available at: http://localhost:9003
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0hindalco-cpsms-frontend"

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm not found in PATH
    echo Please install Node.js and npm
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start the frontend server
echo Starting Next.js development server...
npm run dev

pause

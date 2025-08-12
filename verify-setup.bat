@echo off
echo =======================================================
echo     Hindalco CPSMS - Connection Verification
echo =======================================================
echo.

REM Check if Java is installed
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Please install Java 17 or higher.
    goto :end
) else (
    echo [OK] Java is installed
)

REM Check if Maven is installed
echo Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found. Please install Maven 3.6 or higher.
    goto :end
) else (
    echo [OK] Maven is installed
)

REM Check if Node.js is installed
echo Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18 or higher.
    goto :end
) else (
    echo [OK] Node.js is installed
)

REM Check if npm is installed
echo Checking npm installation...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install npm.
    goto :end
) else (
    echo [OK] npm is installed
)

echo.
echo =======================================================
echo               Configuration Check
echo =======================================================

REM Check backend configuration
echo Checking backend configuration...
if exist "hindalco-cpsms-backend\src\main\resources\application.yml" (
    echo [OK] Backend application.yml found
) else (
    echo [ERROR] Backend application.yml not found
)

if exist "hindalco-cpsms-backend\pom.xml" (
    echo [OK] Backend pom.xml found
) else (
    echo [ERROR] Backend pom.xml not found
)

REM Check frontend configuration
echo Checking frontend configuration...
if exist "hindalco-cpsms-frontend\package.json" (
    echo [OK] Frontend package.json found
) else (
    echo [ERROR] Frontend package.json not found
)

if exist "hindalco-cpsms-frontend\.env.local" (
    echo [OK] Frontend .env.local found
) else (
    echo [ERROR] Frontend .env.local not found
)

echo.
echo =======================================================
echo                Port Availability
echo =======================================================

echo Checking if ports are available...

REM Check port 8081 (backend)
netstat -an | findstr ":8081" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use - Backend may not start
) else (
    echo [OK] Port 8081 is available for backend
)

REM Check port 9003 (frontend)
netstat -an | findstr ":9003" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 9003 is already in use - Frontend may not start
) else (
    echo [OK] Port 9003 is available for frontend
)

echo.
echo =======================================================
echo                  Quick Start
echo =======================================================
echo.
echo To start the application:
echo 1. Double-click 'start-all.bat' to start both servers
echo 2. Or start them separately:
echo    - Backend: Double-click 'start-backend.bat'
echo    - Frontend: Double-click 'start-frontend.bat'
echo.
echo After starting:
echo - Backend API: http://localhost:8081/api
echo - Frontend App: http://localhost:9003
echo.

:end
echo Press any key to exit...
pause >nul

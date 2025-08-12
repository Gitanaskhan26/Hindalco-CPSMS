@echo off
echo =======================================================
echo        Hindalco CPSMS - Starting Backend Server
echo =======================================================
echo.
echo Choose your database configuration:
echo 1. PostgreSQL (Production) - requires PostgreSQL running
echo 2. H2 In-Memory (Testing) - no database setup required
echo 3. PostgreSQL with auto-create tables
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting with PostgreSQL production configuration...
    set PROFILE=
    set EXTRA_ARGS=
) else if "%choice%"=="2" (
    echo Starting with H2 in-memory database for testing...
    set PROFILE=-Dspring-boot.run.profiles=test
    set EXTRA_ARGS=
) else if "%choice%"=="3" (
    echo Starting with PostgreSQL and auto-create tables...
    set PROFILE=
    set EXTRA_ARGS=-Dspring.jpa.hibernate.ddl-auto=create-drop
) else (
    echo Invalid choice. Starting with H2 testing mode...
    set PROFILE=-Dspring-boot.run.profiles=test
    set EXTRA_ARGS=
)

echo.
echo Backend will be available at: http://localhost:8081/api
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0hindalco-cpsms-backend"

REM Check if mvn is available
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Maven not found in PATH
    echo Please install Maven and add it to your PATH
    pause
    exit /b 1
)

REM Start the backend server
echo Starting Maven Spring Boot application...
if defined EXTRA_ARGS (
    mvn spring-boot:run %PROFILE% %EXTRA_ARGS%
) else (
    mvn spring-boot:run %PROFILE%
)

pause

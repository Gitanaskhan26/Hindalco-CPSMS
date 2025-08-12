# CPSMS Database Setup Automation Script
# Run this script as Administrator

param(
    [string]$PostgresPassword = "admin123",
    [string]$CpsmsPassword = "cpsms_password"
)

Write-Host "=== CPSMS Database Setup Script ===" -ForegroundColor Green
Write-Host "This script will set up PostgreSQL database for CPSMS" -ForegroundColor Yellow

# Function to check if PostgreSQL is installed
function Test-PostgreSQL {
    try {
        $pgPath = where.exe psql 2>$null
        return $pgPath -ne $null
    }
    catch {
        return $false
    }
}

# Function to check if PostgreSQL service is running
function Test-PostgreSQLService {
    $service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    return $service -and $service.Status -eq 'Running'
}

# Step 1: Check PostgreSQL Installation
Write-Host "`n1. Checking PostgreSQL installation..." -ForegroundColor Cyan
if (-not (Test-PostgreSQL)) {
    Write-Host "PostgreSQL not found. Installing via Chocolatey..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Chocolatey first..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        refreshenv
    }
    
    # Install PostgreSQL
    choco install postgresql -y
    refreshenv
    
    Write-Host "PostgreSQL installation completed. Please restart this script." -ForegroundColor Green
    exit
} else {
    Write-Host "✓ PostgreSQL is installed" -ForegroundColor Green
}

# Step 2: Start PostgreSQL Service
Write-Host "`n2. Starting PostgreSQL service..." -ForegroundColor Cyan
if (-not (Test-PostgreSQLService)) {
    try {
        Start-Service -Name "postgresql*" -ErrorAction Stop
        Start-Sleep -Seconds 5
        Write-Host "✓ PostgreSQL service started" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ Could not start PostgreSQL service automatically" -ForegroundColor Red
        Write-Host "Please start it manually through Services.msc" -ForegroundColor Yellow
        Read-Host "Press Enter when PostgreSQL service is running..."
    }
} else {
    Write-Host "✓ PostgreSQL service is already running" -ForegroundColor Green
}

# Step 3: Create Database and User
Write-Host "`n3. Creating database and user..." -ForegroundColor Cyan

$sqlCommands = @"
-- Create database
CREATE DATABASE cpsms_db;

-- Create user
CREATE USER cpsms_user WITH PASSWORD '$CpsmsPassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;
GRANT CREATE ON SCHEMA public TO cpsms_user;
GRANT USAGE ON SCHEMA public TO cpsms_user;

-- Connect to new database
\c cpsms_db

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cpsms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cpsms_user;

-- Grant default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cpsms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cpsms_user;
"@

# Save SQL commands to temporary file
$tempSqlFile = "$env:TEMP\cpsms_setup.sql"
$sqlCommands | Out-File -FilePath $tempSqlFile -Encoding UTF8

try {
    # Execute SQL commands
    $env:PGPASSWORD = $PostgresPassword
    psql -U postgres -f $tempSqlFile
    
    Write-Host "✓ Database and user created successfully" -ForegroundColor Green
}
catch {
    Write-Host "⚠ Error creating database. You may need to run these commands manually:" -ForegroundColor Red
    Write-Host $sqlCommands -ForegroundColor Yellow
}
finally {
    # Clean up
    Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

# Step 4: Create Environment File
Write-Host "`n4. Creating environment configuration..." -ForegroundColor Cyan

$envContent = @"
# Database Configuration
DB_USERNAME=cpsms_user
DB_PASSWORD=$CpsmsPassword
DB_URL=jdbc:postgresql://localhost:5432/cpsms_db

# JWT Configuration (Optional - has defaults)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
"@

$envFile = Join-Path $PSScriptRoot ".env"
$envContent | Out-File -FilePath $envFile -Encoding UTF8
Write-Host "✓ Environment file created: $envFile" -ForegroundColor Green

# Step 5: Build Application (if Maven is available)
Write-Host "`n5. Building application..." -ForegroundColor Cyan

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    try {
        Push-Location $PSScriptRoot
        mvn clean package -DskipTests
        Write-Host "✓ Application built successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ Build failed. Please run 'mvn clean package -DskipTests' manually" -ForegroundColor Yellow
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "⚠ Maven not found. Please install Maven and run 'mvn clean package -DskipTests'" -ForegroundColor Yellow
}

# Step 6: Instructions for running
Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Run the application: java -jar target/cpsms-backend-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host "2. Test health endpoint: curl http://localhost:8081/api/health" -ForegroundColor White
Write-Host "3. Test login with sample user:" -ForegroundColor White
Write-Host "   curl -X POST http://localhost:8081/api/auth/login \\" -ForegroundColor Gray
Write-Host "     -H `"Content-Type: application/json`" \\" -ForegroundColor Gray
Write-Host "     -d `"{\\`"email\\`":\\`"plant.manager@hindalco.com\\`",\\`"password\\`":\\`"password123\\`"}`"" -ForegroundColor Gray

Write-Host "`nDatabase Details:" -ForegroundColor Cyan
Write-Host "- Database: cpsms_db" -ForegroundColor White
Write-Host "- Username: cpsms_user" -ForegroundColor White
Write-Host "- Password: $CpsmsPassword" -ForegroundColor White
Write-Host "- Port: 5432" -ForegroundColor White

Write-Host "`nFor troubleshooting, see setup-database.md" -ForegroundColor Yellow

# 🚀 Hindalco CPSMS - Frontend & Backend Connection

## Quick Start (Windows)

### Option 1: Start Everything at Once
```bash
# Double-click this file:
start-all.bat
```

### Option 2: Start Separately  
```bash
# Start backend first:
start-backend.bat

# Then start frontend:
start-frontend.bat
```

### Option 3: Manual Start
```bash
# Backend (Terminal 1)
cd hindalco-cpsms-backend
mvn spring-boot:run

# Frontend (Terminal 2)  
cd hindalco-cpsms-frontend
npm run dev
```

## 📋 Prerequisites Check
Run this to verify your setup:
```bash
verify-setup.bat
```

## 🌐 Application URLs
- **Frontend:** http://localhost:9003
- **Backend API:** http://localhost:8081/api
- **Health Check:** http://localhost:8081/api/actuator/health

## 🔧 Configuration Files

### Backend Configuration
- **Port:** 8081 (configured in `application.yml`)
- **Context Path:** `/api`
- **CORS:** Configured to allow frontend connections
- **Database:** PostgreSQL on localhost:5432

### Frontend Configuration  
- **Port:** 9003 (configured in `package.json`)
- **API URL:** `http://localhost:8081/api` (configured in `.env.local`)
- **Auto-connects to backend:** ✅

## 🗄️ Database Setup
Before starting, ensure PostgreSQL is running:

```sql
CREATE DATABASE cpsms_db;
CREATE USER cpsms_user WITH PASSWORD 'cpsms_password';
GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;
```

## 🔍 Testing the Connection

1. **Start both servers** using any method above
2. **Open browser:** http://localhost:9003
3. **Try logging in** - check if API calls work
4. **Check logs** in both terminal windows

## 🚨 Troubleshooting

### CORS Issues
- ✅ **Already configured** in `CorsConfig.java`
- Allows localhost connections on any port
- Supports ngrok tunnels

### Port Conflicts
- **Backend:** Change `server.port` in `application.yml`
- **Frontend:** Change port in `package.json` dev script

### Database Connection
- Verify PostgreSQL is running
- Check credentials in `application.yml`
- Ensure database exists

### API Not Found
- Ensure backend started successfully
- Check backend logs for errors
- Verify frontend API URL in `.env.local`

## 📁 Project Structure
```
hindalco-cpsms/
├── hindalco-cpsms-backend/     # Spring Boot API
├── hindalco-cpsms-frontend/    # Next.js App
├── start-all.bat              # Start both servers
├── start-backend.bat          # Start backend only
├── start-frontend.bat         # Start frontend only
├── verify-setup.bat           # Check prerequisites
└── CONNECTION_GUIDE.md        # Detailed guide
```

## 📞 Support
If you encounter issues:
1. Check the detailed [CONNECTION_GUIDE.md](CONNECTION_GUIDE.md)
2. Run `verify-setup.bat` to check your environment
3. Check terminal/console logs for error messages

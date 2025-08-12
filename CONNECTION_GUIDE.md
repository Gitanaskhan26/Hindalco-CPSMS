# Hindalco CPSMS - Frontend & Backend Connection Guide

## 🚀 Quick Start Guide

### Prerequisites
- Java 17+ installed
- Maven 3.6+ installed  
- Node.js 18+ installed
- PostgreSQL 12+ running
- Git installed

### 📋 Step-by-Step Connection Process

## 1. Database Setup

First, ensure PostgreSQL is running and create the database:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE cpsms_db;
CREATE USER cpsms_user WITH PASSWORD 'cpsms_password';
GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;
```

## 2. Backend Setup & Start

```bash
# Navigate to backend directory
cd hindalco-cpsms-backend

# Clean and compile
mvn clean compile

# Run database migrations (if using Flyway)
mvn flyway:migrate

# Start the Spring Boot backend server
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8081/api`

## 3. Frontend Setup & Start

```bash
# Navigate to frontend directory  
cd hindalco-cpsms-frontend

# Install dependencies (if not done already)
npm install

# Start the Next.js development server
npm run dev
```

**Frontend will start on:** `http://localhost:9003`

## 4. Connection Configuration

### Backend CORS Configuration ✅
- Already configured in `CorsConfig.java`
- Allows connections from `localhost:*` ports
- Supports ngrok tunnels for external access

### Frontend API Configuration ✅  
- API URL configured in `.env.local`
- Points to: `http://localhost:8081/api`
- Backend integration enabled by default

## 5. Testing the Connection

### Manual Test:
1. Open browser: `http://localhost:9003`
2. Try logging in with test credentials
3. Check browser developer console for API calls
4. Verify backend logs for incoming requests

### API Endpoints Available:
- **Authentication:** `/api/auth/login`, `/api/auth/register`
- **Users:** `/api/users`, `/api/users/{id}`
- **Permits:** `/api/permits`, `/api/permits/{id}`
- **Visitors:** `/api/visitors`, `/api/visitors/{id}`

## 6. For Production/External Access

### Using ngrok (Recommended for external testing):

```bash
# Install ngrok if not installed
# Download from: https://ngrok.com/download

# Start ngrok tunnel for backend
ngrok http 8081

# Copy the generated HTTPS URL (e.g., https://abc123.ngrok.io)
# Update frontend .env.local:
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io/api
```

## 7. Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check backend CORS configuration
   - Ensure frontend origin is allowed
   - Verify API URL in frontend configuration

2. **Database Connection:**
   - Verify PostgreSQL is running
   - Check database credentials in `application.yml`
   - Ensure database exists and user has permissions

3. **Port Conflicts:**
   - Backend: Change port in `application.yml` (server.port)
   - Frontend: Change port in `package.json` scripts

4. **API Not Found (404):**
   - Verify backend is running on correct port
   - Check API URL configuration in frontend
   - Ensure context-path is `/api` in backend

### Environment Variables:
```bash
# Backend (.env or application.yml)
DB_USERNAME=cpsms_user
DB_PASSWORD=cpsms_password
JWT_SECRET=your_jwt_secret_key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_USE_BACKEND=true
```

## 8. Development Workflow

1. **Start Backend First:** `mvn spring-boot:run`
2. **Start Frontend Second:** `npm run dev`  
3. **Access Application:** `http://localhost:9003`
4. **Monitor Logs:** Check both terminal windows for errors

## 9. Production Deployment

### Backend:
- Build: `mvn clean package`
- Deploy JAR: `java -jar target/cpsms-backend-0.0.1-SNAPSHOT.jar`

### Frontend:
- Build: `npm run build`
- Start: `npm start`
- Deploy to Vercel/Netlify with proper environment variables

---

## 🔧 Quick Commands

### Start Both Services:
```bash
# Terminal 1 - Backend
cd hindalco-cpsms-backend && mvn spring-boot:run

# Terminal 2 - Frontend  
cd hindalco-cpsms-frontend && npm run dev
```

### Build for Production:
```bash
# Backend
cd hindalco-cpsms-backend && mvn clean package

# Frontend
cd hindalco-cpsms-frontend && npm run build
```

**Application URLs:**
- Frontend: http://localhost:9003
- Backend API: http://localhost:8081/api
- Backend Health: http://localhost:8081/api/actuator/health (if actuator enabled)

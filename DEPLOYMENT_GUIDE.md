# Hindalco CPSMS - Render Deployment Guide

## Prerequisites
- GitHub repository with the code
- Render account
- PostgreSQL database

## Deployment Steps

### 1. Backend Deployment on Render

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `hindalco-cpsms-backend` directory

2. **Configure Build Settings**
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/cpsms-backend-0.0.1-SNAPSHOT.jar`
   - **Environment**: `Java`

3. **Set Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   JWT_SECRET=<generate-random-secret>
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

4. **Database Configuration**
   - Create PostgreSQL database on Render
   - Add database environment variables:
     ```
     SPRING_DATASOURCE_URL=<database-connection-string>
     SPRING_DATASOURCE_USERNAME=<database-username>
     SPRING_DATASOURCE_PASSWORD=<database-password>
     ```

### 2. Frontend Deployment on Render

1. **Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out` (for Next.js static export)
   - **Environment**: `Node.js`

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NODE_ENV=production
   ```

### 3. Database Setup

The application will automatically:
- Create all necessary tables on first startup
- Insert default roles (EMPLOYEE, ADMIN, SECURITY)
- Create test user: `test@hindalco.com` / `password123`

### 4. Post-Deployment Verification

1. **Health Check**: Visit `https://your-backend-url.onrender.com/api/health`
2. **API Test**: Test authentication endpoint
3. **Frontend Test**: Verify frontend can connect to backend

### 5. Custom Domain (Optional)

- Configure custom domain in Render dashboard
- Update CORS configuration with new domain

## Current Status ✅

### ✅ Ready for Deployment:
- [x] Backend compiles successfully
- [x] Database schema configured
- [x] Production configuration files
- [x] Health check endpoint
- [x] CORS configuration
- [x] JWT authentication
- [x] Environment-specific configs
- [x] Dockerfile (alternative deployment)
- [x] Build scripts

### 🔧 Deployment Files Created:
- `render.yaml` - Render service configuration
- `build.sh` - Build script
- `application-prod.yml` - Production configuration
- `Dockerfile` - Container deployment option

## Environment Variables Required:

### Backend:
```
SPRING_PROFILES_ACTIVE=prod
PORT=8080
SPRING_DATASOURCE_URL=<postgresql-url>
SPRING_DATASOURCE_USERNAME=<db-user>
SPRING_DATASOURCE_PASSWORD=<db-password>
JWT_SECRET=<random-secret-key>
FRONTEND_URL=<frontend-domain>
```

### Frontend:
```
NEXT_PUBLIC_API_URL=<backend-domain>/api
NODE_ENV=production
```

## Support

For issues during deployment:
1. Check Render logs
2. Verify environment variables
3. Test database connectivity
4. Confirm CORS configuration

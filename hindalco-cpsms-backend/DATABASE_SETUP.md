# PostgreSQL Database Setup for CPSMS

## Prerequisites Setup

### 1. Install PostgreSQL 15+
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

### 2. Create Database and User
```sql
-- Connect as postgres superuser
psql -U postgres

-- Create database
CREATE DATABASE cpsms_db;

-- Create user with password
CREATE USER cpsms_user WITH PASSWORD 'cpsms_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;
GRANT CREATE ON SCHEMA public TO cpsms_user;

-- Exit psql
\q
```

### 3. Update Environment Variables
Create `.env` file in backend root:
```env
DB_USERNAME=cpsms_user
DB_PASSWORD=cpsms_password
DB_URL=jdbc:postgresql://localhost:5432/cpsms_db
```

## Database Schema Overview

### Core Entity Relationships
- **Users** belong to **Departments** and have **Roles**
- **Permits** are created by users, assigned to **Locations**, and have **Permit Types**
- **Departments** have heads (Users) and multiple employees
- **Locations** have assigned safety officers and risk levels
- **Notifications** link users to permits and system events

### Key Features
- **150+ employees** across 23 departments
- **8 permit types** with specific safety requirements  
- **10 locations** with GPS coordinates and risk levels
- **Role-based access control** (11 role types)
- **Audit logging** for compliance tracking
- **Full-text search** on permits and users
- **Geospatial indexing** for location-based queries

## Migration Strategy
1. **V1**: Core schema with all tables and relationships
2. **V2**: Department data, roles, and initial employee records (50+ employees)
3. **V3**: Additional employee data (100+ more employees across all departments)
4. **Future migrations**: Feature enhancements and data updates

## Performance Optimizations
- **Indexes** on frequently queried columns
- **Full-text search** indexes for permits and users
- **Geospatial indexes** for location queries
- **Connection pooling** (HikariCP)
- **Query optimization** with proper fetch strategies

## Security Features
- **Encrypted passwords** using BCrypt
- **Environment-based configuration**
- **Role-based permissions**
- **Audit trail** for all operations
- **SQL injection protection** via JPA/Hibernate

## Quick Start Commands

```bash
# 1. Build the application
mvn clean package -DskipTests

# 2. Run with PostgreSQL
java -jar target/cpsms-backend-0.0.1-SNAPSHOT.jar

# 3. Verify database setup
curl http://localhost:8081/api/health

# 4. Test authentication
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tech.admin@hindalco.com","password":"password123"}'
```

## Test Data Access

### Sample Login Credentials
- **System Admin**: `tech.admin@hindalco.com` / `password123`
- **Plant Manager**: `plant.manager@hindalco.com` / `password123`
- **Alumina Plant Manager**: `suresh.patel@hindalco.com` / `password123`
- **Smelter Manager**: `rajesh.verma@hindalco.com` / `password123`
- **Safety Officer**: `sanjeev.kumar@hindalco.com` / `password123`
- **Engineer**: `tribhuvan.das@hindalco.com` / `password123`

### Department Distribution (23 Departments)
- **Alumina Plant**: 8 employees (Manager, Engineers, Operators, Technicians)
- **Smelter**: 10 employees (Manager, Engineers, Operators, Safety Personnel)
- **Pot Room**: 9 employees (Manager, Engineers, Technicians, Operators)
- **Casting & Metal Processing**: 7 employees
- **Rectifier**: 6 employees (Electrical Engineers, Technicians)
- **Rolling Mill**: 8 employees (Production team)
- **Extrusion Plant**: 7 employees
- **Secondary Aluminium & Recycling**: 6 employees
- **Maintenance & Engineering**: 10 employees (Chief Engineer, Multi-discipline team)
- **HVAC**: 5 employees
- **Utilities & Plant Services**: 8 employees (Power, Water, Steam operations)
- **Building Department**: 5 employees (Civil works team)
- **Quality, Lab & Technical Services**: 8 employees (Lab analysts, Quality inspectors)
- **Fire & Safety**: 7 employees (Safety officers, Emergency response)
- **Environment (SHE)**: 6 employees (Environmental management)
- **Training Centre**: 4 employees (Training coordinators, Instructors)
- **IT Department**: 7 employees (System admins, Developers, Support)
- **Security**: 6 employees (Security officers, Guards, CCTV operators)
- **Logistics & Supply Chain**: 7 employees (Warehouse, Transport, Inventory)
- **Store**: 5 employees (Material controllers, Storekeepers)
- **Procurement**: 4 employees (Purchase officers, Vendor management)
- **Administration**: 5 employees (HR, Office management)
- **Accounting & Finance**: 5 employees (Accountants, Financial analysts)

## Monitoring & Maintenance

### Health Check Endpoints
- `/api/health` - Application health status
- `/api/test/hello` - Backend connectivity test
- Database connection status included in health response

### Backup Strategy
```bash
# Daily backup
pg_dump -U cpsms_user cpsms_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U cpsms_user cpsms_db < backup_file.sql
```

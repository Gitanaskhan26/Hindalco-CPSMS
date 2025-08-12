# CPSMS PostgreSQL Database Setup Guide

## Complete Setup Instructions

### Step 1: Install PostgreSQL
```powershell
# Option 1: Using Chocolatey (Recommended)
choco install postgresql

# Option 2: Download and install manually
# Visit: https://www.postgresql.org/download/windows/
```

### Step 2: Configure PostgreSQL Service
```powershell
# Start PostgreSQL service
net start postgresql-x64-15

# Or through Services.msc -> PostgreSQL service
```

### Step 3: Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create the database
CREATE DATABASE cpsms_db;

-- Create application user
CREATE USER cpsms_user WITH PASSWORD 'cpsms_password';

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;
GRANT CREATE ON SCHEMA public TO cpsms_user;
GRANT USAGE ON SCHEMA public TO cpsms_user;

-- Connect to the new database and grant table privileges
\c cpsms_db

-- Grant privileges on all tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cpsms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cpsms_user;

-- Grant default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cpsms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cpsms_user;

-- Exit psql
\q
```

### Step 4: Environment Configuration
Create `.env` file in the backend root directory:
```env
# Database Configuration
DB_USERNAME=cpsms_user
DB_PASSWORD=cpsms_password
DB_URL=jdbc:postgresql://localhost:5432/cpsms_db

# JWT Configuration (Optional - has defaults)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

### Step 5: Build and Run Application
```powershell
# Navigate to backend directory
cd hindalco-cpsms-backend

# Clean and build
mvn clean package -DskipTests

# Run the application (Flyway will auto-migrate)
java -jar target/cpsms-backend-0.0.1-SNAPSHOT.jar
```

### Step 6: Verify Database Setup
```powershell
# Test health endpoint
curl http://localhost:8081/api/health

# Test authentication with sample user
curl -X POST http://localhost:8081/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"plant.manager@hindalco.com\",\"password\":\"password123\"}"
```

## Database Schema Summary

### Tables Created
1. **departments** - 23 departments with budgets and locations
2. **roles** - 11 role types with different permission levels  
3. **users** - 150+ employees with realistic data
4. **locations** - 10 plant locations with GPS coordinates
5. **permit_types** - 8 types of work permits
6. **permits** - Work permit applications and approvals
7. **notifications** - System notifications and alerts

### Sample Data Overview
- **155 Total Employees** across all departments
- **23 Departments** representing complete plant organization
- **Realistic Role Distribution**: Managers, Engineers, Supervisors, Technicians, Operators
- **Comprehensive Coverage**: Production, Maintenance, Safety, Quality, IT, Admin

### Department Breakdown
| Department | Employees | Key Roles |
|------------|-----------|-----------|
| Alumina Plant | 8 | Manager, Engineers, Operators |
| Smelter | 10 | Manager, Engineers, Furnace Operators |
| Pot Room | 9 | Manager, Electrical Engineers, Technicians |
| Casting & Metal Processing | 7 | Manager, Process Engineers, Operators |
| Rectifier | 6 | Manager, Electrical Engineers |
| Rolling Mill | 8 | Manager, Mill Operators, Supervisors |
| Extrusion Plant | 7 | Manager, Press Operators, Technicians |
| Secondary Aluminium | 6 | Manager, Recycling Operators |
| Maintenance & Engineering | 10 | Chief Engineer, Multi-discipline team |
| HVAC | 5 | Manager, AC Technicians |
| Utilities | 8 | Manager, Power Engineers, Operators |
| Building Department | 5 | Civil Engineer, Construction team |
| Quality & Lab | 8 | Chief Quality Officer, Lab Analysts |
| Fire & Safety | 7 | Chief Safety Officer, Fire Officers |
| Environment (SHE) | 6 | Environmental Manager, Analysts |
| Training Centre | 4 | Training Manager, Coordinators |
| IT Department | 7 | IT Manager, Developers, Support |
| Security | 6 | Security Manager, Officers, Guards |
| Logistics | 7 | Logistics Manager, Transport team |
| Store | 5 | Store Manager, Material Controllers |
| Procurement | 4 | Procurement Manager, Purchase Officers |
| Administration | 5 | Admin Manager, HR Officers |
| Finance | 5 | Finance Manager, Accountants |

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Issues
```powershell
# Check if PostgreSQL is running
netstat -an | findstr :5432

# Check PostgreSQL service status
sc query postgresql-x64-15
```

#### 2. Permission Issues
```sql
-- Connect as postgres and fix permissions
psql -U postgres -d cpsms_db

-- Re-grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cpsms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cpsms_user;
```

#### 3. Flyway Migration Issues
```powershell
# Clean and repair Flyway (if needed)
mvn flyway:clean flyway:migrate

# Or run with repair if schema is corrupted
mvn flyway:repair flyway:migrate
```

#### 4. Port Conflicts
```yaml
# In application.yml, change port if 8081 is busy
server:
  port: 8082  # Change to available port
```

### Validation Queries

```sql
-- Connect to database
psql -U cpsms_user -d cpsms_db

-- Check all tables are created
\dt

-- Count records in each table
SELECT 'departments' as table_name, COUNT(*) FROM departments
UNION ALL
SELECT 'roles', COUNT(*) FROM roles  
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'locations', COUNT(*) FROM locations
UNION ALL
SELECT 'permit_types', COUNT(*) FROM permit_types;

-- Check department distribution
SELECT d.name, COUNT(u.id) as employee_count 
FROM departments d 
LEFT JOIN users u ON d.id = u.department_id 
GROUP BY d.name 
ORDER BY employee_count DESC;

-- Check role distribution  
SELECT r.name, COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id  
GROUP BY r.name
ORDER BY user_count DESC;
```

## Backup and Restore

### Create Backup
```powershell
# Full database backup
pg_dump -U cpsms_user -h localhost cpsms_db > cpsms_backup_$(Get-Date -Format "yyyyMMdd").sql

# Schema only backup
pg_dump -U cpsms_user -h localhost -s cpsms_db > cpsms_schema_backup.sql

# Data only backup
pg_dump -U cpsms_user -h localhost -a cpsms_db > cpsms_data_backup.sql
```

### Restore from Backup
```powershell
# Drop and recreate database (as postgres user)
psql -U postgres -c "DROP DATABASE IF EXISTS cpsms_db;"
psql -U postgres -c "CREATE DATABASE cpsms_db;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cpsms_db TO cpsms_user;"

# Restore from backup
psql -U cpsms_user -d cpsms_db < cpsms_backup_file.sql
```

## Next Steps

1. **Test the Application**: Use the sample login credentials to test different user roles
2. **API Integration**: Test permit creation, approval workflows, and notifications  
3. **Frontend Integration**: Connect the React frontend to use the new database structure
4. **Customization**: Add department-specific fields or additional roles as needed
5. **Performance Tuning**: Monitor query performance and add indexes as required

## Support

For any database-related issues:
1. Check application logs for Flyway migration errors
2. Verify PostgreSQL service is running
3. Ensure user permissions are correctly set
4. Check network connectivity on port 5432
5. Validate environment variables are loaded correctly

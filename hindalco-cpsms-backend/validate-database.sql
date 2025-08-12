-- CPSMS Database Validation Script
-- Run this script to verify database setup is correct

-- Test 1: Check if all tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('DEPARTMENTS', 'ROLES', 'USERS', 'LOCATIONS', 'PERMIT_TYPES', 'PERMITS', 'NOTIFICATIONS') 
        THEN '✓ Core table'
        ELSE '? Additional table'
    END AS status
FROM user_tables
ORDER BY table_name;

-- Test 2: Check record counts
SELECT 'DEPARTMENTS' AS table_name, COUNT(*) AS record_count,
    CASE WHEN COUNT(*) = 23 THEN '✓ Expected count' ELSE '⚠ Count mismatch' END AS status
FROM DEPARTMENTS
UNION ALL
SELECT 'ROLES' AS table_name, COUNT(*) AS record_count,
    CASE WHEN COUNT(*) >= 10 THEN '✓ Sufficient roles' ELSE '⚠ Few roles' END AS status
FROM ROLES
UNION ALL
SELECT 'USERS' AS table_name, COUNT(*) AS record_count,
    CASE WHEN COUNT(*) >= 150 THEN '✓ Sufficient users' ELSE '⚠ Few users' END AS status
FROM USERS
UNION ALL
SELECT 'LOCATIONS' AS table_name, COUNT(*) AS record_count,
    CASE WHEN COUNT(*) >= 10 THEN '✓ Sufficient locations' ELSE '⚠ Few locations' END AS status
FROM LOCATIONS
UNION ALL
SELECT 'PERMIT_TYPES' AS table_name, COUNT(*) AS record_count,
    CASE WHEN COUNT(*) >= 8 THEN '✓ Sufficient permit types' ELSE '⚠ Few permit types' END AS status
FROM PERMIT_TYPES;

-- Test 3: Check department distribution
SELECT 
    d.name AS department,
    COUNT(u.id) AS employee_count,
    CASE 
        WHEN COUNT(u.id) = 0 THEN '⚠ No employees'
        WHEN COUNT(u.id) BETWEEN 1 AND 3 THEN '! Few employees'
        WHEN COUNT(u.id) BETWEEN 4 AND 7 THEN '✓ Good distribution'
        ELSE '✓ Large department'
    END AS status
FROM DEPARTMENTS d
LEFT JOIN USERS u ON d.id = u.department_id
GROUP BY d.name, d.id
ORDER BY employee_count DESC;

-- Test 4: Check role distribution
SELECT 
    r.name AS role,
    COUNT(u.id) AS user_count,
    CASE 
        WHEN COUNT(u.id) = 0 THEN '⚠ No users with this role'
        WHEN COUNT(u.id) BETWEEN 1 AND 5 THEN '✓ Limited role'
        WHEN COUNT(u.id) BETWEEN 6 AND 20 THEN '✓ Common role'
        ELSE '✓ Very common role'
    END AS status
FROM ROLES r
LEFT JOIN USERS u ON r.id = u.role_id
GROUP BY r.name, r.id
ORDER BY user_count DESC;

-- Test 5: Check data integrity
SELECT 
    'Users without departments' AS check_name,
    COUNT(*) AS issue_count,
    CASE WHEN COUNT(*) = 0 THEN '✓ No issues' ELSE '⚠ Data integrity issue' END AS status
FROM USERS
WHERE department_id IS NULL
UNION ALL
SELECT 
    'Users without roles' AS check_name,
    COUNT(*) AS issue_count,
    CASE WHEN COUNT(*) = 0 THEN '✓ No issues' ELSE '⚠ Data integrity issue' END AS status
FROM USERS
WHERE role_id IS NULL
UNION ALL
SELECT 
    'Departments without managers' AS check_name,
    COUNT(*) AS issue_count,
    CASE WHEN COUNT(*) <= 5 THEN '✓ Acceptable' ELSE '⚠ Many departments without heads' END AS status
FROM DEPARTMENTS
WHERE head_id IS NULL;

-- Test 6: Sample user verification
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    d.name AS department,
    r.name AS role,
    CASE WHEN u.email IS NOT NULL THEN '✓ User exists' ELSE '⚠ User missing' END AS status
FROM USERS u
LEFT JOIN DEPARTMENTS d ON u.department_id = d.id
LEFT JOIN ROLES r ON u.role_id = r.id
WHERE u.email IN (
    'plant.manager@hindalco.com',
    'suresh.patel@hindalco.com', 
    'sanjeev.kumar@hindalco.com',
    'anil.khanna@hindalco.com'
)
ORDER BY u.email;

-- Test 7: Check foreign key relationships
SELECT 
    a.table_name,
    a.column_name,
    a.constraint_name,
    c_pk.table_name AS foreign_table_name,
    c_pk.column_name AS foreign_column_name,
    '✓ FK constraint active' AS status
FROM user_cons_columns a
JOIN user_constraints c ON a.constraint_name = c.constraint_name
JOIN user_cons_columns c_pk ON c.r_constraint_name = c_pk.constraint_name
WHERE c.constraint_type = 'R'
ORDER BY a.table_name, a.column_name;

-- Validation Complete
-- If you see mostly ✓ symbols, your database is properly set up!
-- Any ⚠ symbols indicate areas that may need attention.

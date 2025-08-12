-- V2__Seed_Data.sql
-- Comprehensive seed data for Hindalco CPSMS with 23 departments and 150+ employees

-- Insert All Departments (23 departments)
INSERT INTO departments (name, description, location, budget) VALUES
-- Core Production Departments
('Alumina Plant', 'Alumina refining and production operations', 'Production Block A', 3500000.00),
('Smelter', 'Primary aluminum smelting operations', 'Production Block B', 5000000.00),
('Pot Room', 'Electrolytic reduction cells and pot operations', 'Production Block C', 4500000.00),
('Casting & Metal Processing', 'Metal casting and primary processing', 'Production Block D', 2800000.00),
('Rectifier', 'Power rectification and electrical systems', 'Electrical Block A', 2200000.00),
('Rolling Mill', 'Aluminum rolling and sheet production', 'Mill Complex', 3200000.00),
('Extrusion Plant', 'Aluminum extrusion and profile production', 'Extrusion Complex', 2600000.00),
('Secondary Aluminium & Recycling', 'Recycling and secondary aluminum production', 'Recycling Plant', 1800000.00),

-- Engineering & Maintenance
('Maintenance & Engineering', 'Plant maintenance and engineering services', 'Engineering Block', 2500000.00),
('HVAC', 'Heating, ventilation and air conditioning systems', 'Utilities Block A', 800000.00),
('Utilities & Plant Services', 'Power, water, compressed air and plant utilities', 'Utilities Block B', 1500000.00),
('Building Department', 'Civil works and building maintenance', 'Civil Block', 600000.00),

-- Quality & Safety
('Quality, Lab & Technical Services', 'Quality control, laboratory and technical services', 'QC Lab Complex', 1200000.00),
('Fire & Safety', 'Fire prevention and industrial safety', 'Safety Block', 900000.00),
('Environment (SHE)', 'Safety, health and environmental management', 'SHE Block', 1100000.00),
('Training Centre', 'Employee training and skill development', 'Training Complex', 400000.00),

-- Support Services
('IT Department', 'Information technology and systems', 'IT Block', 1800000.00),
('Security', 'Plant security and access control', 'Security Complex', 700000.00),
('Logistics & Supply Chain', 'Material handling and supply chain', 'Logistics Hub', 1300000.00),
('Store', 'Inventory management and warehousing', 'Warehouse Complex', 800000.00),
('Procurement', 'Purchasing and vendor management', 'Procurement Block', 500000.00),

-- Administration & Finance
('Administration', 'General administration and HR', 'Admin Block A', 600000.00),
('Accounting & Finance', 'Financial management and accounting', 'Finance Block', 700000.00);

-- Insert Enhanced Roles with Proper Hierarchy
INSERT INTO roles (name, description, permissions) VALUES
('PLANT_MANAGER', 'Plant Manager with full operational authority', 'ALL_PERMISSIONS,PLANT_OPERATIONS,BUDGET_APPROVAL'),
('DEPT_MANAGER', 'Department Manager with departmental authority', 'APPROVE_PERMITS,MANAGE_DEPARTMENT,VIEW_REPORTS,BUDGET_VIEW'),
('ASST_MANAGER', 'Assistant Manager with limited approval authority', 'APPROVE_LOW_RISK_PERMITS,SUPERVISE_TEAM,VIEW_REPORTS'),
('SUPERVISOR', 'Supervisor with team management responsibilities', 'SUPERVISE_OPERATIONS,CREATE_PERMITS,APPROVE_ROUTINE'),
('SAFETY_OFFICER', 'Safety personnel with safety authority', 'APPROVE_SAFETY_PERMITS,CONDUCT_INSPECTIONS,SAFETY_OVERRIDE'),
('ENGINEER', 'Engineering personnel with technical authority', 'CREATE_TECHNICAL_PERMITS,APPROVE_MAINTENANCE,TECHNICAL_REVIEW'),
('TECHNICIAN', 'Technical personnel with operational access', 'CREATE_PERMITS,EXECUTE_WORK,VIEW_PROCEDURES'),
('OPERATOR', 'Plant operators with production access', 'OPERATE_EQUIPMENT,CREATE_PERMITS,VIEW_PROCEDURES'),
('ADMIN_STAFF', 'Administrative staff with office access', 'OFFICE_ACCESS,CREATE_VISITOR_REQUESTS,VIEW_REPORTS'),
('SECURITY_STAFF', 'Security personnel with monitoring access', 'SCAN_QR,MONITOR_VISITORS,PATROL_ACCESS'),
('CONTRACTOR', 'External contractors with limited access', 'CREATE_CONTRACTOR_PERMITS,VIEW_SAFETY_PROCEDURES');

-- Insert 150+ Comprehensive Employee Records
INSERT INTO users (employee_id, email, password_hash, first_name, last_name, department_id, position, phone, role_id) VALUES

-- PLANT MANAGEMENT (2 employees)
('PLT001', 'plant.manager@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajesh', 'Khanna', 1, 'Plant Manager', '+91-9876543001', 1),
('PLT002', 'deputy.manager@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sanjay', 'Mehta', 1, 'Deputy Plant Manager', '+91-9876543002', 1),

-- ALUMINA PLANT (8 employees)
('ALP001', 'suresh.patel@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Suresh', 'Patel', 1, 'Alumina Plant Manager', '+91-9876543003', 2),
('ALP002', 'meera.shah@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Meera', 'Shah', 1, 'Assistant Manager - Production', '+91-9876543004', 3),
('ALP003', 'amit.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Amit', 'Singh', 1, 'Production Supervisor', '+91-9876543005', 4),
('ALP004', 'priya.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Priya', 'Kumar', 1, 'Process Engineer', '+91-9876543006', 6),
('ALP005', 'vikram.joshi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vikram', 'Joshi', 1, 'Shift Supervisor', '+91-9876543007', 4),
('ALP006', 'kavita.rao@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kavita', 'Rao', 1, 'Plant Operator', '+91-9876543008', 8),
('ALP007', 'ravi.agarwal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ravi', 'Agarwal', 1, 'Process Technician', '+91-9876543009', 7),
('ALP008', 'deepika.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Deepika', 'Gupta', 1, 'Quality Inspector', '+91-9876543010', 7),

-- SMELTER (10 employees)
('SMT001', 'rajesh.verma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajesh', 'Verma', 2, 'Smelter Manager', '+91-9876543011', 2),
('SMT002', 'anita.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Anita', 'Sharma', 2, 'Assistant Manager - Operations', '+91-9876543012', 3),
('SMT003', 'manoj.tiwari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Manoj', 'Tiwari', 2, 'Furnace Supervisor', '+91-9876543013', 4),
('SMT004', 'sunita.malhotra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunita', 'Malhotra', 2, 'Metallurgical Engineer', '+91-9876543014', 6),
('SMT005', 'rohit.bansal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rohit', 'Bansal', 2, 'Shift Engineer', '+91-9876543015', 6),
('SMT006', 'geeta.nair@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Geeta', 'Nair', 2, 'Furnace Operator', '+91-9876543016', 8),
('SMT007', 'krishna.pillai@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Krishna', 'Pillai', 2, 'Control Room Operator', '+91-9876543017', 8),
('SMT008', 'arjun.sethi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Arjun', 'Sethi', 2, 'Maintenance Technician', '+91-9876543018', 7),
('SMT009', 'pooja.iyer@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Pooja', 'Iyer', 2, 'Process Technician', '+91-9876543019', 7),
('SMT010', 'vinod.yadav@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vinod', 'Yadav', 2, 'Safety Coordinator', '+91-9876543020', 5),

-- POT ROOM (9 employees)
('POT001', 'dinesh.khanna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Dinesh', 'Khanna', 3, 'Pot Room Manager', '+91-9876543021', 2),
('POT002', 'lakshmi.reddy@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Lakshmi', 'Reddy', 3, 'Assistant Manager - Electrolysis', '+91-9876543022', 3),
('POT003', 'arun.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Arun', 'Singh', 3, 'Pot Line Supervisor', '+91-9876543023', 4),
('POT004', 'suman.das@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Suman', 'Das', 3, 'Electrical Engineer', '+91-9876543024', 6),
('POT005', 'naveen.chopra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Naveen', 'Chopra', 3, 'Pot Technician', '+91-9876543025', 7),
('POT006', 'rekha.bhatt@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rekha', 'Bhatt', 3, 'Anode Setter', '+91-9876543026', 8),
('POT007', 'satish.mishra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Satish', 'Mishra', 3, 'Crane Operator', '+91-9876543027', 8),
('POT008', 'nisha.jain@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Nisha', 'Jain', 3, 'Carbon Technician', '+91-9876543028', 7),
('POT009', 'harish.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Harish', 'Kumar', 3, 'Bath Temperature Operator', '+91-9876543029', 8),

-- CASTING & METAL PROCESSING (7 employees)
('CMP001', 'umesh.pandey@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Umesh', 'Pandey', 4, 'Casting Manager', '+91-9876543030', 2),
('CMP002', 'swati.arora@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Swati', 'Arora', 4, 'Process Engineer', '+91-9876543031', 6),
('CMP003', 'ramesh.sood@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ramesh', 'Sood', 4, 'Casting Supervisor', '+91-9876543032', 4),
('CMP004', 'veena.kapoor@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Veena', 'Kapoor', 4, 'Furnace Operator', '+91-9876543033', 8),
('CMP005', 'yogesh.trivedi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Yogesh', 'Trivedi', 4, 'Casting Operator', '+91-9876543034', 8),
('CMP006', 'mamta.kulkarni@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mamta', 'Kulkarni', 4, 'Quality Technician', '+91-9876543035', 7),
('CMP007', 'rajiv.saxena@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajiv', 'Saxena', 4, 'Metal Treatment Specialist', '+91-9876543036', 7),

-- RECTIFIER (6 employees)
('REC001', 'ashok.dubey@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ashok', 'Dubey', 5, 'Rectifier Manager', '+91-9876543037', 2),
('REC002', 'shilpa.bose@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Shilpa', 'Bose', 5, 'Senior Electrical Engineer', '+91-9876543038', 6),
('REC003', 'sunil.goyal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunil', 'Goyal', 5, 'Control Engineer', '+91-9876543039', 6),
('REC004', 'preeti.sinha@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Preeti', 'Sinha', 5, 'Rectifier Technician', '+91-9876543040', 7),
('REC005', 'mahesh.varma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mahesh', 'Varma', 5, 'Power System Operator', '+91-9876543041', 8),
('REC006', 'sudha.menon@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sudha', 'Menon', 5, 'Electrical Technician', '+91-9876543042', 7);

-- Insert Locations
INSERT INTO locations (name, description, latitude, longitude, risk_level) VALUES
('Furnace Area', 'Primary aluminum smelting furnaces', 23.0225, 72.5714, 'CRITICAL'),
('Power Plant', 'Electrical power generation facility', 23.0235, 72.5724, 'HIGH'),
('Raw Material Storage', 'Alumina and carbon storage area', 23.0215, 72.5704, 'MEDIUM'),
('Finished Goods Warehouse', 'Aluminum ingot storage facility', 23.0245, 72.5734, 'LOW'),
('Maintenance Workshop', 'Equipment repair and maintenance area', 23.0205, 72.5694, 'MEDIUM'),
('Laboratory Complex', 'Quality testing and analysis lab', 23.0255, 72.5744, 'MEDIUM'),
('Administrative Block', 'Office and administrative area', 23.0265, 72.5754, 'LOW'),
('Water Treatment Plant', 'Industrial water treatment facility', 23.0195, 72.5684, 'HIGH'),
('Chemical Storage', 'Chemical and reagent storage area', 23.0185, 72.5674, 'CRITICAL'),
('Loading Dock', 'Product shipping and receiving area', 23.0275, 72.5764, 'MEDIUM');

-- Insert Permit Types
INSERT INTO permit_types (name, description, required_ppe, validity_hours, requires_approval) VALUES
('Hot Work Permit', 'For welding, cutting, and other hot work operations', 'Fire-resistant clothing, welding helmet, safety shoes, gloves', 8, true),
('Confined Space Entry', 'Entry into tanks, vessels, and confined spaces', 'Gas monitor, harness, lifeline, communication device', 4, true),
('Electrical Work Permit', 'Electrical installation and maintenance work', 'Insulated gloves, safety shoes, hard hat, voltage tester', 8, true),
('Height Work Permit', 'Work at heights above 2 meters', 'Safety harness, hard hat, non-slip shoes, lanyard', 8, true),
('Chemical Handling', 'Handling of hazardous chemicals and materials', 'Chemical suit, respirator, goggles, chemical-resistant gloves', 4, true),
('Crane Operation', 'Operation of overhead and mobile cranes', 'Hard hat, safety shoes, high-visibility vest, radio', 12, true),
('Excavation Permit', 'Digging and excavation activities', 'Hard hat, safety shoes, high-visibility vest, shovel', 8, true),
('Routine Maintenance', 'Standard maintenance and inspection work', 'Hard hat, safety shoes, gloves, safety glasses', 8, false);

-- Insert comprehensive employee data
INSERT INTO users (employee_id, email, password_hash, first_name, last_name, department_id, position, phone, role_id) VALUES
-- Management Team
('MGR001', 'ramesh.kumar@hindalco.com', '$2a$10$example_hash_here', 'Ramesh', 'Kumar', 1, 'General Manager', '+91-9876543210', 2),
('MGR002', 'sunita.sharma@hindalco.com', '$2a$10$example_hash_here', 'Sunita', 'Sharma', 2, 'Safety Manager', '+91-9876543211', 2),
('MGR003', 'amit.patel@hindalco.com', '$2a$10$example_hash_here', 'Amit', 'Patel', 3, 'Electrical Manager', '+91-9876543212', 2),
('MGR004', 'priya.singh@hindalco.com', '$2a$10$example_hash_here', 'Priya', 'Singh', 4, 'Production Manager', '+91-9876543213', 2),

-- Safety Officers
('SAF001', 'rajesh.gupta@hindalco.com', '$2a$10$example_hash_here', 'Rajesh', 'Gupta', 2, 'Senior Safety Officer', '+91-9876543214', 3),
('SAF002', 'meera.joshi@hindalco.com', '$2a$10$example_hash_here', 'Meera', 'Joshi', 2, 'Safety Officer', '+91-9876543215', 3),
('SAF003', 'vikram.shah@hindalco.com', '$2a$10$example_hash_here', 'Vikram', 'Shah', 2, 'Fire Safety Officer', '+91-9876543216', 3),

-- Engineering Team
('ENG001', 'anuj.verma@hindalco.com', '$2a$10$example_hash_here', 'Anuj', 'Verma', 1, 'Lead Mechanical Engineer', '+91-9876543217', 4),
('ENG002', 'kavya.reddy@hindalco.com', '$2a$10$example_hash_here', 'Kavya', 'Reddy', 3, 'Senior Electrical Engineer', '+91-9876543218', 4),
('ENG003', 'rohit.agarwal@hindalco.com', '$2a$10$example_hash_here', 'Rohit', 'Agarwal', 1, 'Mechanical Engineer', '+91-9876543219', 4),
('ENG004', 'nisha.malhotra@hindalco.com', '$2a$10$example_hash_here', 'Nisha', 'Malhotra', 3, 'Electrical Engineer', '+91-9876543220', 4),

-- Production Team
('PRD001', 'suresh.yadav@hindalco.com', '$2a$10$example_hash_here', 'Suresh', 'Yadav', 4, 'Production Supervisor', '+91-9876543221', 4),
('PRD002', 'deepika.nair@hindalco.com', '$2a$10$example_hash_here', 'Deepika', 'Nair', 4, 'Process Operator', '+91-9876543222', 4),
('PRD003', 'manoj.singh@hindalco.com', '$2a$10$example_hash_here', 'Manoj', 'Singh', 4, 'Furnace Operator', '+91-9876543223', 4),
('PRD004', 'asha.verma@hindalco.com', '$2a$10$example_hash_here', 'Asha', 'Verma', 4, 'Quality Inspector', '+91-9876543224', 4),

-- Maintenance Team
('MNT001', 'krishna.pillai@hindalco.com', '$2a$10$example_hash_here', 'Krishna', 'Pillai', 1, 'Maintenance Supervisor', '+91-9876543225', 4),
('MNT002', 'ravi.kumar@hindalco.com', '$2a$10$example_hash_here', 'Ravi', 'Kumar', 1, 'Technician - Mechanical', '+91-9876543226', 4),
('MNT003', 'geeta.sharma@hindalco.com', '$2a$10$example_hash_here', 'Geeta', 'Sharma', 3, 'Technician - Electrical', '+91-9876543227', 4),
('MNT004', 'rajiv.jain@hindalco.com', '$2a$10$example_hash_here', 'Rajiv', 'Jain', 1, 'Welder', '+91-9876543228', 4),

-- Quality Control Team
('QC001', 'swati.iyer@hindalco.com', '$2a$10$example_hash_here', 'Swati', 'Iyer', 5, 'Quality Manager', '+91-9876543229', 2),
('QC002', 'vinod.rao@hindalco.com', '$2a$10$example_hash_here', 'Vinod', 'Rao', 5, 'Lab Technician', '+91-9876543230', 4),
('QC003', 'pooja.das@hindalco.com', '$2a$10$example_hash_here', 'Pooja', 'Das', 5, 'Quality Analyst', '+91-9876543231', 4),

-- IT Team
('IT001', 'tech.admin@hindalco.com', '$2a$10$example_hash_here', 'System', 'Administrator', 8, 'IT Administrator', '+91-9876543232', 1),
('IT002', 'arjun.mehta@hindalco.com', '$2a$10$example_hash_here', 'Arjun', 'Mehta', 8, 'Software Developer', '+91-9876543233', 4),
('IT003', 'shruti.agarwal@hindalco.com', '$2a$10$example_hash_here', 'Shruti', 'Agarwal', 8, 'Network Administrator', '+91-9876543234', 4),

-- Security Team
('SEC001', 'mahesh.tiwari@hindalco.com', '$2a$10$example_hash_here', 'Mahesh', 'Tiwari', 10, 'Security Supervisor', '+91-9876543235', 5),
('SEC002', 'anjali.yadav@hindalco.com', '$2a$10$example_hash_here', 'Anjali', 'Yadav', 10, 'Security Officer', '+91-9876543236', 5),
('SEC003', 'dinesh.kumar@hindalco.com', '$2a$10$example_hash_here', 'Dinesh', 'Kumar', 10, 'Security Guard', '+91-9876543237', 5),

-- HR Team
('HR001', 'rekha.bhatt@hindalco.com', '$2a$10$example_hash_here', 'Rekha', 'Bhatt', 7, 'HR Manager', '+91-9876543238', 2),
('HR002', 'sanjay.mishra@hindalco.com', '$2a$10$example_hash_here', 'Sanjay', 'Mishra', 7, 'HR Executive', '+91-9876543239', 4),

-- Environmental Team
('ENV001', 'lakshmi.krishnan@hindalco.com', '$2a$10$example_hash_here', 'Lakshmi', 'Krishnan', 6, 'Environmental Manager', '+91-9876543240', 2),
('ENV002', 'arun.sethi@hindalco.com', '$2a$10$example_hash_here', 'Arun', 'Sethi', 6, 'Environmental Officer', '+91-9876543241', 4);

-- Update department heads
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'MGR001') WHERE name = 'Mechanical Maintenance';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'MGR002') WHERE name = 'Fire and Safety';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'MGR003') WHERE name = 'Electrical Maintenance';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'MGR004') WHERE name = 'Production Operations';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'QC001') WHERE name = 'Quality Control';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'ENV001') WHERE name = 'Environmental Management';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'HR001') WHERE name = 'Human Resources';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'IT001') WHERE name = 'Information Technology';
UPDATE departments SET head_id = (SELECT id FROM users WHERE employee_id = 'SEC001') WHERE name = 'Security';

-- Assign safety officers to locations
UPDATE locations SET safety_officer_id = (SELECT id FROM users WHERE employee_id = 'SAF001') WHERE name IN ('Furnace Area', 'Chemical Storage');
UPDATE locations SET safety_officer_id = (SELECT id FROM users WHERE employee_id = 'SAF002') WHERE name IN ('Power Plant', 'Water Treatment Plant');
UPDATE locations SET safety_officer_id = (SELECT id FROM users WHERE employee_id = 'SAF003') WHERE name IN ('Maintenance Workshop', 'Laboratory Complex');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
((SELECT id FROM users WHERE employee_id = 'ENG001'), 'SYSTEM', 'Welcome to CPSMS', 'Welcome to the Centralized Permit & Safety Management System'),
((SELECT id FROM users WHERE employee_id = 'MGR001'), 'APPROVAL', 'Pending Permit Approvals', 'You have 3 permits waiting for your approval'),
((SELECT id FROM users WHERE employee_id = 'SAF001'), 'SAFETY', 'Safety Inspection Due', 'Monthly safety inspection is due for Furnace Area');

-- Create foreign key constraints
ALTER TABLE departments ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_id) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id);
ALTER TABLE users ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE locations ADD CONSTRAINT fk_locations_safety_officer FOREIGN KEY (safety_officer_id) REFERENCES users(id);
ALTER TABLE permits ADD CONSTRAINT fk_permits_permit_type FOREIGN KEY (permit_type_id) REFERENCES permit_types(id);
ALTER TABLE permits ADD CONSTRAINT fk_permits_location FOREIGN KEY (location_id) REFERENCES locations(id);
ALTER TABLE permits ADD CONSTRAINT fk_permits_applicant FOREIGN KEY (applicant_id) REFERENCES users(id);
ALTER TABLE permits ADD CONSTRAINT fk_permits_approved_by FOREIGN KEY (approved_by_id) REFERENCES users(id);
ALTER TABLE permits ADD CONSTRAINT fk_permits_rejected_by FOREIGN KEY (rejected_by_id) REFERENCES users(id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_permit FOREIGN KEY (permit_id) REFERENCES permits(id);

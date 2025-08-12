-- V3__Additional_Employees.sql
-- Continuation of employee data - Rolling Mill through Administration

-- ROLLING MILL (8 employees)
INSERT INTO users (employee_id, email, password_hash, first_name, last_name, department_id, position, phone, role_id) VALUES
('RML001', 'ajay.desai@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ajay', 'Desai', 6, 'Rolling Mill Manager', '+91-9876543043', 2),
('RML002', 'kiran.bhardwaj@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kiran', 'Bhardwaj', 6, 'Production Engineer', '+91-9876543044', 6),
('RML003', 'raman.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Raman', 'Gupta', 6, 'Mill Supervisor', '+91-9876543045', 4),
('RML004', 'sarita.ahlawat@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sarita', 'Ahlawat', 6, 'Rolling Mill Operator', '+91-9876543046', 8),
('RML005', 'vinay.tandon@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vinay', 'Tandon', 6, 'Coiler Operator', '+91-9876543047', 8),
('RML006', 'deepa.kohli@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Deepa', 'Kohli', 6, 'Quality Inspector', '+91-9876543048', 7),
('RML007', 'mukesh.saini@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mukesh', 'Saini', 6, 'Mill Technician', '+91-9876543049', 7),
('RML008', 'anju.mathur@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Anju', 'Mathur', 6, 'Packaging Supervisor', '+91-9876543050', 4),

-- EXTRUSION PLANT (7 employees)
('EXT001', 'prakash.khanna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Prakash', 'Khanna', 7, 'Extrusion Manager', '+91-9876543051', 2),
('EXT002', 'sunita.dutta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunita', 'Dutta', 7, 'Process Engineer', '+91-9876543052', 6),
('EXT003', 'raju.tiwari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Raju', 'Tiwari', 7, 'Extrusion Supervisor', '+91-9876543053', 4),
('EXT004', 'meenakshi.pal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Meenakshi', 'Pal', 7, 'Press Operator', '+91-9876543054', 8),
('EXT005', 'ashish.bansal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ashish', 'Bansal', 7, 'Die Technician', '+91-9876543055', 7),
('EXT006', 'shweta.goel@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Shweta', 'Goel', 7, 'Finishing Operator', '+91-9876543056', 8),
('EXT007', 'kamal.aggarwal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kamal', 'Aggarwal', 7, 'Heat Treatment Operator', '+91-9876543057', 8),

-- SECONDARY ALUMINIUM & RECYCLING (6 employees)
('SAR001', 'gopi.krishna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Gopi', 'Krishna', 8, 'Recycling Manager', '+91-9876543058', 2),
('SAR002', 'vandana.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vandana', 'Singh', 8, 'Process Engineer', '+91-9876543059', 6),
('SAR003', 'mohan.lal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mohan', 'Lal', 8, 'Melting Supervisor', '+91-9876543060', 4),
('SAR004', 'poonam.mittal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Poonam', 'Mittal', 8, 'Recycling Operator', '+91-9876543061', 8),
('SAR005', 'rajesh.rana@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajesh', 'Rana', 8, 'Sorting Technician', '+91-9876543062', 7),
('SAR006', 'garima.chawla@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Garima', 'Chawla', 8, 'Environmental Technician', '+91-9876543063', 7),

-- MAINTENANCE & ENGINEERING (10 employees)
('MEN001', 'tribhuvan.das@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Tribhuvan', 'Das', 9, 'Chief Engineer', '+91-9876543064', 2),
('MEN002', 'renu.khanna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Renu', 'Khanna', 9, 'Mechanical Engineer', '+91-9876543065', 6),
('MEN003', 'bal.krishna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bal', 'Krishna', 9, 'Electrical Engineer', '+91-9876543066', 6),
('MEN004', 'madhuri.jain@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Madhuri', 'Jain', 9, 'Instrumentation Engineer', '+91-9876543067', 6),
('MEN005', 'satpal.yadav@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Satpal', 'Yadav', 9, 'Maintenance Supervisor', '+91-9876543068', 4),
('MEN006', 'seema.agarwal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Seema', 'Agarwal', 9, 'Planning Engineer', '+91-9876543069', 6),
('MEN007', 'krishan.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Krishan', 'Kumar', 9, 'Mechanical Technician', '+91-9876543070', 7),
('MEN008', 'priti.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Priti', 'Sharma', 9, 'Electrical Technician', '+91-9876543071', 7),
('MEN009', 'bhupesh.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bhupesh', 'Gupta', 9, 'Welder', '+91-9876543072', 7),
('MEN010', 'kaveri.patil@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kaveri', 'Patil', 9, 'Fitter', '+91-9876543073', 7),

-- HVAC (5 employees)
('HVA001', 'surinder.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Surinder', 'Singh', 10, 'HVAC Manager', '+91-9876543074', 2),
('HVA002', 'asha.malhotra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Asha', 'Malhotra', 10, 'HVAC Engineer', '+91-9876543075', 6),
('HVA003', 'rajender.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajender', 'Kumar', 10, 'AC Technician', '+91-9876543076', 7),
('HVA004', 'sushma.rani@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sushma', 'Rani', 10, 'Ventilation Specialist', '+91-9876543077', 7),
('HVA005', 'deepak.chauhan@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Deepak', 'Chauhan', 10, 'Refrigeration Technician', '+91-9876543078', 7),

-- UTILITIES & PLANT SERVICES (8 employees)
('UPS001', 'om.prakash@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Om', 'Prakash', 11, 'Utilities Manager', '+91-9876543079', 2),
('UPS002', 'bharti.saxena@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bharti', 'Saxena', 11, 'Power Engineer', '+91-9876543080', 6),
('UPS003', 'suresh.chand@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Suresh', 'Chand', 11, 'Water Treatment Supervisor', '+91-9876543081', 4),
('UPS004', 'manju.verma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Manju', 'Verma', 11, 'Boiler Operator', '+91-9876543082', 8),
('UPS005', 'narayan.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Narayan', 'Singh', 11, 'Compressor Operator', '+91-9876543083', 8),
('UPS006', 'pushpa.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Pushpa', 'Devi', 11, 'Utility Technician', '+91-9876543084', 7),
('UPS007', 'jaswant.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jaswant', 'Singh', 11, 'DG Operator', '+91-9876543085', 8),
('UPS008', 'kavita.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kavita', 'Sharma', 11, 'Steam Plant Operator', '+91-9876543086', 8),

-- BUILDING DEPARTMENT (5 employees)
('BLD001', 'ram.narayan@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ram', 'Narayan', 12, 'Civil Engineer', '+91-9876543087', 6),
('BLD002', 'usha.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Usha', 'Devi', 12, 'Building Supervisor', '+91-9876543088', 4),
('BLD003', 'abdul.rahman@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Abdul', 'Rahman', 12, 'Mason', '+91-9876543089', 7),
('BLD004', 'sunita.kumari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunita', 'Kumari', 12, 'Carpenter', '+91-9876543090', 7),
('BLD005', 'raj.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Raj', 'Kumar', 12, 'Painter', '+91-9876543091', 7),

-- QUALITY, LAB & TECHNICAL SERVICES (8 employees)
('QLT001', 'dr.rajeev.mehta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Dr. Rajeev', 'Mehta', 13, 'Chief Quality Officer', '+91-9876543092', 2),
('QLT002', 'smriti.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Smriti', 'Singh', 13, 'Quality Manager', '+91-9876543093', 3),
('QLT003', 'vineet.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vineet', 'Kumar', 13, 'Lab Manager', '+91-9876543094', 3),
('QLT004', 'neetu.agarwal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Neetu', 'Agarwal', 13, 'Senior Lab Analyst', '+91-9876543095', 7),
('QLT005', 'krishna.murthy@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Krishna', 'Murthy', 13, 'Metallurgist', '+91-9876543096', 6),
('QLT006', 'nidhi.rastogi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Nidhi', 'Rastogi', 13, 'Chemical Analyst', '+91-9876543097', 7),
('QLT007', 'rohit.malhotra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rohit', 'Malhotra', 13, 'Spectroscopy Technician', '+91-9876543098', 7),
('QLT008', 'swati.bansal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Swati', 'Bansal', 13, 'Quality Inspector', '+91-9876543099', 7),

-- FIRE & SAFETY (7 employees)
('FIR001', 'sanjeev.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sanjeev', 'Kumar', 14, 'Chief Safety Officer', '+91-9876543100', 2),
('FIR002', 'anita.rani@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Anita', 'Rani', 14, 'Fire Safety Manager', '+91-9876543101', 3),
('FIR003', 'mukesh.yadav@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mukesh', 'Yadav', 14, 'Safety Officer', '+91-9876543102', 5),
('FIR004', 'kavita.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kavita', 'Gupta', 14, 'Fire Officer', '+91-9876543103', 5),
('FIR005', 'ramesh.chandra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ramesh', 'Chandra', 14, 'Safety Inspector', '+91-9876543104', 5),
('FIR006', 'meera.chopra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Meera', 'Chopra', 14, 'Emergency Response Coordinator', '+91-9876543105', 5),
('FIR007', 'sudhir.pathak@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sudhir', 'Pathak', 14, 'First Aid Coordinator', '+91-9876543106', 5),

-- ENVIRONMENT (SHE) (6 employees)
('ENV001', 'dr.rakesh.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Dr. Rakesh', 'Sharma', 15, 'Chief Environmental Officer', '+91-9876543107', 2),
('ENV002', 'sunita.mishra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunita', 'Mishra', 15, 'Environmental Manager', '+91-9876543108', 3),
('ENV003', 'ravinder.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ravinder', 'Singh', 15, 'Environmental Engineer', '+91-9876543109', 6),
('ENV004', 'pooja.malik@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Pooja', 'Malik', 15, 'Pollution Control Officer', '+91-9876543110', 6),
('ENV005', 'vijay.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vijay', 'Kumar', 15, 'Waste Management Supervisor', '+91-9876543111', 4),
('ENV006', 'nisha.arora@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Nisha', 'Arora', 15, 'Environmental Analyst', '+91-9876543112', 7),

-- TRAINING CENTRE (4 employees)
('TRN001', 'prof.ajit.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Prof. Ajit', 'Singh', 16, 'Training Manager', '+91-9876543113', 2),
('TRN002', 'reena.kapoor@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Reena', 'Kapoor', 16, 'Senior Trainer', '+91-9876543114', 6),
('TRN003', 'satish.agarwal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Satish', 'Agarwal', 16, 'Technical Trainer', '+91-9876543115', 6),
('TRN004', 'radha.rani@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Radha', 'Rani', 16, 'Training Coordinator', '+91-9876543116', 9),

-- IT DEPARTMENT (7 employees)
('ITD001', 'anil.khanna@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Anil', 'Khanna', 17, 'IT Manager', '+91-9876543117', 2),
('ITD002', 'priyanka.jain@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Priyanka', 'Jain', 17, 'System Administrator', '+91-9876543118', 6),
('ITD003', 'rahul.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rahul', 'Gupta', 17, 'Network Engineer', '+91-9876543119', 6),
('ITD004', 'shalini.verma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Shalini', 'Verma', 17, 'Software Developer', '+91-9876543120', 6),
('ITD005', 'naveen.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Naveen', 'Kumar', 17, 'Database Administrator', '+91-9876543121', 6),
('ITD006', 'geeta.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Geeta', 'Sharma', 17, 'Help Desk Support', '+91-9876543122', 7),
('ITD007', 'mohit.sachdeva@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mohit', 'Sachdeva', 17, 'Cybersecurity Analyst', '+91-9876543123', 6),

-- SECURITY (6 employees)
('SEC001', 'jasbir.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jasbir', 'Singh', 18, 'Security Manager', '+91-9876543124', 2),
('SEC002', 'mamta.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mamta', 'Devi', 18, 'Security Supervisor', '+91-9876543125', 4),
('SEC003', 'harpal.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Harpal', 'Singh', 18, 'Security Officer', '+91-9876543126', 10),
('SEC004', 'kiran.bala@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kiran', 'Bala', 18, 'Security Guard', '+91-9876543127', 10),
('SEC005', 'sukhdev.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sukhdev', 'Singh', 18, 'Gate Security Officer', '+91-9876543128', 10),
('SEC006', 'rajni.kumari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajni', 'Kumari', 18, 'CCTV Operator', '+91-9876543129', 10),

-- LOGISTICS & SUPPLY CHAIN (7 employees)
('LOG001', 'narinder.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Narinder', 'Kumar', 19, 'Logistics Manager', '+91-9876543130', 2),
('LOG002', 'sarita.bhardwaj@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sarita', 'Bhardwaj', 19, 'Supply Chain Coordinator', '+91-9876543131', 3),
('LOG003', 'harbans.lal@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Harbans', 'Lal', 19, 'Warehouse Supervisor', '+91-9876543132', 4),
('LOG004', 'anju.kumari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Anju', 'Kumari', 19, 'Inventory Controller', '+91-9876543133', 7),
('LOG005', 'gurbachan.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Gurbachan', 'Singh', 19, 'Transport Supervisor', '+91-9876543134', 4),
('LOG006', 'paramjit.kaur@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Paramjit', 'Kaur', 19, 'Dispatch Executive', '+91-9876543135', 7),
('LOG007', 'joginder.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Joginder', 'Singh', 19, 'Crane Operator', '+91-9876543136', 8),

-- STORE (5 employees)
('STO001', 'bharat.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bharat', 'Singh', 20, 'Store Manager', '+91-9876543137', 2),
('STO002', 'kusum.lata@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kusum', 'Lata', 20, 'Store Keeper', '+91-9876543138', 7),
('STO003', 'rajbir.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rajbir', 'Singh', 20, 'Material Controller', '+91-9876543139', 7),
('STO004', 'sunita.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sunita', 'Devi', 20, 'Spare Parts Assistant', '+91-9876543140', 7),
('STO005', 'kuldeep.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kuldeep', 'Singh', 20, 'Tool Room Attendant', '+91-9876543141', 7),

-- PROCUREMENT (4 employees)
('PRO001', 'jagdish.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jagdish', 'Kumar', 21, 'Procurement Manager', '+91-9876543142', 2),
('PRO002', 'shanti.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Shanti', 'Devi', 21, 'Purchase Officer', '+91-9876543143', 9),
('PRO003', 'sukhwinder.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sukhwinder', 'Singh', 21, 'Vendor Development Officer', '+91-9876543144', 9),
('PRO004', 'reena.sharma@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Reena', 'Sharma', 21, 'Purchase Assistant', '+91-9876543145', 9),

-- ADMINISTRATION (5 employees)
('ADM001', 'vinod.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Vinod', 'Kumar', 22, 'Admin Manager', '+91-9876543146', 2),
('ADM002', 'pushpa.kumari@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Pushpa', 'Kumari', 22, 'HR Officer', '+91-9876543147', 9),
('ADM003', 'jagjit.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jagjit', 'Singh', 22, 'Office Superintendent', '+91-9876543148', 9),
('ADM004', 'kamla.devi@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Kamla', 'Devi', 22, 'Receptionist', '+91-9876543149', 9),
('ADM005', 'balwinder.singh@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Balwinder', 'Singh', 22, 'Office Assistant', '+91-9876543150', 9),

-- ACCOUNTING & FINANCE (5 employees)
('FIN001', 'ca.suresh.kumar@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'CA Suresh', 'Kumar', 23, 'Finance Manager', '+91-9876543151', 2),
('FIN002', 'neelam.gupta@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Neelam', 'Gupta', 23, 'Accounts Officer', '+91-9876543152', 9),
('FIN003', 'ravi.prakash@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ravi', 'Prakash', 23, 'Cost Accountant', '+91-9876543153', 9),
('FIN004', 'seema.rani@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Seema', 'Rani', 23, 'Accounts Assistant', '+91-9876543154', 9),
('FIN005', 'rakesh.chandra@hindalco.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Rakesh', 'Chandra', 23, 'Payroll Executive', '+91-9876543155', 9);

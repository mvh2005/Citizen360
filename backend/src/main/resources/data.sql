-- =============================================
-- Citizen360 — Seed Data
-- =============================================
-- Passwords are BCrypt-encoded: "password123"
-- $2a$10$gsYprNdHFvnnNyzFtHJ5/.Die7MW35aHXmVSyvBeWzd0qYbhy3WMe

-- Insert users only if the table is empty
INSERT INTO users (full_name, email, password, role, approved, created_at)
SELECT 'Priya Sharma', 'priya@citizen360.com', '$2a$10$gsYprNdHFvnnNyzFtHJ5/.Die7MW35aHXmVSyvBeWzd0qYbhy3WMe', 'CITIZEN', true, NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'priya@citizen360.com');

INSERT INTO users (full_name, email, password, role, approved, created_at)
SELECT 'Rajeev Menon', 'rajeev@citizen360.com', '$2a$10$gsYprNdHFvnnNyzFtHJ5/.Die7MW35aHXmVSyvBeWzd0qYbhy3WMe', 'OFFICER', true, NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'rajeev@citizen360.com');

INSERT INTO users (full_name, email, password, role, approved, created_at)
SELECT 'Admin User', 'admin@citizen360.com', '$2a$10$gsYprNdHFvnnNyzFtHJ5/.Die7MW35aHXmVSyvBeWzd0qYbhy3WMe', 'ADMIN', true, NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@citizen360.com');

-- Insert sample complaints only if table is empty
INSERT INTO complaints (complaint_id, title, description, category, priority, status, location, latitude, longitude, user_id, assigned_officer_id, created_at, updated_at)
SELECT 'CT-2087', 'Pothole on MG Road', 'Large pothole near sector 42 intersection causing traffic issues.', 'Road Damage', 'HIGH', 'IN_PROGRESS', 'Sector 42, MG Road, New Delhi', 28.5355, 77.3910,
       (SELECT id FROM users WHERE email = 'priya@citizen360.com'),
       (SELECT id FROM users WHERE email = 'rajeev@citizen360.com'),
       NOW(), NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM complaints WHERE complaint_id = 'CT-2087');

INSERT INTO complaints (complaint_id, title, description, category, priority, status, location, latitude, longitude, user_id, created_at, updated_at)
SELECT 'CT-2064', 'Overflowing bin near park', 'Garbage bin at central park entrance has been overflowing for 3 days.', 'Garbage', 'MEDIUM', 'RESOLVED', 'Central Park, Block B', 28.5400, 77.3850,
       (SELECT id FROM users WHERE email = 'priya@citizen360.com'),
       NOW(), NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM complaints WHERE complaint_id = 'CT-2064');

INSERT INTO complaints (complaint_id, title, description, category, priority, status, location, latitude, longitude, user_id, created_at, updated_at)
SELECT 'CT-2041', 'Streetlight not working', 'Street light on lane 5 has been off for a week. Safety concern at night.', 'Street Light', 'MEDIUM', 'ASSIGNED', 'Lane 5, Sector 21', 28.5320, 77.3920,
       (SELECT id FROM users WHERE email = 'priya@citizen360.com'),
       NOW(), NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM complaints WHERE complaint_id = 'CT-2041');

INSERT INTO complaints (complaint_id, title, description, category, priority, status, location, latitude, longitude, user_id, created_at, updated_at)
SELECT 'CT-2019', 'Water leakage on Block C', 'Continuous water leakage from main pipe causing road flooding.', 'Water Leakage', 'HIGH', 'PENDING', 'Block C, Main Road', 28.5380, 77.3870,
       (SELECT id FROM users WHERE email = 'priya@citizen360.com'),
       NOW(), NOW()
FROM dual WHERE NOT EXISTS (SELECT 1 FROM complaints WHERE complaint_id = 'CT-2019');

-- Timeline entries for CT-2087
INSERT INTO complaint_timeline (complaint_id, title, description, timestamp)
SELECT c.id, 'Complaint Submitted', 'Your complaint has been received and is being reviewed.', DATE_SUB(NOW(), INTERVAL 5 DAY)
FROM complaints c WHERE c.complaint_id = 'CT-2087'
  AND NOT EXISTS (SELECT 1 FROM complaint_timeline t WHERE t.complaint_id = c.id AND t.title = 'Complaint Submitted');

INSERT INTO complaint_timeline (complaint_id, title, description, timestamp)
SELECT c.id, 'Assigned to Department', 'Routed to Roads Department for resolution.', DATE_SUB(NOW(), INTERVAL 5 DAY)
FROM complaints c WHERE c.complaint_id = 'CT-2087'
  AND NOT EXISTS (SELECT 1 FROM complaint_timeline t WHERE t.complaint_id = c.id AND t.title = 'Assigned to Department');

INSERT INTO complaint_timeline (complaint_id, title, description, timestamp)
SELECT c.id, 'Officer Accepted', 'Officer Rajeev Menon has accepted the complaint.', DATE_SUB(NOW(), INTERVAL 4 DAY)
FROM complaints c WHERE c.complaint_id = 'CT-2087'
  AND NOT EXISTS (SELECT 1 FROM complaint_timeline t WHERE t.complaint_id = c.id AND t.title = 'Officer Accepted');

INSERT INTO complaint_timeline (complaint_id, title, description, timestamp)
SELECT c.id, 'Work Started', 'Repair work has begun at the location.', DATE_SUB(NOW(), INTERVAL 3 DAY)
FROM complaints c WHERE c.complaint_id = 'CT-2087'
  AND NOT EXISTS (SELECT 1 FROM complaint_timeline t WHERE t.complaint_id = c.id AND t.title = 'Work Started');

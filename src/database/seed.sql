-- Cloud Student Services - Seed Data for PostgreSQL
-- Note: Passwords are automatically hashed via bcrypt on server auto-init.
-- Demo Admin: admin@example.com / admin123
-- Demo Student: student@example.com / student123

-- Sample Courses
INSERT INTO courses (course_code, course_name, credit_hours, instructor, available_seats, status)
VALUES 
    ('CS101', 'Introduction to Programming', 3, 'Dr. Sarah Connor', 25, 'AVAILABLE'),
    ('DB201', 'Database Systems & Cloud SQL', 4, 'Prof. Robert Lang', 18, 'AVAILABLE'),
    ('NET202', 'Computer Networks & Security', 3, 'Dr. Michael Chang', 30, 'AVAILABLE'),
    ('WEB203', 'Web Development & Modern APIs', 3, 'Eng. Mona Ahmed', 0, 'UNAVAILABLE'),
    ('CLOUD301', 'Cloud Computing & PaaS Architecture', 4, 'Dr. Alex Vance', 15, 'AVAILABLE')
ON CONFLICT (course_code) DO NOTHING;

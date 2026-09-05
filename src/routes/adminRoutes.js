const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Apply Admin Middleware
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// GET /api/admin/dashboard - Admin Dashboard Metrics & Recent Requests
router.get('/dashboard', async (req, res) => {
    try {
        const studentsCountRes = await db.query('SELECT COUNT(*) FROM students');
        const coursesCountRes = await db.query('SELECT COUNT(*) FROM courses');
        const pendingCountRes = await db.query("SELECT COUNT(*) FROM registration_requests WHERE status = 'PENDING'");
        const approvedCountRes = await db.query("SELECT COUNT(*) FROM registration_requests WHERE status = 'APPROVED'");

        const recentRequestsRes = await db.query(`
            SELECT r.id, r.status, r.requested_at, r.processed_at,
                   s.full_name as student_name, s.student_number,
                   c.course_code, c.course_name
            FROM registration_requests r
            JOIN students s ON r.student_id = s.id
            JOIN courses c ON r.course_id = c.id
            ORDER BY r.requested_at DESC
            LIMIT 6
        `);

        return res.json({
            success: true,
            summary: {
                totalStudents: parseInt(studentsCountRes.rows[0].count, 10),
                totalCourses: parseInt(coursesCountRes.rows[0].count, 10),
                pendingRequests: parseInt(pendingCountRes.rows[0].count, 10),
                approvedRequests: parseInt(approvedCountRes.rows[0].count, 10)
            },
            recentRequests: recentRequestsRes.rows
        });
    } catch (err) {
        console.error('[Admin Dashboard Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch admin metrics.'
        });
    }
});

// --- STUDENT MANAGEMENT ---

// GET /api/admin/students - List Students
router.get('/students', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students ORDER BY student_number ASC');
        return res.json({
            success: true,
            students: result.rows
        });
    } catch (err) {
        console.error('[Admin Get Students Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch students list.'
        });
    }
});

// POST /api/admin/students - Create Student
router.post('/students', async (req, res) => {
    try {
        const { studentNumber, fullName, email, department, level, password } = req.body;

        if (!studentNumber || !fullName || !email || !department || !level || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        // Check duplicate email
        const existingEmail = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists.'
            });
        }

        // Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create User Account
        const userRes = await db.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
            [email.trim().toLowerCase(), passwordHash, 'STUDENT']
        );
        const userId = userRes.rows[0].id;

        // Create Student Profile
        const studentRes = await db.query(
            `INSERT INTO students (user_id, student_number, full_name, email, department, level)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, studentNumber.trim(), fullName.trim(), email.trim().toLowerCase(), department.trim(), level.trim()]
        );

        return res.json({
            success: true,
            message: 'Student added successfully.',
            student: studentRes.rows[0]
        });

    } catch (err) {
        console.error('[Admin Create Student Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to create student. Check duplicate student ID or email.'
        });
    }
});

// PUT /api/admin/students/:id - Update Student
router.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { studentNumber, fullName, email, department, level } = req.body;

        const updateRes = await db.query(
            `UPDATE students 
             SET student_number = $1, full_name = $2, email = $3, department = $4, level = $5
             WHERE id = $6 RETURNING *`,
            [studentNumber, fullName, email, department, level, id]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Student updated successfully.',
            student: updateRes.rows[0]
        });
    } catch (err) {
        console.error('[Admin Update Student Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to update student.'
        });
    }
});

// DELETE /api/admin/students/:id - Delete Student
router.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM students WHERE id = $1', [id]);
        return res.json({
            success: true,
            message: 'Student deleted successfully.'
        });
    } catch (err) {
        console.error('[Admin Delete Student Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete student.'
        });
    }
});

// --- COURSE MANAGEMENT ---

// POST /api/admin/courses - Create Course
router.post('/courses', async (req, res) => {
    try {
        const { courseCode, courseName, creditHours, instructor, availableSeats, status } = req.body;

        if (!courseCode || !courseName || !creditHours || !instructor) {
            return res.status(400).json({
                success: false,
                message: 'Please complete all required course fields.'
            });
        }

        const insertRes = await db.query(
            `INSERT INTO courses (course_code, course_name, credit_hours, instructor, available_seats, status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                courseCode.trim().toUpperCase(),
                courseName.trim(),
                parseInt(creditHours, 10),
                instructor.trim(),
                parseInt(availableSeats || 0, 10),
                status || 'AVAILABLE'
            ]
        );

        return res.json({
            success: true,
            message: 'Course added successfully.',
            course: insertRes.rows[0]
        });
    } catch (err) {
        console.error('[Admin Create Course Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to create course. Ensure course code is unique.'
        });
    }
});

// PUT /api/admin/courses/:id - Update Course
router.put('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { courseCode, courseName, creditHours, instructor, availableSeats, status } = req.body;

        const updateRes = await db.query(
            `UPDATE courses 
             SET course_code = $1, course_name = $2, credit_hours = $3, instructor = $4, available_seats = $5, status = $6
             WHERE id = $7 RETURNING *`,
            [
                courseCode.trim().toUpperCase(),
                courseName.trim(),
                parseInt(creditHours, 10),
                instructor.trim(),
                parseInt(availableSeats, 10),
                status,
                id
            ]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Course updated successfully.',
            course: updateRes.rows[0]
        });
    } catch (err) {
        console.error('[Admin Update Course Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to update course.'
        });
    }
});

// DELETE /api/admin/courses/:id - Delete Course
router.delete('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM courses WHERE id = $1', [id]);
        return res.json({
            success: true,
            message: 'Course deleted successfully.'
        });
    } catch (err) {
        console.error('[Admin Delete Course Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete course.'
        });
    }
});

// --- REQUESTS MANAGEMENT ---

// GET /api/admin/requests - List All Requests
router.get('/requests', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.id, r.student_id, r.course_id, r.status, r.requested_at, r.processed_at,
                   s.full_name as student_name, s.student_number, s.department,
                   c.course_code, c.course_name, c.credit_hours, c.instructor
            FROM registration_requests r
            JOIN students s ON r.student_id = s.id
            JOIN courses c ON r.course_id = c.id
            ORDER BY r.requested_at DESC
        `);

        return res.json({
            success: true,
            requests: result.rows
        });
    } catch (err) {
        console.error('[Admin Get Requests Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch registration requests.'
        });
    }
});

// PATCH /api/admin/requests/:id/approve - Approve Request
router.patch('/requests/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;

        const updateRes = await db.query(
            `UPDATE registration_requests SET status = 'APPROVED', processed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
            [id]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Registration request approved successfully.',
            request: updateRes.rows[0]
        });
    } catch (err) {
        console.error('[Admin Approve Request Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to approve request.'
        });
    }
});

// PATCH /api/admin/requests/:id/reject - Reject Request
router.patch('/requests/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;

        const updateRes = await db.query(
            `UPDATE registration_requests SET status = 'REJECTED', processed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
            [id]
        );

        if (updateRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found.'
            });
        }

        return res.json({
            success: true,
            message: 'Registration request rejected.',
            request: updateRes.rows[0]
        });
    } catch (err) {
        console.error('[Admin Reject Request Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to reject request.'
        });
    }
});

module.exports = router;

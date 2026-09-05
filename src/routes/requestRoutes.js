const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/requests/my - Get Logged in Student Requests
router.get('/my', requireRole('STUDENT'), async (req, res) => {
    try {
        let studentId = (req.user && req.user.studentId) || (req.session && req.session.user && req.session.user.studentId);
        if (!studentId && req.user && req.user.id) {
            const stRes = await db.query('SELECT id FROM students WHERE user_id = $1', [req.user.id]);
            if (stRes.rows.length > 0) {
                studentId = stRes.rows[0].id;
            }
        }

        if (!studentId) {
            return res.json({ success: true, requests: [] });
        }

        const result = await db.query(
            `SELECT r.id, r.student_id, r.course_id, r.status, r.requested_at, r.processed_at,
                    c.course_code, c.course_name, c.credit_hours, c.instructor
             FROM registration_requests r
             JOIN courses c ON r.course_id = c.id
             WHERE r.student_id = $1
             ORDER BY r.requested_at DESC`,
            [studentId]
        );

        return res.json({
            success: true,
            requests: result.rows
        });
    } catch (err) {
        console.error('[Get My Requests Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch registration requests.'
        });
    }
});

// POST /api/requests - Submit Registration Request
router.post('/', requireRole('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.body;
        let studentId = (req.user && req.user.studentId) || (req.session && req.session.user && req.session.user.studentId);
        if (!studentId && req.user && req.user.id) {
            const stRes = await db.query('SELECT id FROM students WHERE user_id = $1', [req.user.id]);
            if (stRes.rows.length > 0) {
                studentId = stRes.rows[0].id;
            }
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student profile not found. Please contact administration.'
            });
        }

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Please specify a valid course.'
            });
        }

        // Check if course exists and has available seats
        const courseRes = await db.query('SELECT * FROM courses WHERE id = $1', [courseId]);
        if (courseRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            });
        }

        const course = courseRes.rows[0];
        if (course.status !== 'AVAILABLE' || course.available_seats <= 0) {
            return res.status(400).json({
                success: false,
                message: 'This course is currently unavailable for registration.'
            });
        }

        // Check for existing registration request
        const existingRes = await db.query(
            'SELECT * FROM registration_requests WHERE student_id = $1 AND course_id = $2',
            [studentId, courseId]
        );

        if (existingRes.rows.length > 0) {
            const existing = existingRes.rows[0];
            return res.status(400).json({
                success: false,
                message: `You have already submitted a request for this course. Current status: ${existing.status}`
            });
        }

        // Create new request
        const insertRes = await db.query(
            'INSERT INTO registration_requests (student_id, course_id, status) VALUES ($1, $2, $3) RETURNING *',
            [studentId, courseId, 'PENDING']
        );

        return res.json({
            success: true,
            message: 'Registration request submitted successfully.',
            request: insertRes.rows[0]
        });

    } catch (err) {
        console.error('[Submit Request Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to complete the request.'
        });
    }
});

module.exports = router;
